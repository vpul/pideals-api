const CategoriesModel = require('../models/categories');
const categories = require('../constants/categories');

const createCategory = async (req, res, next) => {
  try {
    const category = await CategoriesModel.create(req.body);
    return res.status(201).json({
      status: 'success',
      payload: category,
    });
  } catch (err) {
    next(err);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    // const categories = await CategoriesModel.find();
    return res.json({
      status: 'success',
      payload: categories,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
};
