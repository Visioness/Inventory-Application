const { Router } = require('express');
const { listGames } = require('../controllers/indexController');

const router = Router();

router.get('/', listGames);

module.exports = router;
