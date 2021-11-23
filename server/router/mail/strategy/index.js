const register = (params) => {
  const { mail , code} = params;
  return {
    from: '"Hale" <wode163_youjian@163.com>',
    to: `"Gust" <${mail}>`,
    subject: '邮件验证',
    text: '邮箱123',
    html: `<h1>你好，这是一封来自NodeMailer的邮件！</h1><p>${code}</p>`,
  };
}

module.exports = {
  register
}