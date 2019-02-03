'use strict';

System.register([], function (_export, _context) {
  "use strict";

  var logLevel, loggers, appenders, globalDefaultLevel, standardLevels, Logger;

  

  function isStandardLevel(level) {
    return standardLevels.filter(function (l) {
      return l === level;
    }).length > 0;
  }

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

  function logFactoryCustom(level) {
    var threshold = logLevel[level];
    return function () {
      if (this.level < threshold) {
        return;
      }

      var args = appendArgs.apply(this, arguments);
      var i = appenders.length;
      while (i--) {
        var appender = appenders[i];
        if (appender[level] !== undefined) {
          appender[level].apply(appender, args);
        }
      }
    };
  }

  function connectLoggers() {
    var proto = Logger.prototype;
    for (var _level in logLevel) {
      if (isStandardLevel(_level)) {
        if (_level !== 'none') {
          proto[_level] = logFactory(_level);
        }
      } else {
        proto[_level] = logFactoryCustom(_level);
      }
    }
  }

  function disconnectLoggers() {
    var proto = Logger.prototype;
    for (var _level2 in logLevel) {
      if (_level2 !== 'none') {
        proto[_level2] = function () {};
      }
    }
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

  function getAppenders() {
    return [].concat(appenders);
  }

  _export('getAppenders', getAppenders);

  function clearAppenders() {
    appenders = [];
    disconnectLoggers();
  }

  _export('clearAppenders', clearAppenders);

  function addCustomLevel(name, value) {
    if (logLevel[name] !== undefined) {
      throw Error('Log level "' + name + '" already exists.');
    }

    if (isNaN(value)) {
      throw Error('Value must be a number.');
    }

    logLevel[name] = value;

    if (appenders.length > 0) {
      connectLoggers();
    } else {
      Logger.prototype[name] = function () {};
    }
  }

  _export('addCustomLevel', addCustomLevel);

  function removeCustomLevel(name) {
    if (logLevel[name] === undefined) {
      return;
    }

    if (isStandardLevel(name)) {
      throw Error('Built-in log level "' + name + '" cannot be removed.');
    }

    delete logLevel[name];
    delete Logger.prototype[name];
  }

  _export('removeCustomLevel', removeCustomLevel);

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
        error: 10,
        warn: 20,
        info: 30,
        debug: 40
      });

      _export('logLevel', logLevel);

      loggers = {};
      appenders = [];
      globalDefaultLevel = logLevel.none;
      standardLevels = ['none', 'error', 'warn', 'info', 'debug'];

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

        Logger.prototype.isDebugEnabled = function isDebugEnabled() {
          return this.level === logLevel.debug;
        };

        return Logger;
      }());

      _export('Logger', Logger);
    }
  };
});