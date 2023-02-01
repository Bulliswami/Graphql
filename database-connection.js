
const mysql = require('mysql2');
const connection = mysql.createConnection({
    user: 'root',
    host: "localhost",
    password: 'root',
    database: "swami",
    multipleStatements: true
});

var query;

function queryGenerator(tablename, params) {
    let paramslen = '';
    if (params.length == 0) {
        query = "select * from " + tablename;
        return query;
    }
    query = "select * from " + tablename + " where ";
    for (i = 0; i < params.length - 1; i++) {
        paramslen += params[i] + "= ? and ";
    }
    query += paramslen + params[params.length - 1] + " = ? ";
    return query;
}

const exportfunc = async function gc(query, params) {
    const h = await new Promise((resolve) => {
        connection.query(query, params, (err, res) => {  
            resolve(res);
        });
    })
    return h;
}

module.exports = { exportfunc, queryGenerator } 