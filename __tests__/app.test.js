require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  const hate = [
    'There\'s only one thing I hate more than lying: skim milk. Which is water that\'s lying about being milk.', 
    'I hate everything.'];

  let token;

  beforeAll(async done => {
    execSync('npm run setup-db');

    client.connect();

    const signInData = await fakeRequest(app)
      .post('/auth/signup')
      .send({
        email: 'jon@user.com',
        password: '1234'
      });
    
    token = signInData.body.token;

    return done();
  });

  afterAll(done => {
    return client.end(done);
  });


  test('returns search results from ron swanson api', async() => {

    const expectation = [
      'There\'s only one thing I hate more than lying: skim milk. Which is water that\'s lying about being milk.',
      'I hate everything.',
    ];

    const data = await fakeRequest(app)
      .get('/search')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(data.body).toEqual(expectation);
  });
});
