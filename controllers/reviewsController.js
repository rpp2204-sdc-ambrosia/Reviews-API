const { Review } = require('../model/non_relational/reviews.js');
// const db = require('../databases/non_relational_db/db');

const getReviews = async (req, res, next) => {
  const { product_id, page, count } = req.query;

  const productId = Number(product_id);
  const pageNumber = Number(page);
  const pageSize = Number(count);

  const response = { product_id, page: pageNumber, count: pageSize };

  const list = await Review.aggregate([
    {
      $match: { product_id: productId },
    },
    {
      $skip: pageSize * pageNumber,
    },
    {
      $limit: pageSize,
    },
    {
      $project: {
        review_id: '$review_id',
        rating: '$rating',
        summary: '$summary',
        recommend: '$recommend',
        response: '$response',
        body: '$body',
        date: '$date',
        reviewer_name: '$reviewer_name',
        helpfulness: '$helpfulness',
        photos: '$photos',
      },
    },
    { $unset: '_id' },
  ]).exec();

  response.results = list;

  res.status(200).send(response);
};

const postReview = async (req, res, next) => {
  const list = await Review.find();

  res.status(200).send(list);
};

module.exports = { getReviews };
