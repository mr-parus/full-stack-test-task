import HTTPErrors from 'http-custom-errors';
import log from '../../../../utils/logger';

import insertManyUsers from '../handlers/insertMany';
import { parseCSV } from '../../../../utils/csv.parser';
import { parseOneFile } from '../../../../utils/req.parser';
import { catchAsync } from '../../../../utils/sugar';

const recordToUserData = ([, fullName, age, address, color]) => ({ address, age, color, fullName });

export default async ctx => {
  const [parseReqError, { file, fileName, mimeType } = {}] = await catchAsync(parseOneFile, ctx.req);
  if (parseReqError || !file || mimeType !== 'text/csv') {
    throw new HTTPErrors.BadRequestError('Impossible to find a .csv file!');
  }

  const [parseCSVFileError, usersData = []] = await catchAsync(parseCSV, file, { onRecord: recordToUserData });
  if (parseCSVFileError) {
    throw new HTTPErrors.UnprocessableEntityError(`.csv file is corrupted! ${parseCSVFileError.message}`);
  }

  const [insertionError, { insertedCount }] = await catchAsync(insertManyUsers, usersData);
  if (insertionError) {
    log.error(insertionError);
    throw HTTPErrors.InternalServerError(`Failed on insertion! ${insertionError.message}`);
  }

  ctx.state.result = {
    data: {
      fileName,
      insertedCount
    }
  };
};
