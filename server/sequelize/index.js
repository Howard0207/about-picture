const Sequelize = require("sequelize");
const { MYSQL_CONFIG } = require("../config");
const sequelize = new Sequelize(MYSQL_CONFIG.database, MYSQL_CONFIG.user, MYSQL_CONFIG.password, {
	host: config.host,
	dialect: "mysql",
	pool: {
		max: 5,
		min: 0,
		idle: 30000,
	},
});
module.exports = sequelize;
