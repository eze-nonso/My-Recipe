import { recipe as Recipe, user as User, ingredient as Ingredient, Sequelize, sequelize, } from '../models';

import createOrUpdate from './common';

export default (req, res, next) => {
  if (req.session.user && (req.body.name && req.body.direction)) {
    const recipeId = req.params.recipeId;
    const userId = req.session.user;

    return User.findById(userId)
      .then((user) => {
        if (!user) throw (`user ${userId} not in database`);
        // assume there is such a user
        return user.getRecipes({
          where: {
            id: recipeId,
          },
        });
      })
      .then((recipes) => {
        if (!recipes[0]) throw (`user ${userId} has no recipe ${recipeId}`);
        return recipes[0];
      })
      .then(recipe =>
      // assume recipe is returned
        sequelize.transaction(t => recipe.update(req.body, {
          fields: [
            'name', 'per_serving', 'direction'
          ],
          transaction: t,
        })
          .then(updatedRecipe => Promise.all([
            updatedRecipe,
            req.body.ingredients
              ? updatedRecipe.setIngredients([], {
                transaction: t,
              })
                .then(() =>
                  createOrUpdate(updatedRecipe, req.body.ingredients, t))
              : undefined
          ]))))
      .then(([curRecipe]) => curRecipe.reload({
        include: [{
          model: Ingredient,
        }]
      })
        .then((recipe) => {
          res.status(200).send({ status: 'updated', recipe });
        }))
      .catch((e) => {
        if (res.writable) {
          if (!(e instanceof Error)) {
            return res.status(400).send({
              status: 'fail',
              error: e,
            });
          }
          res.status(500).send({ status: 'fail', [e.name]: e.message });
        }
        console.log('\ncaught error:\n', e);
      });
  }
  res.status(403).send({ status: 'fail, check parameters or signin' });
};
