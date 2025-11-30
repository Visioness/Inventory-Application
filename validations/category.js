const { body } = require('express-validator');

const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name can not be empty.')
    .not()
    .contains(',')
    .withMessage('Category name can not contain comma ","'),
];

module.exports = categoryValidation;
