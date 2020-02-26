import User from '../../../models/User';

export default async (searchString = '', { limit = 20 }) => {
  if (searchString === '') {
    return User.find({}).limit(limit);
  }

  const query = {
    $or: [
      { address: { $regex: searchString, $options: 'i' } },
      { color: { $regex: searchString, $options: 'i' } },
      { fullName: { $regex: searchString, $options: 'i' } }
    ]
  };

  return User.find(query).limit(limit);
};
