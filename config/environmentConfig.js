const config = {
  production: {
    connectionString:
      `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@` +
      `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    baseUrl: process.env.BASE_URL,
    frontendBaseUrl: process.env.FRONTEND_BASE_URL
  },
  test: {
    connectionString: 'mongodb://localhost/drqmuller_test',
    baseUrl: 'http://localhost:5000',
    frontendBaseUrl: 'http://localhost:3000'
  },
  default: {
    connectionString: 'mongodb://localhost/drqmuller_test',
    baseUrl: 'http://localhost:5000',
    frontendBaseUrl: 'http://localhost:3000'
  }
};

exports.get = function get(env) {
  return config[env] || config.default;
};
