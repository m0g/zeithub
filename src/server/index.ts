if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import * as express from 'express';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import * as fallback from 'express-history-api-fallback';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { createServer as createViteServer } from 'vite';

import bankAccounts from './routes/bank-accounts';
import addresses from './routes/addresses';
import clients from './routes/clients';
import invoices from './routes/invoices';
import currencies from './routes/currencies';

const projectsRouter = require('./routes/projects');
const signRouter = require('./routes/sign');
const meRouter = require('./routes/me');

const createServer = async () => {
  const app = express();

  if (process.env.NODE_ENV !== 'production') {
    const webpack = require('webpack');
    const config = require('../../webpack.dev');
    const compiler = webpack(config);
    app.use(
      require('webpack-dev-middleware')(compiler, {
        writeToDisk: true,
        // noInfo: true,
        publicPath: config.output.publicPath,
      })
    );

    // Create Vite server in middleware mode and configure the app type as
    // 'custom', disabling Vite's own HTML serving logic so parent server
    // can take control
    // const vite = await createViteServer({
    //   server: { middlewareMode: true },
    //   appType: 'custom',
    // });

    // // use vite's connect instance as middleware
    // // if you use your own express router (express.Router()), you should use router.use
    // app.use(vite.middlewares);
    // app.use('*', async (req, res, next) => {
    //   const url = req.originalUrl;

    //   try {
    //     // 1. Read index.html
    //     let template = fs.readFileSync(
    //       path.resolve(__dirname, '../../public/index.html'),
    //       'utf-8'
    //     );

    //     // 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
    //     //    also applies HTML transforms from Vite plugins, e.g. global preambles
    //     //    from @vitejs/plugin-react
    //     template = await vite.transformIndexHtml(url, template);

    //     // 3. Load the server entry. vite.ssrLoadModule automatically transforms
    //     //    your ESM source code to be usable in Node.js! There is no bundling
    //     //    required, and provides efficient invalidation similar to HMR.
    //     const { render } = await vite.ssrLoadModule('/src/client/index.ts');

    //     // 4. render the app HTML. This assumes entry-server.js's exported `render`
    //     //    function calls appropriate framework SSR APIs,
    //     //    e.g. ReactDOMServer.renderToString()
    //     const appHtml = await render(url);

    //     // 5. Inject the app-rendered HTML into the template.
    //     const html = template.replace(`<!--ssr-outlet-->`, appHtml);

    //     // 6. Send the rendered HTML back.
    //     res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    //   } catch (e: any) {
    //     // If an error is caught, let Vite fix the stack trace so it maps back to
    //     // your actual source code.
    //     vite.ssrFixStacktrace(e);
    //     next(e);
    //   }
    // });
  }

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(helmet());

  app.use('/dist', express.static('dist'));
  app.use('/api/projects', projectsRouter);
  app.use('/api/sign', signRouter);
  app.use('/api/me', meRouter);
  app.use('/api/invoices', invoices);
  app.use('/api/bank-accounts', bankAccounts);
  app.use('/api/addresses', addresses);
  app.use('/api/clients', clients);
  app.use('/api/currencies', currencies);

  app.use(express.static('public'));
  app.use(fallback('index.html', { root: 'public' }));

  // app.get('/', (req, res) => {
  //   res.sendFile('index.html');
  // });

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
    const addr = server.address() as { port: number };
    console.info('Listening on port ' + addr.port);
  }
};

createServer();
