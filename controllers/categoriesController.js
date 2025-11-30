const db = require('../db/queries');
const { body, validationResult, matchedData } = require('express-validator');

const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name can not be empty.')
    .not()
    .contains(',')
    .withMessage('Category name can not contain comma ","'),
];

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

const createCategory = [
  categoryValidation,
  async (req, res) => {
    let title = 'Game Inventory';
    const categories = await db.getAllCategories();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('index', {
        title,
        subtitle: 'Category Error',
        categories,
        categoryErrors: errors.array(),
      });
    }

    const { name } = matchedData(req);
    await db.createCategory(name);
    res.redirect('/');
  },
];

const updateCategory = [
  categoryValidation,
  async (req, res) => {
    let title = 'Game Inventory';
    const categories = await db.getAllCategories();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('index', {
        title,
        subtitle: 'Category Error',
        categories,
        categoryErrors: errors.array(),
      });
    }

    const { categoryId } = req.params;
    const { name } = matchedData(req);
    await db.updateCategory(Number(categoryId), name);
    res.redirect('/');
  },
];

const deleteCategory = [
  passwordValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        success: false,
        errors: errors.array(),
      });
    }

    const { categoryId } = req.params;
    await db.deleteCategory(Number(categoryId));
    res.send({
      success: true,
    });
  },
];

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
};
