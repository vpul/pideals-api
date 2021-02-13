const router = require('express').Router();
const {
  createDeal,
  getAllDeals,
  getDealById,
  getDealsByCategory,
  search,
} = require('../controller/dealsController');
const { createVote, deleteVote } = require('../controller/voteController');
const { createComment } = require('../controller/commentController');
const validateToken = require('../middleware/validateToken');

router
  .post('/', validateToken(), createDeal)
  .get('/', validateToken({ optionalAuth: true }), getAllDeals)
  .get('/search', search)
  .get('/:id', validateToken({ optionalAuth: true }), getDealById)
  .get('/category/:category', getDealsByCategory)
  .post('/:id/vote', validateToken(), createVote)
  .delete('/:id/vote', validateToken(), deleteVote)
  .post('/:id/comment', validateToken(), createComment);

module.exports = router;
