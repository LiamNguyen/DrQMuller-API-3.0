/* eslint-disable */

const finnish = 'A-Za-zäöÄÖåÅéÉüÜ';
const fiWithDigits = finnish + '0-9';
const emailSymbols = "!#$%&'.*+\\-\\/=?^_`{|}~";

module.exports =  {
  isStrong(password) {
    return /^(?=.*[a-zA-Z])(?=.*[!@#$&*0-9]).{8,}$/.test(password);
  },

  isValidUsername(username) {
    return new RegExp(
      `^[${fiWithDigits}!#$%&\'*+\\/=?^_\`{|}~]` +
      `[${fiWithDigits}${emailSymbols}@]{4,62}` +
      `[${fiWithDigits}!#$%&\'*+\\/=?^_\`{|}~]$`
    ).test(username);
  }
};
