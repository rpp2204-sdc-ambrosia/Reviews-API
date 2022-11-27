import http from 'k6/http';
import { group, check, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export const options = {
  discardResponseBodies: true,
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 10,
      maxVUs: 3000,
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(99)<2000'], // 99% of requests should be below 2000ms
  },
};

export default function () {
  group('POST request', function () {
    const BASE_URL = 'http://localhost:3000/'; // make sure this is not production
    const PRODUCT_ID = randomIntBetween(990000, 1000011);

    const payload = JSON.stringify({
      product_id: PRODUCT_ID,
      rating: 5,
      summary: 'some words to test this post request',
      body: 'hello people of planet earth. Stay swole',
      recommend: true,
      name: 'testNameForReviewsAPI',
      email: 'test@gmail.com',
      photos: ['photourltest1', 'test2', 'test3'],
      characteristics: {
        16: 0,
        17: 0,
        14: 0,
        15: 0,
      },
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = http.post(`${BASE_URL}reviews`, payload, params);

    check(res, {
      'is POST /reviews status 201': (r) => r.status === 201,
    });
  });
}
