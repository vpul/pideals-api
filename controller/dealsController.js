/* eslint-disable no-param-reassign */
const DealsModel = require('../models/deals');
const CommentsModel = require('../models/comments');
const getPreviewImage = require('../utils/getPreviewImage');

// We are saving preview img asynchronously because some
// webpages can take a while to load due to network latency.
const asyncSavePreviewImg = async (previewImage, deal) => {
  try {
    deal.dealImage = await previewImage;
    deal.save();
  } catch (error) {
    // sentry logger
  }
};

const createDeal = async (req, res, next) => {
  try {
    const previewImage = getPreviewImage(req.body.dealLink);
    const postedBy = res.locals.sub;
    const deal = await DealsModel.create({
      ...req.body,
      postedBy,
    });

    if (!req.body.dealImage) {
      asyncSavePreviewImg(previewImage, deal);
    }

    return res.status(201).json({
      status: 'success',
      payload: deal,
    });
  } catch (err) {
    return next(err);
  }
};

const getAllDeals = async (req, res, next) => {
  try {
    let pageNumber = Number(req.query.page) || 0;

    // we need to subtract by 1 for explicit queries
    if (req.query.page && req.query.page > 0) {
      pageNumber -= 1;
    }

    const perPage = Number(req.query.per_page) || 5;

    const dealsGroupedByDay = await DealsModel.findAndOrderByDays({
      perPage,
      pageNumber,
      userId: res.locals.sub,
    });
    const { paginatedResults, totalGroupsCount } = dealsGroupedByDay[0];

    const totalPages = Math.ceil(totalGroupsCount[0].count / perPage);

    pageNumber += 1;
    let nextPage = null;
    if (pageNumber < totalPages) {
      nextPage = pageNumber + 1;
    }

    return res.json({
      status: 'success',
      payload: {
        dealsGroupedByDay: paginatedResults,
        total: totalGroupsCount[0].count,
        perPage,
        pageNumber,
        nextPage,
      },
    });
  } catch (err) {
    return next(err);
  }
};

const getDealById = async (req, res, next) => {
  try {
    const dealPromise = DealsModel.findByIdWithDetails({
      dealId: req.params.id,
      userId: res.locals.sub,
    });

    const commentsPromise = CommentsModel.findCommentsForDealId({
      dealId: req.params.id,
      userId: res.locals.sub,
    });
    const [deal, comments] = await Promise.all([dealPromise, commentsPromise]);

    const commentsTree = [];

    // generate Comment Tree
    comments.forEach((comment) => {
      // for top level comments, push to 'commentTree'
      if (comment.replyToId === null) {
        comment.replies = [];
        commentsTree.push(comment);
      } else {
        // for second level comments, find their parent
        const index = commentsTree.findIndex((commentTreeItem) => {
          return String(commentTreeItem._id) === String(comment.replyToId);
        });
        // if parent is found, push the comment as replies
        if (index !== -1) {
          commentsTree[index].replies.push(comment);
        }
      }
    });

    return res.json({
      status: 'success',
      payload: {
        ...deal[0],
        comments: commentsTree,
      },
    });
  } catch (err) {
    return next(err);
  }
};

const getDealsByCategory = async (req, res, next) => {
  try {
    const deals = await DealsModel.findByCategory(req.params.category);
    return res.json({
      status: 'success',
      payload: deals,
    });
  } catch (err) {
    next(err);
  }
};

const search = async (req, res, next) => {
  try {
    const deals = await DealsModel.find({
      $text: { $search: req.query.q },
    }).select('image title store originalPrice finalPrice discount');
    return res.json({
      status: 'success',
      payload: deals,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createDeal,
  getAllDeals,
  getDealById,
  getDealsByCategory,
  search,
};
