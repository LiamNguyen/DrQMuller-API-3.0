const uuidv1 = require('uuid/v1');

const MailLogger = require('../database/models/mailLogger');

module.exports.create = (type, recipient, content, mailSenderResponse) => {
  const id = uuidv1();

  MailLogger.create({
    id,
    type,
    recipient,
    content,
    mailSenderResponse
  });
};
