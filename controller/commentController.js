const CommentModel = require('../models/comments');

const createComment = async (req, res, next) => {
  try {
    const comment = await CommentModel.create({
      dealId: req.params.id,
      userId: res.locals.sub,
      ...req.body,
    });

    return res.json({
      status: 'success',
      payload: comment,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createComment,
};
