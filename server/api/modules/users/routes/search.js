import HTTPErrors from 'http-custom-errors';

import log from '../../../../utils/logger';
import { catchAsync } from '../../../../utils/sugar';
import partialMatchSearchHandler from '../handlers/partialMatchSearch';

const SEARCH_RESULTS_LIMIT = 20;

export default async ctx => {
  const { query = '' } = ctx.query;

  const [searchError, users] = await catchAsync(partialMatchSearchHandler, query, {
    limit: SEARCH_RESULTS_LIMIT
  });

  if (searchError) {
    log.error(searchError);
    throw HTTPErrors.InternalServerError(`Unable to search. ${searchError.message}`);
  }

  ctx.state.result = {
    data: {
      users
    }
  };
};
