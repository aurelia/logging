'use strict';

System.register([], function (_export, _context) {
  "use strict";

  var logLevel, loggers, appenders, slice, loggerConstructionKey, globalDefaultLevel, Logger;

  

  function log(logger, level, args) {
    var i = appenders.length;
    var current = void 0;

    args = slice.call(args);
    args.unshift(logger);

    while (i--) {
      current = appenders[i];
      current[level].apply(current, args);
    }
  }

  function debug() {
    if (this.level < 4) {
      return;
    }

    log(this, 'debug', arguments);
  }

  function info() {
    if (this.level < 3) {
      return;
    }

    log(this, 'info', arguments);
  }

  function warn() {
    if (this.level < 2) {
      return;
    }

    log(this, 'warn', arguments);
  }

  function error() {
    if (this.level < 1) {
      return;
    }

    log(this, 'error', arguments);
  }

  function connectLogger(logger) {
    logger.debug = debug;
    logger.info = info;
    logger.warn = warn;
    logger.error = error;
  }

  function createLogger(id) {
    var logger = new Logger(id, loggerConstructionKey);
    logger.setLevel(globalDefaultLevel);

    if (appenders.length) {
      connectLogger(logger);
    }

    return logger;
  }

  function getLogger(id) {
    return loggers[id] || (loggers[id] = createLogger(id));
  }

  _export('getLogger', getLogger);

  function addAppender(appender) {
    appenders.push(appender);

    if (appenders.length === 1) {
      for (var key in loggers) {
        connectLogger(loggers[key]);
      }
    }
  }

  _export('addAppender', addAppender);

  function setLevel(level) {
    globalDefaultLevel = level;
    for (var key in loggers) {
      loggers[key].setLevel(level);
    }
  }

  _export('setLevel', setLevel);

  return {
    setters: [],
    execute: function () {
      _export('logLevel', logLevel = {
        none: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4
      });

      _export('logLevel', logLevel);

      loggers = {};
      appenders = [];
      slice = Array.prototype.slice;
      loggerConstructionKey = {};
      globalDefaultLevel = logLevel.none;

      _export('Logger', Logger = function () {
        function Logger(id, key) {
          

          this.level = logLevel.none;

          if (key !== loggerConstructionKey) {
            throw new Error('Cannot instantiate "Logger". Use "getLogger" instead.');
          }

          this.id = id;
        }

        Logger.prototype.debug = function debug(message) {};

        Logger.prototype.info = function info(message) {};

        Logger.prototype.warn = function warn(message) {};

        Logger.prototype.error = function error(message) {};

        Logger.prototype.setLevel = function setLevel(level) {
          this.level = level;
        };

        return Logger;
      }());

      _export('Logger', Logger);
    }
  };
});