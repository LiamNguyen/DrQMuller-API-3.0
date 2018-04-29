/* eslint-disable */

const finnish = 'A-Za-zäöÄÖåÅéÉüÜ';
const fiWithDigits = finnish + '0-9';
const emailSymbols = "!#$%&'.*+\\-\\/=?^_`{|}~";

module.exports = {
  isStrong(password) {
    return /^(?=.*[a-zA-Z])(?=.*[!@#$&*0-9]).{8,}$/.test(password);
  },

  isValidUsername(username) {
    return new RegExp(
      `^[${fiWithDigits}!#$%&\'*+\\/=?^_\`{|}~]` +
        `[${fiWithDigits}${emailSymbols}@]{4,62}` +
        `[${fiWithDigits}!#$%&\'*+\\/=?^_\`{|}~]$`
    ).test(username);
  },

  isValidUUID(token) {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
      token
    );
  },

  isValidEmail(email) {
    return new RegExp(
      `^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z\`{|}~])` +
        `*@[a-zA-Z0-9](-?\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$`
    ).test(email);
  },

  isValidAddress(address) {
    return new RegExp(
      `^[${fiWithDigits}]` +
        `[${fiWithDigits}\\-.,\\/\\s'"]{0,48}` +
        `[${fiWithDigits}]$`
    ).test(address);
  },

  isValidName(name) {
    return new RegExp(`^[${finnish}\\-.\\s']{0,50}$`).test(name);
  },

  isValidDob(dob) {
    return /^(19|20)\d\d[- \/.](0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])/.test(
      dob
    );
  },

  isValidGender(gender) {
    return /^(?:Male|Female)$/.test(gender);
  },

  isValidPhone(phone) {
    return /^\+?[0-9]+[0-9\-\s]+\\?([0-9]+\\)?[0-9\-\s]+[0-9]$/.test(phone);
  },

  isValidDate(date) {
    return /^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/.test(date);
  },

  isValidTime(time) {
    return /^([0-1][0-9]|[2][0-2]):[0-5][0-9]$/.test(time);
  }
};
