module.exports = function ({ perPage, pageNumber, userId }) {
  return this.aggregate([
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
    {
      $lookup: {
        from: 'comments',
        let: { id: '$_id' },
        pipeline: [{ $match: { $expr: { $eq: ['$dealId', '$$id'] } } }], // matching dealId and id
        as: 'comments',
      },
    },
    { $unwind: '$postedBy' },
    {
      $addFields: {
        commentsCount: {
          $size: '$comments',
        },
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
      $unset: ['votes', 'comments', '__v'],
    },
    {
      // group into days
      $group: {
        _id: {
          // convert date to string so that it can be grouped
          $dateToString: {
            format: '%Y-%m-%d', // format to YYYY-MM-DD
            date: '$createdAt', // date field which in out case is 'createdAt'
          },
        },
        count: { $sum: 1 },
        deals: { $push: '$$ROOT' },
      },
    },

    { $sort: { _id: -1 } }, // newest first
    // { $skip: perPage * pageNumber },
    // { $limit: perPage },
    {
      $addFields: { date: '$_id' }, // set 'date' field as _id which are dates
    },
    {
      $project: {
        _id: false, // disable _id because we already have date field
      },
    },
    {
      // pagination and total group (which is by day) count
      $facet: {
        paginatedResults: [
          { $skip: perPage * pageNumber },
          { $limit: perPage },
        ],
        totalGroupsCount: [
          {
            $count: 'count',
          },
        ],
      },
    },
  ]);
};
