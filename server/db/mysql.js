const mysql = require("mysql");
const { MYSQL_CONFIG } = require("../config");
const pool = mysql.createPool(MYSQL_CONFIG);
// pool.query("SELECT * FROM users", function (error, results, fields) {
//     if (error) throw error;
//     console.log("The solution is: ", results[0]);
//     console.log("fields are : ", fields);
// });
// 执行 sql 方法
const executeSql = (sql) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    });
};

const executeTransaction = (statement, params) => {
    return new Promise((resolve, reject) => {
        const conn = pool.getConnection();
        conn.beginTransaction(function (err) {
            if (err) throw err;
            conn.query("INSERT INTO posts SET title=?", ...params, function (error, results, fields) {
                if (error) {
                    return conn.rollback(function () {
                        throw error;
                    });
                }

                var log = "Post " + results.insertId + " added";

                conn.query("INSERT INTO log SET data=?", log, function (error, results, fields) {
                    if (error) {
                        return conn.rollback(function () {
                            throw error;
                        });
                    }
                    conn.commit(function (err) {
                        if (err) {
                            return conn.rollback(function () {
                                throw err;
                            });
                        }
                        console.log("success!");
                    });
                });
            });
        });
    });
};
// executeSql("SELECT * FROM ausers")
//     .then((result) => {
//         console.log("The solution is: ", result[0]);
//     })
//     .catch((err) => {
//         console.log(err.sqlMessage);
//     });
// const cityList = ["深圳", "厦门", "西藏", "河南", "天津", "北京", "南京", "西京", "东京"];
// for (let i = 0; i < 1000; i++) {
//     const random = Math.floor(Math.random() * 9);
//     const id = Math.floor(Math.random() * i * 10);
//     const city = cityList[random];
//     const sql = `INSERT INTO city_memory(city, country_id) VALUES('${city}',${id})`;
//     executeSql(sql);
// }

module.exports = executeSql;
