var loggers = {}, 
    logLevel = 0,
    appenders = [],
    slice = Array.prototype.slice,
    loggerConstructionKey = {};

function log(logger, level, args){
  var i = appenders.length, 
          current;

  args = slice.call(args);
  args.unshift(logger);

  while(i--) {
    current = appenders[i];
    current[level].apply(current, args);
  }
}

function debug(){
  if(logLevel < 4){
    return;
  }

  log(this, 'debug', arguments);
}

function info(){
  if(logLevel < 3){
    return;
  }

  log(this, 'info', arguments);
}

function warn(){
  if(logLevel < 2){
    return;
  }

  log(this, 'warn', arguments);
}

function error(){
  if(logLevel < 1){
    return;
  }

  log(this, 'error', arguments);
}

function connectLogger(logger){
  logger.debug = debug;
  logger.info = info;
  logger.warn = warn;
  logger.error = error;
}

function createLogger(id){
  var logger = new Logger(id, loggerConstructionKey);

  if(appenders.length) {
    connectLogger(logger);  
  }

  return logger;
}

export var levels = {
  error:1,
  warn:2,
  info:3,
  debug:4
};

export function getLogger(id){
  return loggers[id] || (loggers[id] = createLogger(id));
}

export function addAppender(appender){
  appenders.push(appender);

  if(appenders.length === 1){
    for(var key in loggers){
      connectLogger(loggers[key]);
    }
  }
}

export function setLevel(level){
  logLevel = level;
}

export class Logger {
  constructor(id, key){
    if(key !== loggerConstructionKey){
      throw new Error('You cannot instantiate "Logger". Use the "getLogger" API instead.');
    }

    this.id = id;
  }

  debug(){}
  info(){}
  warn(){}
  error(){}
}