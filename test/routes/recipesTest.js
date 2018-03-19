import 'colors';
import {
  chai, app, should, expect, assert, populateDB
} from '../common';
import {recipe as Recipe} from '../../server/models';


const requester = chai.request(app);
const agent = chai.request.agent(app);


suite('Adding recipe', function() {

  suite('POST /api/recipes. Logged in user should be able to add recipe', function() {

    test('Should fail for user not logged in', function() {
      return requester.post('/api/recipes')
      .type('form')
      .send({
        name: 'Molokov Cocktail',
        direction: 'Throw and duck',
        per_serving: 15
      })
      .then(res => {
        assert.fail(403, res.status, 'Expected an error status code on posting by user not logged in');
      })
      .catch(e => {
        if (e.response) return e.response;
      })
      .then((res) => {
        if (res) {
          expect(res).to.have.status(403);
          expect(res.body).to.have.property('status');
          expect(res.body).to.not.have.property('id');
          expect(res).to.be.json;
        }
      });
    });

    test.skip('Should redirect not logged in user (views)', function() {
      // implement when views are ready. Note this test negates the preceding test
    });

    test('Should return success message together with summary of added recipe if required fields are complete', function() {
      return Recipe.all()
      .then(recipes => {
        return populateDB(agent)
        .then(res => {
          res.should.be.json;
          res.should.have.status(201);
          res.body.should.have.property('status');
          res.body.recipe.should.include.keys('direction', 'name', 'updated_at', 'created_at', 'id');
        })
        .then(() => {
          return Recipe.all();
        })
        .then(recipes2 => {
          recipes2.length.should.equal(recipes.length + 1);
        });
      })
    });
  });
});

suite('Modifying recipe', function() {
  suite('PUT /api/recipes/<recipeId>', function() {
    test('Should respond with a success message along with summary of updated recipe for logged in user', function() {
      return populateDB(agent)
      .then(res =>
        res.body.recipe.id
      )
      .then(id => {
        return agent.put(`/api/recipes/${id}`)
        .type('form')
        .send({
          name: 'Quinox2',
          direction: 'No need to stir',
          per_serving: 3
        })
      })
      .then(res => {
        res.should.be.json;
        res.should.have.status(200);
        res.body.recipe.should.include.keys('id', 'direction', 'name', 'updated_at', 'created_at', 'per_serving');
        res.body.should.have.property('status');
      });
    });
  });
});

suite('Deleting recipe', function() {

  suite('DELETE /api/recipes/<recipeId>', function() {

    test('Should delete single recipe and return summary of deleted recipe', function() {

      return Recipe.all()
      .then(recipes => {
        return populateDB(agent)
        .then(res => res.body.recipe.id)
        .then(id =>
          Promise.all([
            agent.delete(`/api/recipes/${id}`),
            id
          ])
        )
        .then(([res, id]) => {
          expect(res).to.be.json;
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('deleted');
          expect(res.body.deleted).to.have.keys('id', 'name', 'per_serving', 'direction');
          expect(res.body.deleted.id).to.equal(id);
          return id;
        })
        .then(id =>
          Recipe.findById(id)
        )
        .then(deleted => {
          expect(deleted).to.not.exist;
        })
        .then(() =>
          Recipe.count()
        )
        .then(count => {
          expect(recipes).to.have.lengthOf(count);
        });
      });
    });

    test('Should send error code on request by user not logged in', function() {
      return populateDB(agent)
      .then(res =>
        Promise.all([
          Recipe.count(),
          res.body.recipe.id
        ])
      )
      .then(([count, id]) => {
        return requester.delete(`/api/recipes/${id}`)
        .then(res => {
          assert.fail(403, res.status, 'Expected an error code on request by not logged in user');
        })
        .catch(e => {
          if (e.response) return e.response;
          throw e;
        })
        .then(res => {
          if (res) {
            res.should.have.status(403);
            res.should.be.json;
            res.body.should.have.keys('status');
          }
        })
        .then(() =>
          Recipe.count()
        )
        .then(count2 => {
          // delete request should not remove any recipe
          count2.should.equal(count);
        });
      });

    });
  });
});


suite('Get all recipes', function() {
  suite('GET /api/recipes', function() {
    test('Logged in user should get all recipes with a success status code', function() {
      return populateDB(agent)
      .then(() =>
        agent.get('/api/recipes')
      )
      .then(res => {
        res.should.be.json;
        res.should.have.status(200);
        res.body.should.be.an('array');
      });
    });

    test('Should fail for user not logged in with error status code', function() {
      return requester.get('/api/recipes')
      .then(res => {
        assert.fail(403, res.status, 'Expected an error status code for request from user not logged in');
      })
      .catch(e => {
        if (e.response) return e.response;
        throw e;
      })
      .then(res => {
        if (res) {
          res.should.have.status(403);
          res.should.be.json;
          res.body.should.not.be.an('array');
          res.body.should.have.keys('status');
        }
      })
    })
  });
});
