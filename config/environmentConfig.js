const config = {
  production: {
    connectionString:
      `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@` +
      `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    baseUrl: process.env.BASE_URL,
    frontendBaseUrl: process.env.FRONTEND_BASE_URL,
    mailGunApiKey: process.env.MAILGUN_API_KEY,
    mailGunDomain: process.env.MAILGUN_DOMAIN,
    mailSentFrom: process.env.MAIL_SENT_FROM
  },
  test: {
    connectionString: 'mongodb://localhost/drqmuller_test',
    baseUrl: 'http://localhost:5000',
    frontendBaseUrl: 'http://localhost:8081',
    mailGunApiKey: 'key-5cc62710de03e82e4e5985ffaa7b6115',
    mailGunDomain: 'sandboxbd5eb4fadeb8426580775a1abe106ac5.mailgun.org',
    mailSentFrom: 'no-reply@drqmuller.com'
  },
  development: {
    connectionString: 'mongodb://localhost/drqmuller',
    baseUrl: 'http://localhost:5000',
    frontendBaseUrl: 'http://localhost:3000',
    mailGunApiKey: 'key-5cc62710de03e82e4e5985ffaa7b6115',
    mailGunDomain: 'sandboxbd5eb4fadeb8426580775a1abe106ac5.mailgun.org',
    mailSentFrom: 'no-reply@drqmuller.com'
  }
};

exports.get = function get(env) {
  return config[env] || config.development;
};
