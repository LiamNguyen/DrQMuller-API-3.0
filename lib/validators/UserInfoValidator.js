const _ = require('lodash');
const ValidationHelper = require('../ValidationHelper');

const {
  isValidName,
  isValidAddress,
  isValidDob,
  isValidGender,
  isValidEmail,
  isValidPhone
} = ValidationHelper;

exports.validate = ({
  name,
  address,
  dob,
  gender,
  email,
  phone
}) =>
  (
    name && !_.isEmpty(name) && isValidName(name) &&
      address && !_.isEmpty(address) && isValidAddress(address)
  ) ||
  (
    dob && !_.isEmpty(dob) && isValidDob(dob) &&
      gender && !_.isEmpty(gender) && isValidGender(gender)
  ) ||
  (
    email && !_.isEmpty(email) && isValidEmail(email) &&
      phone && !_.isEmpty(phone) && isValidPhone(phone)
  );
