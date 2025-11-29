const db = require('../db/queries');
const { query, validationResult, matchedData } = require('express-validator');

const existInDatabase = async (categories) => {
  if (typeof categories === 'string') {
    categories = categories.split(',');
  }

  const promises = categories.map(async (name) => await db.getCategory(name));
  const result = await Promise.all(promises);
  if (!result.every((each) => each !== undefined)) {
    throw Error();
  }

  return true;
};

const queryValidation = [
  query('category')
    .optional()
    .trim()
    .custom(existInDatabase)
    .withMessage('Could not find the requested category in database.'),
];

const listGames = [
  queryValidation,
  async (req, res) => {
    let title, subtitle, games, filters;
    title = 'Game Inventory';

    const categories = await db.getAllCategories();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('index', {
        title,
        subtitle: 'Category Error',
        categories,
        errors: errors.array(),
      });
    }

    let { category } = matchedData(req, { includeOptionals: true });

    if (category) {
      if (!Array.isArray(category)) {
        // Empty string query
        if (category === '') {
          return res.redirect('/');
        }
        category = category.split(',');
      }

      // Filtered with categories
      games = await db.getGamesByCategories(category);
      subtitle = 'Filtered Games';
      filters = category;
    } else {
      // Non-filtered
      games = await db.getAllGames();
      subtitle = 'All Games';
    }

    res.render('index', {
      title,
      subtitle,
      categories,
      filters,
      games,
    });
  },
];

module.exports = {
  listGames,
};
