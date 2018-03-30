import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import qs from 'qs';

let users = [],
  urlParser = bodyParser.urlencoded({ extended: true, limit: '50kb', parameterLimit: 10 }),
  recipes = [],
  reviews = {};


// signin and signup router
const signRouter = express.Router()
  .post('/signup', signUp)
  .post('/signin', signIn);

// recipes router
const recRouter = express.Router();

recRouter
  .route('/')
  .post(addRec);
// .get(getRec);

recRouter
  .post('/:recipeId/reviews', recReview);

recRouter.route('/:recipeId')
  .put(modifyRec)
  .delete(modifyRec);

const favRecRouter = express.Router()
  .get('/:userId/recipes', getFav);

const queryRouter = express.Router()
  .get('/', queryFind);

const app = express()
  .use('/api', urlParser)
  .use('/api/users', signRouter)
  .use('/api/recipes', recRouter)
  .use('/api/users', favRecRouter)
  .use('/api/recipes', queryRouter);

http.createServer(app).listen(3000);

console.log('Server running on port 3000');

function respond(res, message, statusCode, userData) {
  if (userData) userData.action();
  if ((message.itemId || message.userId) && userData) message[message.itemId ? 'itemId' : 'userId'] = userData.obj.length - 1;
  statusCode ? res.status(statusCode).send(message)
    : res.send(message);
}

function signUp(req, res, next) {
  if (req.body['new-username'] && req.body['new-password']) {
    users.map((user, index) =>
      req.body['new-username'] === user.username).indexOf(true) === -1 ?
      respond(res, {
        status: 'User created',
        userId: true
      }, 200, {
        obj: users,
        data: {
          username: req.body['new-username'],
          password: req.body['new-password']
        },
        action() {
          this.obj.push(this.data);
        }
      })
      : respond(res, { status: 'User already exists!' }, 501);
    return;
  }
  respond(res, { status: 'Incomplete or invalid fields' }, 501);
}

function signIn(req, res, next) {
  if (req.body.username && req.body.password) {
    users.filter(item => req.body.username === item.username && req.body.password === item.password).length ?
      respond(res, { status: 'Successfully logged in' })
      : respond(res, { status: 'Oops!, try again' });
    return;
  }
  respond(res, { status: 'Incomplete fields' });
}

function addRec(req, res, next) {
  if (req.body.name && req.body.directions) {
    !recipes.filter(item => item.name === req.body.name).length ?
      respond(res, { status: 'Recipe added', itemId: true }, 200, {
        action() {
          this.obj.push(this.data);
        },
        obj: recipes,
        data: req.body
      })
      : respond(res, { status: 'Recipe already exists!' }, 501);
    return;
  }
  respond(res, { status: 'Not implemented, incomplete parameters' }, 501);
}

function modifyRec(req, res, next) {
  const id = req.params.recipeId; // id here is a string not number
  if (id < 0 || id > recipes.length - 1) {
    respond(res, { status: 'Not implemented, id out of range' }, 501);
    return;
  }
  if (req.method === 'DELETE') {
    recipes.pop(recipes[id]);
    respond(res, { status: 'Item removed' });
  } else if (req.method === 'PUT') {
    if (req.body.name && req.body.directions) {
      recipes = recipes.map((item, index) => (index === id ? req.body
        : item));
      respond(res, { status: `Recipe ${id} replaced` });
      return;
    }
    respond(res, { status: 'Not implemented, incomplete parameters' }, 501);
  }
}

function getRec(req, res, next) {
  recipes.length ? respond(res, { status: 'Recipes found', recipes })
    : respond(res, { status: 'No recipes yet' });
}

function recReview(req, res, next) {
  const id = req.params.recipeId;
  if (req.body.review) {
    if (reviews[`recipe${id}`] && reviews[`recipe${id}`].filter(item => item === req.body.review).length) {
      respond(res, { status: 'Response body already exists' }, 501);
      return;
    }
    if (id < 0 || id > recipes.length - 1) {
      respond(res, { status: `No recipe${id}` }, 501);
      return;
    }
    respond(res, { status: 'Review successful' }, 200, {
      obj: reviews,
      data: req.body.review,
      action() {
        if (this.obj[`recipe${id}`]) {
          this.obj[`recipe${id}`].push(this.data);
          return;
        }
        this.obj[`recipe${id}`] = [this.data];
      }
    });
    return;
  }
  respond(res, { status: 'Empty review body' }, 501);
}

function getFav(req, res, next) {
  const userId = req.params.userId;
  if (userId < 0 || userId > users.length - 1) {
    respond(res, { status: `User${userId} not found` });
  } else {
    recipes.length ? respond(res, { status: 'Favorite recipes found', recipes })
      : respond(res, { status: 'No favorites yet, add some' });
  }
}

function queryFind(req, res, next) {
  // implement database query here
  const query = qs.parse(req.query);
  respond(res, { status: `Recipes in ${query.order} order of ${query.sort}`, recipes });
}
