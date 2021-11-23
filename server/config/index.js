const TOKENSECRET = "tokenSecret";
const MYSQL_CONFIG = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "about-picture",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const REDIS_CONIFG = {
  host: "127.0.0.1",
  port: 6379
};

const MAIL_CONFIG = {
  service: "smtp.163.com",
  host: "smtp.163.com",
  secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
  port: 465,
  auth: {
    user: "wode163_youjian@163.com",
    pass: "xxx"
  }
};

module.exports = {
  TOKENSECRET,
  MYSQL_CONFIG,
  REDIS_CONIFG,
  MAIL_CONFIG
};
