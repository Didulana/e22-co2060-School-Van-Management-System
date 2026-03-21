/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Include both test directory architectures
  roots: ["<rootDir>/tests", "<rootDir>/src"],
  setupFiles: ["<rootDir>/tests/setup.ts"],
  // Match tests in any folder
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],
  clearMocks: true,
  collectCoverageFrom: [
    "src/controllers/**/*.ts",
    "src/services/**/*.ts",
    "src/routes/**/*.ts",
    "!src/server.ts",
  ],
};
