import Router from 'koa-router';

import uploadByCSVRoute from './uploadByCSV';

const router = new Router();

router.post('/upload', uploadByCSVRoute);

export default router.routes();
