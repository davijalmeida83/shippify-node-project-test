module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './src',
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  forceExit: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'modules/**/services/**/*.ts',
    'modules/**/middlewares/**/*.ts',
    'modules/**/controllers/**/*.ts',
    'modules/**/repositories/**/*.ts',
    'shared/middleware/**/*.ts',
    'shared/utils/**/*.ts',
    'shared/db/cache/**/*.ts',
    'shared/errors/**/*.ts',
    'modules/**/utils/**/*.ts',
    '!**/*.d.ts',
    '!**/setup.ts',
    '!**/index.ts',
    '!**/node_modules/**',
  ],
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
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
