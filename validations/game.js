const { body } = require('express-validator');

const gameValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Game name can not be empty.')
    .matches(/^[\p{L}\p{M}\p{N}\s,'.-]+$/u)
    .withMessage('Game name contains invalid characters.'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Game description can not be empty.')
    .isLength({ min: 20, max: 1000 })
    .withMessage('Game description must be between 20 and 1000 characters.'),
  body('price')
    .trim()
    .notEmpty()
    .withMessage('Game price can not be empty.')
    .isFloat({ min: 0 })
    .withMessage('Game price must be floating number.'),
];

module.exports = gameValidation;
