const express = require("express");
const { exportfunc, queryGenerator } = require("./database");
const bodyParser = require('body-parser')
const app = express();
var cors = require('cors');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
var { refineInput } = require("./asserts");
var schema = buildSchema(`

type Query{
    hello:String
    getPropertyQuestions(domainName:String):[Question]
    getAutomobilePropertyAnswers(properties:[propertyans]):[AUTO]
    getCollegePropertyAnswers(properties:[propertyans]):[COLL]
    Getand(iuy:[Cu]):[COLL]
}
input Cu{
    a:String
    b:String
}

type Question{
    propertyName:String
    propertyQuestion:String
    displayorder:Int
    propertyDisplayType:String
    allowedValues:[Allows]
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
    hello: () => {
        return 'hello world!';
    },
    Getand: (it) => {
        console.log("yup");
        return [{ name: 'hello', url: 'g' }];
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

        // res.forEach(async (ele1) => {
        //     let dname = ele1.domainName;
        //     let pname = ele1.propertyName;
        //     ele1.allowedValues = [];
        //     const res1 = await exportfunc(queryGenerator('propertydetail', ['domainName', 'propertyName']), [dname, pname]);
        //     await res1.forEach((ele) => {
        //         ele1.allowedValues.push({
        //             "allowedValue": ele.allowedValue,
        //             "allowedValueCode": ele.allowedValueCode
        //         })
        //     })
        //     return res
        // });

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
    }
}
// app.use(cors);


app.use('/graphql', cors(), graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

app.listen(4000, () => {
    console.log("Yes!")
});

//const params = ['4', '6', '3'];
//const query = queryGenerator('autofacttable', ['bodyStyle', 'make', 'age']);

//exportfunc(query,params).then(res=>console.log(res));


