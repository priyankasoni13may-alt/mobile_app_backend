/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.base.json',
        isolatedModules: true,
        diagnostics: {
          ignoreCodes: [151002]
        }
      }
    ]
  },
  moduleNameMapper: {
    '^@lumora/shared-types$': '<rootDir>/packages/shared-types/src/index.ts',
    '^@lumora/validation$': '<rootDir>/packages/validation/src/index.ts',
    '^@lumora/api-client$': '<rootDir>/packages/api-client/src/index.ts'
  },
  verbose: true,
  testTimeout: 30000
};
