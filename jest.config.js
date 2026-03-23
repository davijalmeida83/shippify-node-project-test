module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './src',
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'modules/**/services/**/*.ts',
    'modules/**/middlewares/**/*.ts',
    'shared/middleware/**/*.ts',
    'shared/utils/**/*.ts',
    'modules/**/utils/**/*.ts',
    '!**/*.d.ts',
    '!**/setup.ts',
    '!**/node_modules/**',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
  coverageDirectory: '../coverage',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },
};
