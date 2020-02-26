import _ from 'lodash';
import mongoose from 'mongoose';
import { db as dbConfig } from '../../config/index';

const {
  mongo: {
    collectionNames: { users: collectionName }
  }
} = dbConfig;

const User = new mongoose.Schema({
  address: {
    required: true,
    type: String
  },
  age: {
    message: 'User.age should be at least 1.',
    minimum: 1,
    required: true,
    type: Number,
    validate: {
      validator: v => v >= 1
    }
  },
  fullName: {
    required: true,
    type: String
  },
  color: {
    capitalize: true,
    required: true,
    type: String
  }
});

// For test reasons all data should not be unique
// User.createIndex({ address: 1, age: 1, fullName: 1 }, { unique: true });

User.set('toJSON', {
  transform: (doc, ret) => ({
    ..._.omit(ret, ['__v', '_id', 'color']),
    color: ret.color.toLowerCase(),
    id: ret._id.toString()
  })
});

export default mongoose.model(collectionName, User);
