const mysql = require('mysql2');

const connection = mysql.createConnection({
    user: 'root',
    host: "localhost",
    password: 'root',
    database: "swami",
    multipleStatements: true
});

query = "SELECT * FROM collegefacttable where publicOrPrivate in (?) AND region in (?,?) AND state in (?) AND focus in (?)"
let params=['2', '4', '1', '26', '10']

// const makeQuery = (propames, tablename, countforEachProp) => {
//     let begin = "SELECT * FROM " + tablename + " where ";
//     let propames = ["564y", "mhardake", "try", "make"];
//     let countforEachProp = [2, 4, 1, 2];
//     for (let j = 0; j < propames.length; j++) {
//         begin += propames[j];
//         begin += " in (";
//         for (let k = 0; k < countforEachProp.length - 1; k++) {
//             begin += "?,";
//         }
//         begin += "?) AND ";
//     }
//     begin = begin.slice(0, begin.length - 4);
//     return begin;

// }

// makeQuery("A");
connection.query(query, params, (err, res) => {
    console.log(res);
});