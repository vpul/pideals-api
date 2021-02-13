const createError = require('http-errors');
const UserModel = require('../models/users');

const findByUsername = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ username: req.params.username });
    if (user) {
      return res.status(200).json({
        status: 'success',
        payload: user,
      });
    }

    return next(createError(404, 'User not found.'));
  } catch (err) {
    return next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await UserModel.findById(res.locals.sub);
    if (user) {
      return res.status(200).json({
        status: 'success',
        payload: user,
      });
    }

    return next(createError(404, 'User not found.'));
  } catch (err) {
    return next(err);
  }
};

module.exports = { findByUsername, getCurrentUser };
