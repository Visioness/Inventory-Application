const { Router } = require('express');
const {
  showGame,
  createGame,
  updateGame,
  deleteGame,
  addCategoryToGame,
  removeCategoryFromGame,
} = require('../controllers/gamesController');

const router = Router();

router.get('/:gameId', showGame);
router.post('/new', createGame);
router.post('/:gameId/update', updateGame);
router.post('/:gameId/delete', deleteGame);
router.post('/:gameId/addCategory', addCategoryToGame);
router.post('/:gameId/removeCategory', removeCategoryFromGame);

module.exports = router;
