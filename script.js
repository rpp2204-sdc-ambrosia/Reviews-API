import http from 'k6/http';
import { sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  stages: [
    { duration: '30s', target: 1 },
    { duration: '30s', target: 10 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 1000 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
  },
};

export default function () {
  const BASE_URL = 'http://localhost:3000/'; // make sure this is not production
  const PRODUCT_ID = randomIntBetween(990000, 1000011);

  const responses = http.batch([
    [
      'GET',
      `${BASE_URL}reviews?product_id=${PRODUCT_ID}&page=${PAGE}&count=${COUNT}`,
      null,
    ],
    ['GET', `${BASE_URL}meta?product_id=${PRODUCT_ID}`, null],
  ]);

  sleep(1);
}
