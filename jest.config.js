const { resolve } = require('path');
const root = resolve(__dirname);
module.exports = {
  rootDir: root,
  displayName: 'root-tests',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testEnvironment: 'node',
  clearMocks: true,
  preset: 'ts-jest',
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@test/(.*)': '<rootDir>/test/$1',
  },
};



// /** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
// };