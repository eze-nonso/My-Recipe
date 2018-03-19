import {recipe as Recipe, user as User, Sequelize} from '../models';

let newRecipe;
export default (req, res, next) => {
  if (req.session.user) {
    // query by cookie value
    const userId = req.session.user;
    return User.findById(userId)
    .then(user => {
      if (!user) {
        res.status(400).send({
          status: 'Fail, no such user in database'
        });
        // pass control to catch
        throw new Error('No such user in database');
      }
      return user;
    })
    .then(user => {
      return Promise.all([
        Recipe.create({
          name: req.body.name,
          direction: req.body.direction,
          per_serving: req.body['per_serving']
        }, {
          fields: [
            'name', 'direction', 'per_serving'
          ],
          benchmark: true,
        }),
        user
      ])
    })
    .then(([recipe, user]) => {
      // associate
      // we can also send recipe, which is a DAO unmodified and it gets rendered at the client end in raw form. this is because data is sent over the wire as strings/buffers of strings
      user.addRecipe(recipe);
      delete recipe.dataValues['user_id'];
      res.status(201).send({
        status: 'added', recipe
      });
    })
    .catch(err => {
      if (res.writable) {
        try {
          res.status(500).send({
            status: `fail, ${err.message === 'Validation error'? 'sorry, recipe already exists': 'check "direction" and "name" have been provided, or login again'}`,
            [err.name]: err.message
          });
        } catch (e) {
          console.log('server error: \n', err);
          res.status(500).send({error: err.message});
        }
      } else {
        console.log('\nserver error: \n', err);
      }
    })
  } else {
    // better a redirect when applicable, or serve login page
    res.status(403).send({
      status: 'fail, signin or signup'
    });
  }
};
