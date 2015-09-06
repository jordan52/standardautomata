var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var videos = require('./videos/videos.js');

var app = express();
app.locals.persistDir = path.resolve(__dirname + '/persist');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
var bootstrapPath = path.join(__dirname, 'node_modules', 'bootstrap');
var faPath = path.join(__dirname, 'node_modules', 'font-awesome');
var threePath = path.join(__dirname, 'node_modules', 'three');
app.use('/fonts', express.static(path.join(bootstrapPath, 'dist','fonts')));
app.use('/fonts', express.static(path.join(faPath, 'fonts')));
app.use('/js', express.static(path.join(bootstrapPath, 'dist', 'js')));
app.use('/js', express.static(path.join(threePath)));
app.use('/css', express.static(path.join(faPath, 'css')));

app.use(require('less-middleware')(path.join(__dirname, 'public'), {
    dest: path.join(__dirname, 'public'),
    parser: {
        paths: [path.join(bootstrapPath, 'less')],
    }
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/popmachination.html', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//this crawls the persist folder and sets up the videos module
app.videos = videos(app)


module.exports = app;
