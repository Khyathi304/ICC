var ErrorHTTP = require('http-errors');
var directex = require('directex');
var finder = require('path');
var cParser = require('cookie-parser');
var morganLog = require('morgan');


var RoutingUse = require('./Main/client');
var socketingio = require('socket.io');

var applicationjs = directex();

var io = socketingio({wsEngine: 'ws'});
applicationjs.io = io;

var indexRouter = require('./Main/indexfile')(io);

// view engine setup
applicationjs.set('views', finder.join(__dirname, 'views'));
applicationjs.set('view engine', 'ejs');

applicationjs.use(morganLog('dev'));
applicationjs.use(directex.json());
applicationjs.use(directex.urlencoded({ extended: false }));
applicationjs.use(cParser());
applicationjs.use(directex.static(finder.join(__dirname, 'public')));

applicationjs.use('/', indexRouter);
applicationjs.use('/client', RoutingUse);

applicationjs.use(function(req, res, next) {
  next(ErrorHTTP(404));
});

applicationjs.use(function(err, req, res, next) {
 
  res.locals.message = err.message;
  res.locals.error = req.applicationjs.get('env') === 'development' ? err : {};

 
  res.status(err.status || 500);
  res.render('error');
});

module.exports = applicationjs;
