const express = require('express');
const {
  getReviews,
  postReview,
  markReviewAsHelpful,
  reportReview,
} = require('../controllers/reviewsController');
const { getReviewsMeta } = require('../controllers/reviewsMetaController');

const router = express.Router();

router.get('/reviews', getReviews);
router.get('/reviews/meta', getReviewsMeta);
router.post('/reviews', postReview);
router.put('/reviews/:review_id/helpful', markReviewAsHelpful);
router.put('/reviews/:review_id/report', reportReview);

module.exports = {
  routes: router,
};
