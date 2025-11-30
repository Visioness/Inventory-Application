const { Router } = require('express');
const {
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoriesController');

const router = Router();

router.post('/new', createCategory);
router.post('/:categoryId/update', updateCategory);
router.post('/:categoryId/delete', deleteCategory);

module.exports = router;
