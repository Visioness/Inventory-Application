const db = require('../db/queries');
const { validationResult, matchedData } = require('express-validator');
const categoryValidation = require('../validations/category');
const passwordValidation = require('../validations/password');

let title = 'Game Inventory';
let subtitle = 'All Games';

const createCategory = [
  categoryValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const categories = await db.getAllCategories();
      const games = await db.getAllGames();

      return res.status(400).render('index', {
        title,
        subtitle,
        categories,
        games,
        toast: {
          type: 'error',
          message: errors
            .array()
            .map((e) => e.msg)
            .join('<br>'),
        },
      });
    }

    const { name } = matchedData(req);
    await db.createCategory(name);

    const categories = await db.getAllCategories();
    const games = await db.getAllGames();

    res.render('index', {
      title,
      subtitle,
      categories,
      games,
      toast: { type: 'success', message: 'Category created successfully' },
    });
  },
];

const updateCategory = [
  categoryValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const categories = await db.getAllCategories();
      const games = await db.getAllGames();

      return res.status(400).render('index', {
        title,
        subtitle,
        games,
        categories,
        toast: {
          type: 'error',
          message: errors
            .array()
            .map((e) => e.msg)
            .join('<br>'),
        },
      });
    }

    const { categoryId } = req.params;
    const { name } = matchedData(req);
    await db.updateCategory(Number(categoryId), name);

    const categories = await db.getAllCategories();
    const games = await db.getAllGames();

    res.render('index', {
      title,
      subtitle,
      games,
      categories,
      toast: { type: 'success', message: 'Category updated successfully' },
    });
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
      message: 'Category deleted successfully',
    });
  },
];

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
};
