import HttpErrors from 'http-custom-errors';
import HttpStatus from 'http-status';

const formatJSONResponse = async (ctx, next) => {
  try {
    ctx.type = 'application/json';
    await next();

    const { code = HttpStatus.OK, data } = ctx.state.result || {};

    ctx.status = code;
    ctx.body = { data, status: 'Ok' };
  } catch (err) {
    if (err instanceof HttpErrors.HTTPError) {
      const { message = '', status = 'Error', code } = err;

      ctx.status = code;
      ctx.body = { status, message };
    } else {
      ctx.throw(HttpStatus.INTERNAL_SERVER_ERROR, err);
    }
  }
};

export default formatJSONResponse;
