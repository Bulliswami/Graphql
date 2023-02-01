const express = require("express");
const { exportfunc, queryGenerator } = require("./database-connection");
const app = express();
var cors = require('cors');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
var { refineInput } = require("./asserts");
const { makeQuery } = require("./asserts");

var schema = buildSchema(`
type Query{
    getAutomobilePropertyAnswers(properties:[propertyans]):[AUTO]
    getPropertyQuestions(domainName:String):[Question]
    getCollegePropertyAnswers(properties:[propertyans]):[COLL]
    Insertbookmark(userid:String!,domainName:String!,bname:String!,bookmark:String):Boolean!
    getBookmarks(userid:String!,domainName:String!,bname:String):[Bres]
    deleteBookmark(userid:String!,domainName:String!,bname:String):Boolean!
}

type Question{
    propertyName:String
    propertyQuestion:String
    displayorder:Int
    propertyDisplayType:String
    allowedValues:[Allows]
}

type Bres{
    userid:String
    domainName:String
    bname:String
    bookmark:String
}


type Allows{
    allowedValue:String
    allowedValueCode:String
}

type AUTO{
    autoID:String
    url:String
}

type COLL{
    name:String
    url:String
}

input propertyans{
    question:String
    qno:Int
    property:String
    values:[allows]
}

input allows{
    name:String
    val:String
    key:String
}
`);

var root = {
    getPropertyQuestions: async (inp) => {
        const query = queryGenerator('property', ['domainName'])
        const params = [inp.domainName]
        const res = await exportfunc(query, params);
        for (const ele1 of res) {
            let dname = ele1.domainName;
            let pname = ele1.propertyName;
            ele1.allowedValues = [];
            const res1 = await exportfunc(queryGenerator('propertydetail', ['domainName', 'propertyName']), [dname, pname]);
            await res1.forEach((ele) => {
                ele1.allowedValues.push({
                    "allowedValue": ele.allowedValue,
                    "allowedValueCode": ele.allowedValueCode
                })
            })
        }
        res.sort((a, b) => a.displayorder - b.displayorder)
        return res;
    },
    getPropertyQuestions: async (inp) => {
        const query = queryGenerator('property', ['domainName'])
        const params = [inp.domainName]
        const res = await exportfunc(query, params);
        for (const ele1 of res) {
            let dname = ele1.domainName;
            let pname = ele1.propertyName;
            ele1.allowedValues = [];
            const res1 = await exportfunc(queryGenerator('propertydetail', ['domainName', 'propertyName']), [dname, pname]);
            await res1.forEach((ele) => {
                ele1.allowedValues.push({
                    "allowedValue": ele.allowedValue,
                    "allowedValueCode": ele.allowedValueCode
                })
            })
        }
        res.sort((a, b) => a.displayorder - b.displayorder)
        console.log(res);
        return res;
    },
    getAutomobilePropertyAnswers: async (inp) => {
        const res = refineInput(inp.properties, "auto");
        const querytorun = res.query
        const vals = res.vals
        const result = await exportfunc(querytorun, vals);
        return result;
    },
    getCollegePropertyAnswers: async (inp) => {
        const res = refineInput(inp.properties, "clg");
        const querytorun = res.query
        const vals = res.vals
        const result = await exportfunc(querytorun, vals);
        return result;
    },
    getBookmarks: async ({ userid, domainName }) => {
        query = makeQuery(["userid", "domainName"], "userbookmark", [1, 1]);
        const res = await exportfunc(query, [userid, domainName]);
        return res
    },
    Insertbookmark: async ({ userid, domainName, bname, bookmark }) => {
        let query = "INSERT INTO userbookmark (userid,domainName,bname,bookmark) values(?,?,?,?)";
        let checkquery = "SELECT * FROM user"
        let precheckquery = "SELECT * FROM userbookmark where domainName=?";
        const res1 = await exportfunc(precheckquery, [domainName]);
        const data = res1.map(e => e.bname);
        if (data.find((r) => r == bname)) {
            return false
        }
        const checkres = await exportfunc(checkquery);
        if (!checkres.map(ele => ele.userid).includes(userid)) {
            let redq = "insert into user (userid) values(?)";
            await exportfunc(redq, [userid]);
        }
        const res = await exportfunc(query, [userid, domainName, bname, bookmark]);
        return true
    },
    deleteBookmark: async ({ userid, domainName, bname }) => {
        let query = "DELETE FROM userbookmark WHERE userid=? AND domainName=? AND bname = ?";

        const res = await exportfunc(query, [userid, domainName, bname]);
        return true;
    }
}
app.use('/graphql', cors(), graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))
app.listen(4000, () => {
    console.log("Yes Running on port 4000!")
});



