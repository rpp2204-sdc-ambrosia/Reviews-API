const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const request = require('supertest');
const app = require('../server/app');
const { Review } = require('../server/model/reviews');
const { ReviewMeta } = require('../server/model/reviewsMeta');

describe('Reviews API', () => {
  // let connection;
  // let db;

  // beforeAll(async () => {
  //   connection = await MongoClient.connect(global.__MONGO_URI__, {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   });
  //   db = await connection.db();
  // });

  // afterAll(async () => {
  //   await connection.close();
  //   await mongoose.connection.close();
  // });

  describe('GET /reviews', () => {
    it('should respond with a 200 status code', async () => {
      const res = await request(app)
        .get('/reviews')
        .query({ product_id: 5, page: 0, count: 10 });

      expect(res.statusCode).toBe(200);
    });

    it('response should contain reviews data', async () => {
      const res = await request(app)
        .get('/reviews')
        .query({ product_id: 5, page: 0, count: 10 });

      expect(res.body.results.length).toBeGreaterThan(0);
      expect(res.body.results[0].review_id).not.toEqual(undefined);
    });

    it('response should return 2 reviews given a query param of a count of 2', async () => {
      const res = await request(app)
        .get('/reviews')
        .query({ product_id: 5, page: 0, count: 2 });

      expect(res.body.results.length).toEqual(2);
    });

    it('document format should be as expected by frontend', async () => {
      const res = await request(app)
        .get('/reviews')
        .query({ product_id: 5, page: 0, count: 2 });

      const doc = res.body.results[0];
      const docLength = Object.keys(doc).length;

      expect(doc.review_id).not.toBeUndefined();
      expect(doc.rating).not.toBeUndefined();
      expect(doc.summary).not.toBeUndefined();
      expect(doc.recommend).not.toBeUndefined();
      expect(doc.response).not.toBeUndefined();
      expect(doc.body).not.toBeUndefined();
      expect(doc.date).not.toBeUndefined();
      expect(doc.reviewer_name).not.toBeUndefined();
      expect(doc.helpfulness).not.toBeUndefined();
      expect(doc.photos).not.toBeUndefined();
      expect(docLength).toBe(10);
    });
  });

  describe('GET /reviews/meta', () => {
    it('should respond with a 200 status code', async () => {
      const res = await request(app)
        .get('/reviews/meta')
        .query({ product_id: 5 });

      expect(res.statusCode).toBe(200);
    });

    it('response body should be an object of obejcts with a ratings, recommend, and chatacteristics property', async () => {
      const res = await request(app)
        .get('/reviews/meta')
        .query({ product_id: 5 });

      expect(res.body && typeof res.body === 'object').toBe(true);
      expect(res.body.ratings && typeof res.body.ratings === 'object').toBe(
        true
      );
      expect(
        res.body.recommended && typeof res.body.recommended === 'object'
      ).toBe(true);
      expect(
        res.body.characteristics && typeof res.body.characteristics === 'object'
      ).toBe(true);
    });
  });

  describe('POST /reviews', () => {
    let lastMeta;
    beforeEach(async () => {
      lastMeta = await ReviewMeta.findOne({ product_id: 5 });
    });
    afterEach(async () => {
      await Review.findOneAndDelete({}, { sort: { _id: -1 } });

      delete lastMeta._id;

      await ReviewMeta.findOneAndUpdate({ product_id: 5 }, lastMeta);
    });

    it('should respond with a 201 status code', async () => {
      const res = await request(app)
        .post('/reviews')
        .send({
          product_id: 5,
          rating: 5,
          summary: 'test test test test',
          body: 'I love pizza test',
          recommend: true,
          name: 'dvsvsvfv',
          email: 'test@gmail.com',
          photos: ['photo1', 'photo2', 'photo3'],
          characteristics: {
            16: 0,
            17: 0,
            14: 0,
            15: 0,
          },
        });

      expect(res.statusCode).toBe(201);
    });

    it('review id for new review should be incremented by one from the last', async () => {
      const lastReviewId = await Review.findOne().sort({ _id: -1 });
      const res = await request(app)
        .post('/reviews')
        .send({
          product_id: 5,
          rating: 5,
          summary: 'test test test test',
          body: 'I love pizza test',
          recommend: true,
          name: 'dvsvsvfv',
          email: 'test@gmail.com',
          photos: ['photo1', 'photo2', 'photo3'],
          characteristics: {
            16: 0,
            17: 0,
            14: 0,
            15: 0,
          },
        });

      const newReviewId = await Review.findOne().sort({ _id: -1 });

      expect(newReviewId.review_id).toBe(lastReviewId.review_id + 1);
    });

    it('metadata for product id should be updated in post request', async () => {
      const oldReviewsMeta = await ReviewMeta.findOne({ product_id: 5 });
      const oldFiveRating = oldReviewsMeta.ratings[5];
      const oldTrueCount = oldReviewsMeta.recommended.true;
      const oldFalseCount = oldReviewsMeta.recommended.false;

      const res = await request(app)
        .post('/reviews')
        .send({
          product_id: 5,
          rating: 5,
          summary: 'test test test test',
          body: 'I love pizza test',
          recommend: true,
          name: 'dvsvsvfv',
          email: 'test@gmail.com',
          photos: ['photo1', 'photo2', 'photo3'],
          characteristics: {
            16: 0,
            17: 0,
            14: 0,
            15: 0,
          },
        });

      const newReviewsMeta = await ReviewMeta.findOne({ product_id: 5 });
      const newFiveRating = newReviewsMeta.ratings[5];
      const newTrueCount = newReviewsMeta.recommended.true;
      const newFalseCount = newReviewsMeta.recommended.false;

      expect(newFiveRating).toBe(oldFiveRating + 1);
      expect(newTrueCount).toBe(oldTrueCount + 1);
      expect(newFalseCount).toBe(oldFalseCount);
    });

    it('photos should be saved as array of objects with url property on each object', async () => {
      const res = await request(app)
        .post('/reviews')
        .send({
          product_id: 5,
          rating: 5,
          summary: 'test test test test',
          body: 'I love pizza test',
          recommend: true,
          name: 'dvsvsvfv',
          email: 'test@gmail.com',
          photos: ['photo1', 'photo2', 'photo3'],
          characteristics: {
            16: 1,
            17: 1,
            14: 1,
            15: 1,
          },
        });

      const lastPost = await Review.find({ product_id: 5 })
        .sort({ review_id: -1 })
        .limit(1);

      const photo = lastPost[0].photos[0];

      expect(typeof photo).toBe('object');
      expect(photo.url).toBe('photo1');
    });
  });

  describe('PUT /reviews/:review_id/helpful', () => {
    let lastReview;
    beforeEach(async () => {
      lastReview = await Review.findOne({ review_id: 1 });
    });
    afterEach(async () => {
      delete lastReview._id;

      await Review.findOneAndUpdate({ review_id: 1 }, lastReview);
    });

    it('should respond with a 204 status code', async () => {
      const res = await request(app).put('/reviews/1/helpful');

      expect(res.statusCode).toBe(204);
    });

    it('helpfulness should be incremented by one', async () => {
      const res = await request(app).put('/reviews/1/helpful');

      const currentReview = await Review.findOne({ review_id: 1 });

      expect(currentReview.helpfulness).toBe(lastReview.helpfulness + 1);
    });
  });

  describe('PUT /reviews/:review_id/report', () => {
    let lastReview;
    beforeEach(async () => {
      lastReview = await Review.findOne({ review_id: 1 });
    });
    afterEach(async () => {
      delete lastReview._id;

      await Review.findOneAndUpdate({ review_id: 1 }, lastReview);
    });

    it('should respond with a 204 status code', async () => {
      const res = await request(app).put('/reviews/1/report');

      expect(res.statusCode).toBe(204);
    });

    it('should change reported property to true', async () => {
      const res = await request(app).put('/reviews/1/report');

      const currentReview = await Review.findOne({ review_id: 1 });

      expect(currentReview.reported).toBe(true);
    });
  });
});
