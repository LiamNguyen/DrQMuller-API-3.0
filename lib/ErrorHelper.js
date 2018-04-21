module.exports = {
  getError: (error, message) =>
    new Error(`${message}. ${error == null ? '' : error}`)
};
