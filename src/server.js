require('dotenv').config();
const webpack = require('webpack');
const config = require('../webpack.config');

const compiler = webpack(config);
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const history = require('connect-history-api-fallback');
const fallback = require('express-history-api-fallback');

//const renderer = require('./renderer');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const hamsterRouter = require('./routes/hamster');
const projectsRouter = require('./routes/projects');

const app = express();

app.use(require('webpack-dev-middleware')(compiler, {
  writeToDisk: true,
  noInfo: true,
  publicPath: config.output.publicPath
}));

//app.use(history());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/dist', express.static('dist'))
app.use('/api/hamster', hamsterRouter);
app.use('/api/projects', projectsRouter);
app.use(fallback('index.html', { root: __dirname }))

app.get('/', (req, res) => {
  res.sendFile('./index.html')
})

//app.get('*', (req, res) => {
//  res.end(`
//    <!DOCTYPE html>
//    <html lang="en">
//      <head><title>Hello</title></head>
//      <body>
//        <div id="root"></div>
//        <script src="dist/bundle.js" type="text/javascript"></script>
//      </body>
//    </html>
//  `);
//})

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  next(createError(404));
//});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.error(err);
  //res.render('error');
  res.json({ error: err });
  //renderer.renderToString(ErrorPage({ err }), (err, html) => {
  //  res.end(html);
  //})
});

module.exports = app;
