const TOKENSECRET = "tokenSecret";
const MYSQL_CONFIG = {
	host: "localhost",
	user: "root",
	password: "root",
	database: "about-picture",
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
};

const REDIS_CONIFG = {
	host: "127.0.0.1",
	port: 6379,
};

module.exports = {
	TOKENSECRET,
	MYSQL_CONFIG,
	REDIS_CONIFG,
};
