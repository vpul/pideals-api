const Joi = require('joi');
const createError = require('http-errors');

const validationSchema = Joi.object({
  avatar: Joi.string().required(),

  username: Joi.string().min(1).max(26).required(),

  email: Joi.string().email().required(),

  password: Joi.string()
    .required()
    .min(6)
    .max(128)
    .error(new Error('Password must be at least 6 characters long.')),
});

module.exports = (req, res, next) => {
  try {
    const { error } = validationSchema.validate(req.body);

    if (error) {
      return next(createError(422, error.message));
    }
    return next();
  } catch (err) {
    return next(err);
  }
};
