import chai from 'chai';
import path from 'path';
import supertest from 'supertest';

import User from '../api/models/User';
import { app } from '../app';
import { connect as connectToMongoDb } from '../utils/db/mongo';
import { fileURLtoDirPath } from '../utils/sugar';
import { getLinesCount } from '../utils/helpers';

const { expect } = chai;
const __dirname = fileURLtoDirPath(import.meta.url);

const badFormatFilePath = path.resolve(__dirname, './data/badFormat.png');
const corruptedFilePath = path.resolve(__dirname, './data/corrupted.csv');
const emptyFilePath = path.resolve(__dirname, './data/empty.csv');
const bigFilePath = path.resolve(__dirname, './data/big.csv');
const smallFilePath = path.resolve(__dirname, './data/small.csv');

let request;

const emptyUsersCollection = async () => User.remove({});
const getNumberOfDocuments = async () => User.collection.count();

before(async () => {
  await connectToMongoDb();
  await emptyUsersCollection();
  request = supertest(app.listen());
});

describe('Users import by uploading a .csv file', function() {
  this.timeout(35 * 1000);

  describe('Error handling ', () => {
    it('should return 400 Error if no files attached', async () => {
      const { body } = await request.post('/api/users/upload').expect(400);

      expect(body.status).be.eq('Bad Request');
      expect(body.message).be.eq('Impossible to find a .csv file!');
    });

    it('should return 400 Error if attached file is in wrong format', async () => {
      const { body } = await request
        .post('/api/users/upload')
        .attach('file', badFormatFilePath)
        .expect(400);

      expect(body.status).be.eq('Bad Request');
      expect(body.message).be.eq('Impossible to find a .csv file!');
    });

    it('should return 422 Error if attached file is corrupted', async () => {
      const { body } = await request
        .post('/api/users/upload')
        .attach('file', corruptedFilePath)
        .expect(422);

      expect(body.status).be.eq('Unprocessable Entity');
      expect(body.message).to.match(/^.csv file is corrupted!/);
    });
  });

  describe('Successful scenarios', () => {
    afterEach(() => emptyUsersCollection());

    it('should process empty files', async () => {
      const linesCount = await getLinesCount(emptyFilePath);
      expect(linesCount).be.eq(0);

      const { body } = await request
        .post('/api/users/upload')
        .attach('file', emptyFilePath)
        .expect(200);

      expect(body.status).be.eq('Ok');
      expect(body.data.fileName).be.eq(path.basename(emptyFilePath));
      expect(body.data.insertedCount).be.eq(linesCount);
      expect(await getNumberOfDocuments()).be.eq(linesCount);
    });

    it('should process small files', async () => {
      const linesCount = await getLinesCount(smallFilePath);
      expect(linesCount).be.above(5);

      const { body } = await request
        .post('/api/users/upload')
        .attach('file', smallFilePath)
        .expect(200);

      expect(body.status).be.eq('Ok');
      expect(body.data.fileName).be.eq(path.basename(smallFilePath));
      expect(body.data.insertedCount).be.eq(linesCount);
      expect(await getNumberOfDocuments()).be.eq(linesCount);
    });

    it('should process only the first attached file', async () => {
      const linesCount = await getLinesCount(smallFilePath);
      expect(linesCount).be.above(0);

      const { body } = await request
        .post('/api/users/upload')
        .attach('file1', smallFilePath)
        .attach('file2', smallFilePath)
        .expect(200);

      expect(body.status).be.eq('Ok');
      expect(body.data.fileName).be.eq(path.basename(smallFilePath));
      expect(body.data.insertedCount).be.eq(linesCount);
      expect(await getNumberOfDocuments()).be.eq(linesCount);
    });

    it('should process big files', async () => {
      const linesCount = await getLinesCount(bigFilePath);
      expect(linesCount).be.above(10000);

      const { body } = await request
        .post('/api/users/upload')
        .attach('file', bigFilePath)
        .expect(200);

      expect(body.status).be.eq('Ok');
      expect(body.data.fileName).be.eq(path.basename(bigFilePath));
      expect(body.data.insertedCount).be.eq(linesCount);
      expect(await getNumberOfDocuments()).be.eq(linesCount);
    });
  });
});
