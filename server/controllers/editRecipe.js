import {recipe as Recipe, user as User, Sequelize} from '../models';

export default (req, res, next) => {
  if (req.session.user && (req.body.name || req.body['per_serving'] || req.body.direction)) {
    const recipeId = req.params['recipeId'];
    const userId = req.session.user;
    User.findById(userId)
    .then(user => {
      if (!user) throw new Error(`user ${userId} not in database`);
      // assume there is such a user
      return user.getRecipes({
        where: {
          id: recipeId
        }
      })
    })
    .then(recipes => {
      if (!recipes[0]) throw new Error(`user ${userId} has no recipe ${recipeId}`);
      // assume recipe is returned
      return recipes[0].update(
        req.body, {
          fields: [
            'name', 'per_serving', 'direction'
          ]
        }
      )
    })
    .then(curRecipe => {
      return curRecipe.reload()
      .then(recipe => {
        delete recipe.dataValues['user_id'];
        res.status(200).send({status: 'updated', recipe});
      });
    })
    .catch(e => {
      if (res.writable) {
        res.status(500).send({status: 'fail', [e.name]: e.message});
      } else {
        console.log('\nserver error:\n', e);
      }
    })
  } else {
    res.status(403).send({status: 'fail, check parameters or signin'});
  }
}
