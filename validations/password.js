const { body } = require('express-validator');

const passwordValidation = [
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password can not be empty.')
    .custom((value) => {
      if (value === process.env.ADMIN_PASSWORD) {
        return true;
      }

      throw Error('Password does not match with the Admin password.');
    }),
];

module.exports = passwordValidation;
