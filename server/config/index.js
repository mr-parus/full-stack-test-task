import path from 'path';
import { fileURLtoDirPath } from '../utils/sugar';

export const ENVIRONMENT = process.env.NODE_ENV || 'development';
const isDevelopment = ENVIRONMENT === 'development';

const __dirname = fileURLtoDirPath(import.meta.url);
const assetsPath = path.resolve(__dirname, '../../frontend/build');

const {
  MONGO_DB_NAME = 'db',
  MONGO_HOST = 'localhost',
  MONGO_PASSWORD = 'admin',
  MONGO_PORT = '27017',
  MONGO_USER = 'admin'
} = process.env;

export const db = {
  mongo: {
    connectOptions: {
      autoIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    connectURI: `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`,
    host: MONGO_HOST,
    port: +MONGO_PORT,
    collectionNames: {
      users: ENVIRONMENT === 'test' ? 'users.test' : 'users'
    }
  }
};

export const server = {
  port: 3000,
  assetsPath
};

export const logger = {
  level: isDevelopment ? 'debug' : 'error'
};
