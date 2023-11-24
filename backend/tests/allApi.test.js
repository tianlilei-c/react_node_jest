const sinon = require('sinon');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Profile = require('../models/profile');
const Articles = require('../models/articles');
const request = require('supertest');
const app = require('../index');
const jwt = require('jsonwebtoken');

const JasmineReporters = require('jasmine-reporters');
jasmine.getEnv().addReporter(
  new JasmineReporters.JUnitXmlReporter({
    savePath: 'test-reports',
    consolidateAll: true
  })
);

describe('POST /login', () => {
  let findOneStub, compareStub, saveStub;

  beforeEach(() => {
    findOneStub = sinon.stub(User, 'findOne');
    compareStub = sinon.stub(bcrypt, 'compare');
    saveStub = sinon.stub(User.prototype, 'save');
  });

  afterEach(() => {
    findOneStub.restore();
    compareStub.restore();
    saveStub.restore();
  });

  it('Loign testUser ;should return 200 and a token when login successfully', (done) => {

    findOneStub.resolves({
      username: 'testUser',
      password: 'hashedpassword',
      save: saveStub
    });
    compareStub.resolves(true);
    saveStub.resolves();

    request(app)
      .post('/login')
      .send({ username: 'testUser', password: 'password1234' })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).toBe('Login successful');
        expect(res.body.token).toBeTruthy();
        done();
      });
  });
  it('should return 400 when username or password is invalid', (done) => {
    findOneStub.resolves(null);
    request(app)
      .post('/login')
      .send({ username: 'invaliduser', password: 'invalidpassword' })
      .expect(400)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.error).toBe('Invalid username or password');
        done();
      });
  });
});

describe('POST /register', () => {
  let saveUserStub, saveProfileStub, findOneUserStub, hashStub;

  beforeEach(() => {
    saveUserStub = sinon.stub(User.prototype, 'save');
    saveProfileStub = sinon.stub(Profile.prototype, 'save');
    findOneUserStub = sinon.stub(User, 'findOne');
    hashStub = sinon.stub(bcrypt, 'hash');
  });

  afterEach(() => {
    saveUserStub.restore();
    saveProfileStub.restore();
    findOneUserStub.restore();
    hashStub.restore();
  });

  it('"testUser"<lD> with password "123", ID should be a unique idLog in as ', (done) => {
    hashStub.resolves('hashedPassword');
    findOneUserStub.resolves({ _id: '123', email: 'test@example.com' });
    saveUserStub.resolves();
    saveProfileStub.resolves();

    const testData = {
      name: 'Test Name',
      email: 'test@example.com',
      password: '123',
      username: 'testUser"',
      headline: 'Test Headline',
      zipcode: '12345',
      phone: '1234567890',
      dob: '1990-01-01',
      avatar: 'test-avatar-url'
    };

    request(app)
      .post('/register')
      .send(testData)
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).toBe('User created successfully');
        done();
      });
  });
});

describe('PUT /logout', () => {
  let findByIdStub, saveStub, verifyStub;

  beforeEach(() => {
    findByIdStub = sinon.stub(User, 'findById');
    saveStub = sinon.stub(User.prototype, 'save');
    verifyStub = sinon.stub(jwt, 'verify');
  });

  afterEach(() => {
    findByIdStub.restore();
    saveStub.restore();
    verifyStub.restore();
  });

  it('Log out "testUser"-lD> ID should be the unigue registered id', (done) => {
    verifyStub.returns({ userId: '123' });
    findByIdStub.resolves({ token: 'some-token', save: saveStub });
    saveStub.resolves();
    request(app)
      .put('/logout')
      .set('Authorization', '123 some-valid-token')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).toBe('Logout successful');
        done();
      });
  });

  it('should return unauthorized error when no token provided', (done) => {
    request(app)
      .put('/logout')
      .expect(401)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.error).toBe('Unauthorized');
        done();
      });
  });
});

describe('GET /headline:username', () => {
  let findOneStub;

  beforeEach(() => {
    findOneStub = sinon.stub(Profile, 'findOne');
  });

  afterEach(() => {
    findOneStub.restore();
  });

  it('should return the headline for a valid username', (done) => {
    findOneStub.resolves({ headline: 'Test Headline' });

    request(app)
      .get('/headline/testuser')
      .expect(200)
      .expect('Content-Type', /text/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toBe('Username Headline: Test Headline');
        done();
      });
  });

  it('should return an error for a non-existent username', (done) => {
    findOneStub.resolves(null);

    request(app)
      .get('/headline/nonexistentuser')
      .expect(500)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.error).toBe('user is not find');
        done();
      });
  });
});

describe('PUT /headline', () => {
  let findOneStub, saveStub;

  beforeEach(() => {
    findOneStub = sinon.stub(Profile, 'findOne');
    saveStub = sinon.stub(Profile.prototype, 'save');
  });

  afterEach(() => {
    findOneStub.restore();
    saveStub.restore();
  });

  it('Update the status headline and verify the change', (done) => {
    const mockProfile = { username: 'testuser', headline: 'Old Headline', save: saveStub };
    findOneStub.resolves(mockProfile);
    saveStub.resolves();

    request(app)
      .put('/headline')
      .send({ username: 'testuser', headline: 'New Headline' })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).toBe('update successful');
        expect(res.body.userProfile.headline).toBe('New Headline');
        done();
      });
  });

  it('should return an error when the user does not exist', (done) => {
    findOneStub.resolves(false);

    request(app)
      .put('/headline')
      .send({ username: 'nonexistentuser', headline: 'New Headline' })
      .expect(500)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.msg).toBe('error user');
        done();
      });
  });
});

describe('POST /articles', () => {
  let findOneUserStub, saveArticleStub;

  beforeEach(() => {
    findOneUserStub = sinon.stub(User, 'findOne');
    saveArticleStub = sinon.stub(Articles.prototype, 'save');
  });

  afterEach(() => {
    findOneUserStub.restore();
    saveArticleStub.restore();
  });

  it('Create a new article and verify that the article was added', (done) => {
    findOneUserStub.resolves({ _id: '123', username: 'testuser' });
    saveArticleStub.resolves();

    request(app)
      .post('/articles')
      .send({ userId: '123', title: 'Test Title', body: 'Test Body', image: 'Test Image' })
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).toBe('Article created successfully');
        done();
      });
  });

  it('should return an error when the user does not exist', (done) => {
    findOneUserStub.resolves(null);

    request(app)
      .post('/articles')
      .send({ userId: 'nonexistent', title: 'Test Title', body: 'Test Body', image: 'Test Image' })
      .expect(400)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.error).toBe('User not found');
        done();
      });
  });
});

describe('PUT /articles/:id', () => {
  let findByIdStub, saveStub;

  beforeEach(() => {
    findByIdStub = sinon.stub(Articles, 'findById');
    saveStub = sinon.stub(Articles.prototype, 'save');
  });

  afterEach(() => {
    findByIdStub.restore();
    saveStub.restore();
  });

  it('should update an existing article', (done) => {
    findByIdStub.resolves({ title: 'Old Title', save: saveStub });
    saveStub.resolves();

    request(app)
      .put('/articles/123')
      .send({ title: 'New Title' })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).toBe('Article updated successfully');
        done();
      });
  });
});

describe('GET /articles', () => {
  let findStub;

  beforeEach(() => {
    findStub = sinon.stub(Articles, 'find');
  });

  afterEach(() => {
    findStub.restore();
  });

  it('should return all articles', (done) => {
    findStub.resolves([{ title: 'Article 1' }, { title: 'Article 2' }]);

    request(app)
      .get('/articles')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.length).toBe(2);
        done();
      });
  });

  it('should return articles for a specific user', (done) => {
    findStub.withArgs({ userId: '123' }).resolves([{ title: 'User Article' }]);

    request(app)
      .get('/articles?userId=123')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.length).toBe(1);
        expect(res.body[0].title).toBe('User Article');
        done();
      });
  });
});

