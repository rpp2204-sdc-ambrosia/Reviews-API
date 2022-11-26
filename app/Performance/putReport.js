import http from 'k6/http';
import { group, check, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export const options = {
  discardResponseBodies: true,
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 100,
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
  group('PUT report', function () {
    const BASE_URL = 'http://localhost:3000/'; // make sure this is not production
    const PRODUCT_ID = randomIntBetween(990000, 1000011);

    const res = http.put(`${BASE_URL}reviews/${PRODUCT_ID}/report`);

    check(res, {
      'is PUT /reviews/:product_id/report status 204': (r) => r.status === 204,
    });
  });
}
