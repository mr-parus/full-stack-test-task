import chai from 'chai';
import path from 'path';
import supertest from 'supertest';

import { app } from '../app';
import { connect as connectToMongoDb } from '../utils/db/mongo';
import { getLinesCount } from '../utils/helpers';
import { fileURLtoDirPath } from '../utils/sugar';
import { emptyUsersCollection, getNumberOfDocuments, insertNUsers } from './helper';

const { expect } = chai;
const __dirname = fileURLtoDirPath(import.meta.url);

const badFormatFilePath = path.resolve(__dirname, './data/badFormat.png');
const corruptedFilePath = path.resolve(__dirname, './data/corrupted.csv');
const emptyFilePath = path.resolve(__dirname, './data/empty.csv');
const bigFilePath = path.resolve(__dirname, './data/big.csv');
const smallFilePath = path.resolve(__dirname, './data/small.csv');

let request;

const maxSearchResultCount = 20;
const searchQuerySalt = 'test';

before(async () => {
  await connectToMongoDb();
  await emptyUsersCollection();
  request = supertest(app.listen());
});

describe('Users import by uploading a .csv file', function test() {
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
    afterEach(async () => emptyUsersCollection());

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

describe('Users partial match searching', () => {
  before(async () => {
    await insertNUsers(maxSearchResultCount + 5, searchQuerySalt);
  });

  after(async () => emptyUsersCollection());

  it('should find max number of records if no qury string provided', async () => {
    const { body } = await request
      .get('/api/users/search')
      .query({ query: '' })
      .expect(200);

    expect(body.data.users.length).be.eq(maxSearchResultCount);
    body.data.users.forEach(user => {
      expect(user).to.have.keys(['address', 'age', 'fullName', 'color', 'id']);
    });
  });

  it('should find max number of records if provided the proper query string', async () => {
    const { body } = await request
      .get('/api/users/search')
      .query({ query: searchQuerySalt })
      .expect(200);

    expect(body.data.users.length).be.eq(maxSearchResultCount);
    body.data.users.forEach(user => {
      expect(user).to.have.keys(['address', 'age', 'fullName', 'color', 'id']);
    });
  });

  it('should find nothing if wrong query', async () => {
    const { body } = await request
      .get('/api/users/search')
      .query({ query: 'XXXXXXXXXXX' })
      .expect(200);

    expect(body.data.users.length).be.eq(0);
  });
});
