import {
  recipe as Recipe, user as User, quantity as Quantity, ingredient as Ingredient, Sequelize, sequelize
} from '../models';

import {
  createOrUpdate
} from './common';

let newRecipe;
export default (req, res, next) => {
  if (req.session.user) {
    // query by cookie value
    const userId = req.session.user;

    return sequelize.transaction(t => {
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
            per_serving: parseInt(req.body['per_serving'])
          }, {
            fields: [
              'name', 'direction', 'per_serving'
            ],
            benchmark: true,
            transaction: t
          }),
          user,
        ])
      })
      .then(([recipe, user]) => {
        // associate
        return user.addRecipe(recipe, {
          transaction: t,
        })
        .then(() =>
          createOrUpdate(recipe, req.body.ingredients, t,)
        )
        .then(() => recipe)
      });
    })
    .then((recipe) => {
      return recipe.reload({
        include: [{
          model: Ingredient,
        }]
      });
    })
    .then(recipe => {
      return res.status(201).send({
        status: 'added',
        recipe
      });
    })

    .catch(e =>
      res.writable
      ? res.status(500).send({
        [e.name]: e.message
      })
      : console.error(e)
    )
  } else {
    // better a redirect when applicable, or serve login page
    res.status(403).send({
      status: 'fail, signin or signup'
    });
  }
};
