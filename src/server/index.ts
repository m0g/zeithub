if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import * as express from 'express';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import * as fallback from 'express-history-api-fallback';
import * as http from 'http';

import bankAccounts from './routes/bank-accounts';
import addresses from './routes/addresses';
import clients from './routes/clients';
import invoices from './routes/invoices';
import expenses from './routes/expenses';
import currencies from './routes/currencies';
import activities from './routes/activities';

const hamsterRouter = require('./routes/hamster');
const projectsRouter = require('./routes/projects');
const signRouter = require('./routes/sign');
// const activitiesRouter = require("./routes/activities");
const meRouter = require('./routes/me');

const app = express();

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const config = require('../../webpack.dev');
  const compiler = webpack(config);

  app.use(
    require('webpack-dev-middleware')(compiler, {
      writeToDisk: true,
      noInfo: true,
      publicPath: config.output.publicPath
    })
  );
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

app.use('/dist', express.static('dist'));
app.use('/api/hamster', hamsterRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/sign', signRouter);
app.use('/api/activities', activities);
app.use('/api/expenses', expenses);
app.use('/api/me', meRouter);
app.use('/api/invoices', invoices);
app.use('/api/bank-accounts', bankAccounts);
app.use('/api/addresses', addresses);
app.use('/api/clients', clients);
app.use('/api/currencies', currencies);

app.use(express.static('public'));
app.use(fallback('index.html', { root: 'public' }));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

// error handler
interface Error {
  status: number;
  message: string;
}

app.use((err: Error, req: express.Request, res: express.Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val: string) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error: { syscall: string; code: string }) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.info('Listening on ' + bind);
}

export default app;
