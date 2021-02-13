const router = require('express').Router();
const { createCategory, getAllCategories } = require('../controller/categoriesController');

router.post('/', createCategory);
router.get('/', getAllCategories);

module.exports = router;
