const express = require('express');
const { getReviews } = require('../controllers/reviewsController');

const router = express.Router();

router.get('/reviews', getReviews);

module.exports = {
  routes: router,
};
