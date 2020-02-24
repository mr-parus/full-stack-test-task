import Router from 'koa-router';

import userRoutes from '../api/modules/users/routes';
import formatJSONResponse from '../middlewares/responseFormatters/json';

const router = new Router();

router.use(formatJSONResponse);
router.use('/users', userRoutes);

export default router.routes();
