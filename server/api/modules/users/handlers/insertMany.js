import promiseLimit from 'p-limit';
import _ from 'lodash';

import User from '../../../models/User';

// More about options here:
// https://mongoosejs.com/docs/api.html#model_Model.insertMany
const options = {
  ordered: false
};

const insertMany = async documentsData => {
  /* concurrency: 100 docs by in `insert Promises` at the same time */
  const chunks = _.chunk(documentsData, 100);
  const limit = promiseLimit(5);

  const result = { insertedCount: 0 };

  await Promise.all(
    chunks.map(async chunk => {
      const insertedDocuments = await limit(User.insertMany.bind(User), chunk, options);
      result.insertedCount += insertedDocuments.length;
    })
  );

  return result;
};

export default insertMany;
