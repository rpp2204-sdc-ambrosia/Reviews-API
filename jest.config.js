module.exports = {
  preset: '@shelf/jest-mongodb',
  collectCoverage: true,
  collectCoverageFrom: ['./server/**'],
  coverageThreshold: {
    global: {
      lines: 90,
    },
  },
  coverageDirectory: 'coverage',
};
