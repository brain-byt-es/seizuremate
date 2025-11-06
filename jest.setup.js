// Ensure DOM-like globals exist
if (typeof window === 'undefined') global.window = {};
if (typeof navigator === 'undefined') global.navigator = { userAgent: 'node' };

// Reanimated + gesture handler test setup (prevents common RN test crashes)
require('react-native-gesture-handler/jestSetup');
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Example native/expo mocks (add more as your tests touch them)
jest.mock('expo-sqlite', () => ({ openDatabase: jest.fn() }));
