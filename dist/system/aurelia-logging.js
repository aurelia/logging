'use strict';

System.register([], function (_export, _context) {
  "use strict";

  var logLevel, loggers, appenders, globalDefaultLevel, Logger;

  

  function appendArgs() {
    return [this].concat(Array.prototype.slice.call(arguments));
  }

  function logFactory(level) {
    var threshold = logLevel[level];
    return function () {
      if (this.level < threshold) {
        return;
      }

      var args = appendArgs.apply(this, arguments);
      var i = appenders.length;
      while (i--) {
        var _appenders$i;

        (_appenders$i = appenders[i])[level].apply(_appenders$i, args);
      }
    };
  }

  function connectLoggers() {
    var proto = Logger.prototype;
    proto.debug = logFactory('debug');
    proto.info = logFactory('info');
    proto.warn = logFactory('warn');
    proto.error = logFactory('error');
  }

  function getLogger(id) {
    return loggers[id] || new Logger(id);
  }

  _export('getLogger', getLogger);

  function addAppender(appender) {
    if (appenders.push(appender) === 1) {
      connectLoggers();
    }
  }

  _export('addAppender', addAppender);

  function removeAppender(appender) {
    appenders = appenders.filter(function (a) {
      return a !== appender;
    });
  }

  _export('removeAppender', removeAppender);

  function setLevel(level) {
    globalDefaultLevel = level;
    for (var key in loggers) {
      loggers[key].setLevel(level);
    }
  }

  _export('setLevel', setLevel);

  function getLevel() {
    return globalDefaultLevel;
  }

  _export('getLevel', getLevel);

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
      globalDefaultLevel = logLevel.none;

      _export('Logger', Logger = function () {
        function Logger(id) {
          

          var cached = loggers[id];
          if (cached) {
            return cached;
          }

          loggers[id] = this;
          this.id = id;
          this.level = globalDefaultLevel;
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