export default {
  displayName: 'Schematics',
  coverageDirectory: '../../coverage/modules/schematics',
  transform: {
    '^.+\\.(ts|mjs|js)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json'
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)']
};
