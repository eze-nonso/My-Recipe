/* eslint-disable no-unused-expressions */

import 'colors';
import { chai, app, expect, assert, populateDB } from '../common';
import { recipe as Recipe } from '../../server/models';


const requester = chai.request(app);
const agent = chai.request.agent(app);


suite('Adding recipe', () => {
  suite('POST /api/recipes. Logged in user should be able to add recipe', () => {
    test('Should fail for user not logged in', () => requester.post('/api/recipes')
      .type('form')
      .send({
        name: 'Molokov Cocktail',
        direction: 'Throw and duck',
        per_serving: 15,
        ingredients: [
          { one: 1, two: 2 }
        ]
      })
      .then((res) => {
        assert.fail(res.status, 403, 'Expected an error status code on posting by user not logged in');
      })
      .catch((e) => {
        if (e.response) {
          return e.response;
        }
        throw e;
      })
      .then((res) => {
        if (res) {
          expect(res).to.have.status(403);
          expect(res.body).to.have.own.property('status');
          expect(res.body).to.not.have.own.property('recipe');
          expect(res).to.be.json;
        }
      }));

    test.skip('Should redirect not logged in user (views)', () => {
      // implement when views are ready. Note this test negates the preceding test
    });

    test('Should return success message together with summary of added recipe if required fields are complete', () => Recipe.count()
      .then(count => populateDB(agent)
        .then((res) => {
          res.should.be.json;
          res.should.have.status(201);
          res.body.should.have.own.property('status');
          res.body.should.include.key('recipe');
          res.body.recipe.should.have.keys('direction', 'name', 'updated_at', 'created_at', 'id', 'ingredients', 'per_serving', 'user_id');
        })
        .then(() => Recipe.all())
        .then((recipes2) => {
          recipes2.length.should.equal(count + 1);
        })));
  });
});

suite('Modifying recipe', () => {
  suite('PUT /api/recipes/<recipeId>', () => {
    test('Should respond with a success message along with summary of updated recipe for logged in user', () => populateDB(agent)
      .then(res =>
        res.body.recipe.id)
      .then(id => agent.put(`/api/recipes/${id}`)
        .type('form')
        .send({
          name: 'Quinox2',
          direction: 'No need to stir',
          per_serving: 3,
          ingredients: [{
            one: 1,
          }]
        }))
      .then((res) => {
        res.should.be.json;
        res.should.have.status(200);
        res.body.recipe.should.include.keys('id', 'direction', 'name', 'updated_at', 'created_at', 'per_serving');
        res.body.should.have.own.property('status');
        expect(res.body.recipe).to.have.property('direction').equal('No need to stir');
      }));
  });
});

suite('Deleting recipe', () => {
  suite('DELETE /api/recipes/<recipeId>', () => {
    test('Should delete single recipe and return summary of deleted recipe', () => Recipe.all()
      .then(recipes => populateDB(agent)
        .then(res => res.body.recipe.id)
        .then(id =>
          Promise.all([
            agent.delete(`/api/recipes/${id}`),
            id
          ]))
        .then(([res, id]) => {
          expect(res).to.be.json;
          expect(res).to.have.status(200);
          expect(res.body).to.have.own.property('deleted');
          expect(res.body.deleted).to.include.keys('id', 'name', 'per_serving', 'direction');
          expect(res.body.deleted.id).to.equal(id);
          return id;
        })
        .then(id =>
          Recipe.findById(id))
        .then((deleted) => {
          expect(deleted).to.not.exist;
        })
        .then(() =>
          Recipe.count())
        .then((count) => {
          expect(recipes).to.have.lengthOf(count);
        })));

    test('Should send error code on request by user not logged in', () => populateDB(agent)
      .then(res =>
        Promise.all([
          Recipe.count(),
          res.body.recipe.id
        ]))
      .then(([count, id]) =>
        // use requester here as agent is cached
        requester.delete(`/api/recipes/${id}`)
          .then((res) => {
            assert.fail(res.status, 403, 'Expected an error code on request by not logged in user');
          })
          .catch((e) => {
            if (e.response) {
              return e.response;
            }
            throw e;
          })
          .then((res) => {
            if (res) {
              res.should.have.status(403);
              res.should.be.json;
              res.body.should.have.keys('status');
            }
          })
          .then(() =>
            Recipe.count())
          .then((count2) => {
          // delete request should not remove any recipe
            count2.should.equal(count);
          })));
  });
});


suite('Get all recipes', () => {
  suite('GET /api/recipes', () => {
    test('Logged in user should get all recipes with a success status code', () => populateDB(agent)
      .then(() =>
        agent.get('/api/recipes'))
      .then((res) => {
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.have.own.property('ingredients');
        expect(res.body[0]).to.have.own.property('reviews');
      }));

    test('Should fail for user not logged in with error status code', () => requester.get('/api/recipes')
      .then((res) => {
        assert.fail(res.status, 403, 'Expected an error status code for request from user not logged in');
      })
      .catch((e) => {
        if (e.response) {
          return e.response;
        }
        throw e;
      })
      .then((res) => {
        if (res) {
          expect(res).to.have.status(403);
          expect(res).to.be.json;
          expect(res.body).to.not.be.an('array');
          expect(res.body).to.have.keys('status');
        }
      }));
  });
});


suite('Post review for recipe', () => {
  suite('POST /api/recipes/<recipeId>/reviews', () => {
    test('Expect empty review body to return error response', () => populateDB(agent)
      .then(res => res.body.recipe.id)
      .then(recipeId => agent.post(`/api/recipes/${recipeId}/reviews`)
        .type('form')
        .send({
          review: '',
        }))
      .then(res => assert.fail(res.status, 403, 'expected error response code'))
      .catch((e) => {
        if (e.response) {
          return e.response;
        }
        throw e;
      })
      .then((res) => {
        expect(res).to.be.json;
        expect(res).have.status(400);
        expect(res.body).to.include.all.keys('status', 'error');
        expect(res.body).to.have.ownProperty('status', 'fail');
      }));

    test('Expect add review to fail with error response code for user not logged in', () => populateDB(agent)
      .then(res => res.body.recipe.id)
      .then(recipeId => requester.post(`/api/recipes/${recipeId}/reviews`)
        .type('form')
        .send({
          review: 'sunt praesentium sit',
        }))
      .then((res) => {
        expect.fail(res.status, 403, 'expected error status code');
      })
      .catch((e) => {
        if (e.response) {
          return e.response;
        }
        throw e;
      })
      .then((res) => {
        expect(res).to.be.json;
        expect(res).to.have.status(403);
        expect(res.body).to.be.an('object').with.ownProperty('status', 'fail');
        expect(res.body).to.have.property('error').that.is.a('string');
      }));

    test('Expect success response on new review', () => populateDB(agent)
      .then(res => res.body.recipe.id)
      .then(recipeId =>
        agent.post(`/api/recipes/${recipeId}/reviews`)
          .type('form')
          .send({
            review: 'Lorem ipsum deut',
          }))
      .then((res) => {
        expect(res).to.be.json;
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status', 'review added');
      }));
  });
});


suite('Get favorite recipe', () => {
  suite('GET /api/users/recipes', () => {
    test('Expect logged in user to get favorite recipes', () =>

      // agent cached cookie from last call
      agent.get('/api/users/recipes')
        .then((res) => {
          expect(res).to.be.json;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.be.empty;
        }));

    test('Expect error response on request by user not logged in', () => requester.get('/api/users/recipes')
      .then((res) => {
        expect.fail(res.status, 403, 'Expected error response code');
      })
      .catch((e) => {
        if (e.response) {
          return e.response;
        }
        throw e;
      })
      .then((res) => {
        expect(res).to.be.json;
        expect(res).to.have.status(403);
        expect(res.body).to.have.property('status').that.is.a('string');
      }));
  });
});


suite('Get recipes with the most upvotes', () => {
  suite('GET /api/recipes?sort=upvotes&order=ascending', () => {
    test('Expect to respond with error status code for user not logged in', () => requester.get('/api/recipes?sort=upvotes&order=ascending')
      .then((res) => {
        expect.fail(res.status, 403, 'Expected error status code on request by user not logged in');
      })
      .catch((e) => {
        if (e.response) {
          return e.response;
        }
        throw e;
      })
      .then((res) => {
        expect(res).to.be.json;
        expect(res).to.have.status(403);
        expect(res.body).to.have.all.keys('status', 'error');
        expect(res.body).to.have.property('error').that.is.a('string');
      }));


    test('Expect success on request by logged in user', () => populateDB(agent)
      .then(() => agent.get('/api/recipes?sort=upvotes&order=ascending'))
      .then((res) => {
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an.instanceof(Array);
        // deep equal
        expect(res.body).to.be.an('array').with.lengthOf(5);
        // check order is desc
        expect(res.body[1]).to.have.property('upvotes').at.most(res.body[3].upvotes);

        expect(res.body[2]).to.have.property('recipe').that.is.an('object').with.property('id');
      }));

    test('Expect returned most upvotes to be in descending order', () => populateDB(agent)
      .then(() => agent.get('/api/recipes?sort=upvotes&order=descending'))
      .then((res) => {
        expect(res).to.be.json;
        expect(res).status(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(5);
        expect(res.body[0]).to.have.property('upvotes').that.is.a('number');
        expect(res.body[4].upvotes).to.be.at.most(res.body[0].upvotes);
      }));
  });
});
