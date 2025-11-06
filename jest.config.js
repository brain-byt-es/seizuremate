// jest.config.js
module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-svg|expo(nent)?|@expo.*|@react-navigation/.*|react-native-reanimated)/)'
  ]
};
