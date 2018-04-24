if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fallback = require('express-history-api-fallback');

const hamsterRouter = require('./routes/hamster');
const projectsRouter = require('./routes/projects');
const signRouter = require('./routes/sign');
const activitiesRouter = require('./routes/activities');
const expensesRouter = require('./routes/expenses');

const app = express();

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const config = require('../../webpack.dev');
  const compiler = webpack(config);

  app.use(require('webpack-dev-middleware')(compiler, {
    writeToDisk: true,
    noInfo: true,
    publicPath: config.output.publicPath
  }));
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/dist', express.static('dist'));
app.use('/api/hamster', hamsterRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/sign', signRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/expenses', expensesRouter);

app.use(fallback('index.html', { root: __dirname }));

app.get('/', (req, res) => {
  res.sendFile('./index.html');
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app;