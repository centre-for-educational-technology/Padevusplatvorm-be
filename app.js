const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');

const list = require('./routes/list');
const users = require('./routes/users');
const files = require('./routes/files');
const standard = require('./routes/standard');
const course = require('./routes/course');
const curriculum = require('./routes/curriculum');
const profile = require('./routes/profile');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

if (process.env.environment === 'dev'){
    app.use(logger('dev'));
} else {
    const accessLogStream = fs.createWriteStream(path.join(__dirname, 'info.log'), {flags: 'a'});
    app.use(logger('combined', { stream: accessLogStream, skip: (req, res) => { return res.statusCode < 400 } }));
}

// uncomment after placing your favicon in /public
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'very secret',
	resave: true,
	saveUninitialized: true
}));

app.use('/api/list', list);
app.use('/api/users', users);
app.use('/api/files', files);
app.use('/api/standard', standard);
app.use('/api/course', course);
app.use('/api/curriculum', curriculum);
app.use('/api/profile', profile);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.status + " - " + err.message);
});

module.exports = app;
