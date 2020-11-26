module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    'this-is-just-here-to-not-match-anything-and-make-sure-the-node-modules-are-not-ignored-in-the-transforms',
  ],
  transform: {
    '\\.ts$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      // tsConfig: '<rootDir>/test-utils/tsconfig.jest.json',
      isolatedModules: true,
    },
  },
  collectCoverageFrom: ['src/**/*.{js,ts}', '!src/**/*.test.{js,ts}', '!src/lib/vendor/**/*.*'],
  coverageDirectory: './coverage',
  coverageReporters: ['lcov', 'text-summary'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
