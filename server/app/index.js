import cors from 'kcors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaLogger from 'koa-logger';
import responseTime from 'koa-response-time';
import serve from 'koa-static';
import { server as serverConfig } from '../config';

import router from '../routes/router';
import log from '../utils/logger';

const { assetsPath } = serverConfig;
export const app = new Koa();

app
  .use(responseTime())
  .use(koaLogger(log.info))
  .use(cors())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(serve(assetsPath))
  .on('error', err => log.error('Error occurred: %s', err.message));
