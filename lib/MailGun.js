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

module.exports.send = (to, subject, template, templateData, callback) => {
  const data = {
    from: mailSentFrom,
    to,
    subject,
    html: ejs.render(template, templateData)
  };

  mailGun.messages().send(data, (error, body) => {
    if (error) {
      return callback(error);
    }
    // TODO: Log to MailerLog
    callback(null, body);
  });
};
