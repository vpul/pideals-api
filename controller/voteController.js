const VotesModel = require('../models/votes');

const createVote = async (req, res, next) => {
  try {
    const alreadyVoted = await VotesModel.findOne({
      postId: req.params.id,
      userId: res.locals.sub,
    });

    if (alreadyVoted) {
      if (alreadyVoted.type !== req.body.type) {
        alreadyVoted.type = req.body.type;
        await alreadyVoted.save();
      }
      return res.json({
        status: 'success',
        payload: alreadyVoted,
      });
    }

    // if not already voted
    const vote = await VotesModel.create({
      postId: req.params.id,
      userId: res.locals.sub,
      type: req.body.type,
    });

    return res.json({
      status: 'success',
      payload: vote,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteVote = async (req, res, next) => {
  try {
    await VotesModel.deleteOne({
      postId: req.params.id,
      userId: res.locals.sub,
    });

    return res.json({
      status: 'success',
      payload: {},
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createVote,
  deleteVote,
};
