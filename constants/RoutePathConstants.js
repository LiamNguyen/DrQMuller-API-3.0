const server = require('../server');
module.exports.getEmailTemplatePath = () =>
  `${server.rootDirectory}/view/EmailTemplates`;
