const fs = require('fs');
const _ = require('lodash');

const environmentConfig = require('../config/environmentConfig');

const {
  mailGunApiKey,
  mailGunDomain,
  mailSentFrom
} = environmentConfig.get(process.env.NODE_ENV);
const mailGun = require('mailgun-js')({
  apiKey: mailGunApiKey,
  domain: mailGunDomain
});
const ejs = require('ejs');

module.exports.send = (to, subject, templatePath, templateData, callback) => {
  fs.readFile(templatePath, 'utf-8', (error, template) => {
    if (error) {
      return callback(error);
    }
    const data = {
      from: mailSentFrom,
      to,
      subject,
      html: ejs.render(template, templateData)
    };

    mailGun.messages().send(data, (sendMailError, body) => {
      if (error) {
        return callback(sendMailError);
      }
      if (!_.includes(body.message.toLowerCase(), 'queued')) {
        const emailError = `Email with content ${data.html} was not sent to ${to}.
        Due to reason: ${body.message}`;
        return callback(new Error(emailError));
      }
      // TODO: Log to MailerLog
      callback(null);
    });
  });
};
