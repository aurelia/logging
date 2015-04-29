import * as LogManager from '../src/index';

describe('A simple log manager test', () => {
  it('should return a logger', () => {
    var logger = LogManager.getLogger('test');
    expect(logger).not.toBe(null);
  });
});

describe('The log manager ', () => {
    var logName = 'test', logger, testAppender;

    class TestAppender {
        debug(args) { }
        info(args){}
        warn(args){}
        error(args){}
    }

    beforeEach(() => {
      testAppender = new TestAppender();

      spyOn(testAppender, 'debug');
      spyOn(testAppender, 'info');
      spyOn(testAppender, 'warn');
      spyOn(testAppender, 'error');

      LogManager.addAppender(testAppender);

      logger = LogManager.getLogger(logName);
      LogManager.setLevel(LogManager.logLevel.none);
    });

  it('should call only call debug when logLevel is debug', () => {
      LogManager.setLevel(LogManager.logLevel.debug);
      logger.debug('foo');

      LogManager.setLevel(LogManager.logLevel.info);
      logger.debug('foo');

      LogManager.setLevel(LogManager.logLevel.warn);
      logger.debug('foo');

      LogManager.setLevel(LogManager.logLevel.error);
      logger.debug('foo');

      LogManager.setLevel(LogManager.logLevel.none);
      logger.debug('foo');

      expect(testAppender.debug.calls.count()).toBe(1)
  });

  it('should call only call info when logLevel is debug or info', () => {
      LogManager.setLevel(LogManager.logLevel.debug);
      logger.info('foo');

      LogManager.setLevel(LogManager.logLevel.info);
      logger.info('foo');

      LogManager.setLevel(LogManager.logLevel.warn);
      logger.info('foo');

      LogManager.setLevel(LogManager.logLevel.error);
      logger.info('foo');

      LogManager.setLevel(LogManager.logLevel.none);
      logger.info('foo');

      expect(testAppender.info.calls.count()).toBe(2)
  });

  it('should call only call warn when logLevel is debug, info, or warn', () => {
      LogManager.setLevel(LogManager.logLevel.debug);
      logger.warn('foo');

      LogManager.setLevel(LogManager.logLevel.info);
      logger.warn('foo');

      LogManager.setLevel(LogManager.logLevel.warn);
      logger.warn('foo');

      LogManager.setLevel(LogManager.logLevel.error);
      logger.warn('foo');

      LogManager.setLevel(LogManager.logLevel.none);
      logger.warn('foo');

      expect(testAppender.warn.calls.count()).toBe(3)
  });

  it('should call only call error when logLevel is debug, info, warn, or error', () => {
      LogManager.setLevel(LogManager.logLevel.debug);
      logger.error('foo');

      LogManager.setLevel(LogManager.logLevel.info);
      logger.error('foo');

      LogManager.setLevel(LogManager.logLevel.warn);
      logger.error('foo');

      LogManager.setLevel(LogManager.logLevel.error);
      logger.error('foo');

      LogManager.setLevel(LogManager.logLevel.none);
      logger.error('foo');

      expect(testAppender.error.calls.count()).toBe(4)
  });

  it('should pass arguments to the appender', () => {
      LogManager.setLevel(LogManager.logLevel.debug);
      logger.debug(123);

      expect(testAppender.debug).toHaveBeenCalledWith( logger, 123);
  });

  it('should pass multiple arguments to the appender', () => {
      var objectToLog = {
          id: 1,
          name: 'John'
      };

      LogManager.setLevel(LogManager.logLevel.debug);
      logger.debug(123, objectToLog);

      expect(testAppender.debug).toHaveBeenCalledWith( logger, 123, objectToLog);
  });

    it('should throw an exception if the Logger class is newed up by the developer', () => {
        var attemptingToNewUpALogger = () => { var myNewLogger = new Logger(); };
        expect(attemptingToNewUpALogger).toThrow();
    });
});
