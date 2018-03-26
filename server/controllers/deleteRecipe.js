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
      throw ('no such User in database');
    })
    .then(recipes => {
      if (!recipes[0]) {
        // if no recipe found, break chain
        throw (`user ${userId} has no recipe ${recipeId}`);
      }
      let recipe = recipes[0];
      return Promise.all([
        recipe.destroy(),
        recipe
      ]);
    })
    .then(([deleted, recipe]) =>
      // on success
      res.send({
        status: `recipe ${recipeId} removed`, deleted: recipe
      })
    )
    .catch(err => {
      if (res.writable) {
        if (!(e instanceof Error)) {
          return res.status(400).send({
            status: 'fail',
            error: e,
          });
        }
        res.status(500).send({status: 'fail', [e.name]: e.message});
      }
      console.error('\ncaught error:\n', e);
    })
  } else {
    // redirect to login if unset cookie
    // res.redirect('users/signin');
    res.status(403).send({
      status: 'fail, signin or signup'
    });
  }
}
