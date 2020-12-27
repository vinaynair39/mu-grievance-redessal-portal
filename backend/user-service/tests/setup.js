const { default: clearDynamoDB } = require("./utils/clearDynamoDB");

global.console = {
  log: console.log, // console.log are ignored in tests
  // Keep native behaviour for other methods, use those to print out things in your own tests, not `console.log`
  error: jest.fn(),
  warn: console.warn,
  info: console.info,
  debug: console.debug,
};

beforeAll(async () => await clearDynamoDB());
