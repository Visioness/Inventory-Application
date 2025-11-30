const db = require('../db/queries');
const { validationResult, matchedData } = require('express-validator');
const gameValidation = require('../validations/game');
const passwordValidation = require('../validations/password');

let title = 'Game Inventory';
let subtitle = 'All Games';

const showGame = async (req, res) => {
  const { gameId } = req.params;
  const game = await db.getGameById(gameId);
  const categories = await db.getAllCategories();

  res.render('game', { title, game, categories });
};

const createGame = [
  gameValidation,
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

    const { name, description, price } = matchedData(req);
    await db.createGame(name, description, Number(price));

    const categories = await db.getAllCategories();
    const games = await db.getAllGames();

    res.render('index', {
      title,
      subtitle,
      categories,
      games,
      toast: { type: 'success', message: 'Game created successfully' },
    });
  },
];

const updateGame = [
  gameValidation,
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

    const { gameId } = req.params;
    const { name, description, price } = matchedData(req);
    await db.updateGame(gameId, name, description, Number(price));

    const categories = await db.getAllCategories();
    const games = await db.getAllGames();

    res.render('index', {
      title,
      subtitle,
      categories,
      games,
      toast: { type: 'success', message: 'Game updated successfully' },
    });
  },
];

const deleteGame = [
  passwordValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        success: false,
        errors: errors.array(),
      });
    }

    const { gameId } = req.params;
    await db.deleteGame(Number(gameId));
    res.send({
      success: true,
      message: 'Game deleted successfully',
    });
  },
];

const addCategoryToGame = async (req, res) => {
  const { gameId } = req.params;
  const { categoryId } = req.body;

  await db.addCategoryToGame(Number(gameId), Number(categoryId));

  const game = await db.getGameById(gameId);
  const categories = await db.getAllCategories();

  res.render('game', {
    title,
    game,
    categories,
    toast: { type: 'success', message: 'Category added to game' },
  });
};

const removeCategoryFromGame = async (req, res) => {
  const { gameId } = req.params;
  const { categoryId } = req.body;

  await db.removeCategoryFromGame(Number(gameId), Number(categoryId));

  const game = await db.getGameById(gameId);
  const categories = await db.getAllCategories();

  res.render('game', {
    title,
    game,
    categories,
    toast: { type: 'success', message: 'Category removed from game' },
  });
};

module.exports = {
  showGame,
  createGame,
  updateGame,
  deleteGame,
  addCategoryToGame,
  removeCategoryFromGame,
};
