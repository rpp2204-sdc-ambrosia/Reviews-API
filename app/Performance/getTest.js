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
      maxVUs: 30,
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(99)<2000'], // 99% of requests should be below 2000ms
  },
};

export default function () {
  group('GET Requests', function () {
    const BASE_URL = 'http://localhost:3000/'; // make sure this is not production
    const PRODUCT_ID = randomIntBetween(990000, 1000011);
    const COUNT = 100;
    const PAGE = 0;

    const responses = http.batch([
      [
        'GET',
        `${BASE_URL}reviews?product_id=${PRODUCT_ID}&page=${PAGE}&count=${COUNT}`,
      ],
      // ['GET', `${BASE_URL}reviews/meta?product_id=${PRODUCT_ID}`],
    ]);

    check(responses[0], {
      'is GET /reviews status 200': (r) => r.status === 200,
    });
    // check(responses[1], {
    //   'is GET /reviews/meta status 200': (r) => r.status === 200,
    // });
  });
}

// export function handleSummary(data) {
//   return {
//     'summary.html': htmlReport(data),
//   };
// }
