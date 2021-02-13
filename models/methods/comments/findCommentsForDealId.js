const mongoose = require('mongoose');

module.exports = function ({ dealId, userId }) {
  return this.aggregate([
    { $match: { dealId: mongoose.Types.ObjectId(dealId) } },
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
      // lookup comment author data
      $lookup: {
        from: 'users',
        let: { userId: '$userId' },
        pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
          { $project: { _id: 1, avatar: 1, username: 1 } },
        ],
        as: 'commentedBy',
      },
    },
    { $unwind: '$commentedBy' },
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
              cond: { $eq: ['$$votes.type', -1] },
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
    { $sort: { createdAt: 1 } }, // oldest first
  ]);
};
