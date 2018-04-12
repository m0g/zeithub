require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Vue = require('vue');

const renderer = require('./renderer');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const hamsterRouter = require('./routes/hamster');
const projectsRouter = require('./routes/projects');

const App = require('./components/app');
const ErrorPage = require('./components/error');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/hamster', hamsterRouter);
app.use('/projects', projectsRouter);

app.get('*', (req, res) => {
  renderer.renderToString(App, (err, html) => {
    res.end(html);
  })
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.error(err);
  //res.render('error');
  renderer.renderToString(ErrorPage({ err }), (err, html) => {
    res.end(html);
  })
});

module.exports = app;