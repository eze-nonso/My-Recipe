import {user as User} from '../models';

export default (req, res, next) => {
  if (req.session.user) {
    const userId = req.session.user,
    recipeId = parseInt(req.params.recipeId);
    User.findById(userId)
    .then(user => {
      if (user) {
        return user.getRecipes({
          where: {
            id: recipeId,
          }
        });
      }
      // if no user, redirect? and break chain
      res.status(403).send({
        status: 'fail, signin or signup'
      });
      throw new Error('noUser');
    })
    .then(recipes => {
      if (!recipes[0]) {
        // if no recipe found, break chain
        res.status(400).send({status: 'fail', message: `user ${userId} has no recipe ${recipeId}`});
        throw new Error('Recipe not found');
      }
      let recipe = recipes[0];
      return Promise.all([
        recipe.destroy(),
        recipe
      ]);
    })
    .then(([deleted, recipe]) => {
      // on success
      delete recipe.dataValues['created_at'];
      delete recipe.dataValues['updated_at'];
      delete recipe.dataValues['user_id'];
      res.send({
        status: `recipe ${recipeId} removed`, deleted: recipe
      });
    })
    .catch(err => {
      if (err.message !== 'noUser') {
        if (res.writable) {
          res.status(500).send({status: 'fail', [err.name]: err.message});
        } else {
          console.error('\nserver error:\n', err);
        }
      }
    })
  } else {
    // redirect to login if unset cookie
    // res.redirect('users/signin');
    res.status(403).send({
      status: 'fail, signin or signup'
    });
  }
}
