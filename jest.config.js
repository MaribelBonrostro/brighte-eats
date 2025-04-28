/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  workerIdleMemoryLimit: "512MB",
  testEnvironment: "node",
  globals: {
    "ts-test": {
      tsConfig: "tsconfig.test.json",
    },
  },
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  transformIgnorePatterns: ["node_modules/(?!@me/test-package)"],
};
