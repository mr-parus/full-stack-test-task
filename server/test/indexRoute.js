import chai from 'chai';
import supertest from 'supertest';

import { app } from '../app';

const { expect } = chai;

let request;

before(() => {
  request = supertest(app.listen());
});

it('should return an entry point for the SPA', async () => {
  const { text } = await request
    .get('/')
    .expect('Content-Type', /html/)
    .expect(200);

  expect(text).match(/doctype html/);
});
