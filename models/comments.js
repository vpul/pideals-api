const mongoose = require('mongoose');
const Votes = require('./votes');
const findCommentsForDealId = require('./methods/comments/findCommentsForDealId');

const commentSchema = mongoose.Schema(
  {
    dealId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    replyToId: { type: mongoose.Schema.Types.ObjectId, default: null },
    text: { type: String, required: true },
  },
  { timestamps: true },
);

// pre save check for  parent

// auto upvote submitted comment
commentSchema.post('save', async (comment, next) => {
  try {
    const isAlreadyVoted = await Votes.findOne({
      postId: comment._id,
      userId: comment.userId,
    });
    if (!isAlreadyVoted) {
      await Votes.create({
        postId: comment._id,
        userId: comment.userId,
        type: 1, // +1 or -1
      });
    }

    return next();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      return next(error);
      // sentry
    }
  }
});

commentSchema.static('findCommentsForDealId', findCommentsForDealId);

module.exports = mongoose.model('Comment', commentSchema);
