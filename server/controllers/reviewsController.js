const { Review } = require('../model/reviews.js');
const { ReviewMeta } = require('../model/reviewsMeta.js');

const getReviews = async (req, res, next) => {
  const { product_id, page, count } = req.query;

  const productId = Number(product_id);
  const pageNumber = Number(page);
  const pageSize = Number(count);

  const response = { product_id, page: pageNumber, count: pageSize };

  try {
    const list = await Review.aggregate([
      {
        $match: { product_id: productId },
      },
      {
        $match: { reported: false },
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
    ]).exec();

    response.results = list;

    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const postReview = async (req, res, next) => {
  const {
    product_id,
    rating,
    body,
    summary,
    recommend,
    name,
    email,
    photos,
    characteristics,
  } = req.body;

  try {
    //find the last review id
    const lastReview = await Review.aggregate([
      {
        $sort: {
          review_id: -1,
        },
      },
      {
        $limit: 1,
      },
    ]);

    // const reviewId = await lastReview.review_id;
    const lastReviewId =
      lastReview[0] === undefined ? 0 : lastReview[0].review_id;

    //make new review id + 1 of the last review id
    const review = await Review.create({
      product_id,
      review_id: lastReviewId + 1,
      rating,
      summary,
      body,
      recommend,
      reviewer_name: name,
      reviewer_email: email,
      photos,
    });
    // console.log('review: ', review);
    await review.save();

    // after saving review and sending response
    //find the product id for the review and update the metadata
    const promise = await ReviewMeta.aggregate([
      {
        $match: {
          product_id: product_id,
        },
      },
    ]);

    const transformObj = Object.entries(characteristics).reduce((a, item) => {
      let id = Number(item[0]);
      let val = item[1];

      Object.entries(promise[0].characteristics).forEach((item2) => {
        let name = item2[0];
        let id2 = item2[1].id;
        let val2 = item2[1].value;

        if (id === id2) {
          const newAvg = (val + val2) / 2;
          a.characteristics[name].value = newAvg;
        }
        return;
      });

      return a;
    }, promise[0]);

    transformObj.ratings[rating]++;
    transformObj.recommended[recommend]++;

    delete transformObj._id;
    delete transformObj.product_id;

    await ReviewMeta.findOneAndUpdate({ product_id }, transformObj);

    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};

const markReviewAsHelpful = async (req, res, next) => {
  const { review_id } = req.params;
  try {
    await Review.updateOne(
      { review_id: review_id },
      {
        $inc: {
          helpfulness: 1,
        },
      }
    );
    res.sendStatus(204);
  } catch (error) {}
};

const reportReview = async (req, res, next) => {
  const { review_id } = req.params;
  try {
    await Review.updateOne(
      { review_id: review_id },
      {
        $set: {
          reported: true,
        },
      }
    );
    res.sendStatus(204);
  } catch (error) {}
};

module.exports = { getReviews, postReview, markReviewAsHelpful, reportReview };
