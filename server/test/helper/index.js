import faker from 'faker';
import _ from 'lodash';

import User from '../../api/models/User';

faker.locale = 'en_US';

export const generateProfileData = (salt = '') => {
  const data = {
    address: faker.address.streetAddress(),
    age: faker.random.number({ min: 1, max: 100 }),
    color: faker.commerce.color(),
    fullName: faker.name.findName()
  };

  if (salt) {
    const randomKey = faker.random.arrayElement(Object.keys(data).filter(k => k !== 'age'));
    data[randomKey] = `${salt}_%{data[randomKey]}`;
  }

  return data;
};

export const insertNUsers = async (n, salt) => {
  const documents = Array.from({ length: n }).map(() => generateProfileData(salt));
  const chunks = _.chunk(documents, 10);
  const result = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const chunk of chunks) {
    // eslint-disable-next-line no-await-in-loop
    const insertedInstances = await User.insertMany(chunk);
    result.push(...insertedInstances);
  }

  return result;
};

export const emptyUsersCollection = async () => User.remove({});

export const getNumberOfDocuments = async () => User.collection.count();
