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
