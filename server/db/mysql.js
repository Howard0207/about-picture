const mysql = require("mysql");
const { MYSQL_CONFIG } = require("..config");
const pool = mysql.createPool(MYSQL_CONFIG);
// pool.query("SELECT * FROM users", function (error, results, fields) {
//     if (error) throw error;
//     console.log("The solution is: ", results[0]);
//     console.log("fields are : ", fields);
// });
// 执行 sql 方法
const executeSql = sql => {
    return new Promise((resolve, reject) => {
        pool.query(sql, (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    });
};

// executeSql("SELECT * FROM ausers")
//     .then(result => {
//         console.log("The solution is: ", result[0]);
//     })
//     .catch(err => {
//         console.log(err.sqlMessage);
//     });

module.exports = executeSql;
