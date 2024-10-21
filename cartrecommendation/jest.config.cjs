module.exports = {
  displayName: 'Tests Typescript Application - Service',
  moduleDirectories: ['node_modules', 'src'],
  testMatch: ['**/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    // Map the config utility to the mock implementation
    '^@utils/(.*)$': '<rootDir>/src/utils/__mocks__/config.utils.ts', // Adjust the import path as needed
  },
};
