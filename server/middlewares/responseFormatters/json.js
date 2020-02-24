import HTTPErrors from 'http-custom-errors';

const formatJSONResponse = async (ctx, next) => {
  try {
    ctx.type = 'application/json';
    await next();

    const { code = 200, data } = ctx.state.result || {};

    ctx.status = code;
    ctx.body = { data, status: 'Ok' };
  } catch (err) {
    if (err instanceof HTTPErrors.HTTPError) {
      const { message = '', status = 'Error', code } = err;

      ctx.status = code;
      ctx.body = { status, message };
    } else {
      ctx.throw(500, err);
    }
  }
};

export default formatJSONResponse;
