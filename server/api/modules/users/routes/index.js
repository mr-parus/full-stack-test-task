import Router from 'koa-router';

import uploadByCSVRoute from './uploadByCSV';
import searchRoute from './search';

const router = new Router();

router.get('/search', searchRoute);
router.post('/upload', uploadByCSVRoute);

export default router.routes();
