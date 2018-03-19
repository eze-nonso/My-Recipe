import 'colors';
import {
  chai, app, should, expect, assert, umzugSeed, umzugMigrate,
} from '../common';

const requester = chai.request(app);

suite('User signup and login', function() {

  suite('POST /api/users/signup - user signup', function() {

    test('should create user "newUser" in database with complete credentials', function() {
      return requester.post('/api/users/signup')
      .type('form')
      .send({
        username: 'newUser',
        password: '2abbba',
        email: 'newUser@newSite.com'
      })
      .then((res) => {
        res.should.have.status(201);
        res.should.be.a.json;
        res.body.should.have.property('status');
        res.body.should.include.keys('status', 'id');
        res.type.should.equal('application/json');
        expect(res).to.be.json;
        expect(res).to.have.status(201);
        expect(res).to.have.header('content-type', /^application/);
        expect(res.body).to.have.property('id');
      });
    });

    suite('Should fail to create account where credentials are missing or invalid', function() {

      test('Expect fail when missing credentials', function() {
        return requester.post('/api/users/signup')
        .type('form')
        .send({
          username: 'justThis'
        })
        .then(res => {
          assert.fail(200, 400, 'Expected an error response code on missing credentials'.yellow);
        })
        .catch(e => {
          if (!e.response) throw e;
          return e.response;
        })
        .then(res => {

          if (res) {
            expect(res).to.be.json;
            expect(res).to.have.status(400);
            expect(res.body).to.not.have.property('id');
            expect(res.body).to.have.property('status');
          }

        });
      });

      test('Should fail when credentials are invalid (implement validator)')
    });
  });

  suite('POST /api/users/signin', function() {
    test('Should login newly created user', function() {
      return requester.post('/api/users/signup')
      .type('form')
      .send({
        username: 'newUser',
        password: '2abbba',
        email: 'newUser@newSite.com'
      })
      .then(() =>
        requester.post('/api/users/signin')
        .type('form')
        .send({
          email: 'newUser@newSite.com',
          password: '2abbba'
        })
      )
      .then(res => {
        res.should.have.cookie('session.sig');
        res.body.should.have.property('status');
        res.body.should.have.property('account');
      });
    });

    test('Should fail on wrong user credentials', function() {
      return requester.post('/api/users/signin')
      .type('form')
      .send({
        username: 'dontExist',
        password: 'fakeuser'
      })
      .then(res => {
        assert.fail(200, 403, 'Expected an error response code on wrong user credentials'.yellow);
      })
      .catch(e => {
        if (!e.response) throw e;
        return e.response;
      })
      .then(res => {
        expect(res).to.have.status(403);
        expect(res).to.be.json;
        res.body.should.have.property('status');
        res.body.should.not.have.property('account');
      });
    });
  });
});
