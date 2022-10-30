const { Review } = require('../model/reviews.js');
const { ReviewMeta } = require('../model/reviewsMeta.js');

const getReviews = async (req, res, next) => {
  const { product_id, page, count } = req.query;

  const productId = Number(product_id);
  const pageNumber = Number(page);
  const pageSize = Number(count) === 0 ? 5 : Number(count);

  const response = { product_id, page: pageNumber, count: pageSize };

  try {
    const list = await Review.find({ product_id: productId })
      .where({ reported: false })
      .skip(pageSize * pageNumber)
      .limit(pageSize)
      .select({ _id: 0, reported: 0, reviewer_email: 0, product_id: 0 })
      .lean();

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
    const lastReview = await Review.find({})
      .sort({ review_id: -1 })
      .limit(1)
      .lean();

    //find last review id in collection
    //if it doesn't exist, 0 will be our starting point
    const lastReviewId =
      lastReview[0] === undefined ? 0 : lastReview[0].review_id;

    //convert photos to array of objects with photos url
    //if photos undefined or empty array return empty array
    const newPhotos =
      photos === undefined || photos.length === 0
        ? []
        : photos.map((item) => {
            return { url: item };
          });

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
      photos: newPhotos,
    });

    //find the product id for the review and update the metadata
    const promise = await ReviewMeta.find({ product_id }).lean();

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

    //optimization: save new review and update meta in parallel
    const [newReview, updateMeta] = await Promise.all([
      review.save(),
      ReviewMeta.findOneAndUpdate({ product_id }, transformObj),
    ]);

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
