const mongoose = require('mongoose');

module.exports = function ({ dealId, userId }) {
  return this.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(dealId) } },
    {
      // join collections
      $lookup: {
        from: 'votes',
        localField: '_id',
        foreignField: 'postId',
        as: 'votes',
      },
    },
    {
      $lookup: {
        from: 'users',
        let: { postedBy: '$postedBy' }, // localField
        pipeline: [
          {
            // match with foreign field _id
            $match: {
              $expr: { $eq: ['$_id', '$$postedBy'] },
            },
          },
          { $project: { _id: 1, avatar: 1, username: 1 } },
        ],
        as: 'postedBy',
      },
    },
    { $unwind: '$postedBy' },
    {
      $addFields: {
        upvotes: {
          $size: {
            $filter: {
              input: '$votes',
              as: 'votes',
              cond: { $eq: ['$$votes.type', 1] },
            },
          },
        },
        downvotes: {
          $size: {
            $filter: {
              input: '$votes',
              as: 'votes',
              cond: { $eq: ['$$votes.type', 0] },
            },
          },
        },
        likes: {
          $arrayElemAt: [
            // access the first item in array
            {
              $filter: {
                input: '$votes',
                as: 'votes',
                cond: {
                  $eq: [{ $toString: '$$votes.userId' }, userId],
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $addFields: {
        score: {
          $subtract: ['$upvotes', '$downvotes'],
        },

        likes: '$likes.type',
      },
    },
    {
      $unset: ['votes', '__v'],
    },
  ]);
};
