import * as LogManager from '../src/index';

describe('log manager', () => {
  it('should have some tests', () => {
    var logger = LogManager.getLogger('test');
    expect(logger).not.toBe(null);
  });
});