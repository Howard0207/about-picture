const TOKENSECRET = "tokenSecret";
const MYSQL_CONFIG = {
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "root",
    database: "electrical-graphic",
};

const REDIS_CONIFG = {
    host: "127.0.0.1",
    port: 6379,
};

module.exports = {
    TOKENSECRET,
    MYSQL_CONFIG,
};
