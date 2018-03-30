const config = {
  production: {
    connectionString:
      `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@` +
      `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  },
  default: {
    connectionString: 'mongodb://localhost/drqmuller'
  }
};

exports.get = function get(env) {
  return config[env] || config.default;
};
