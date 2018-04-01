import { user as User } from '../models';

export default (req, res) => {
  if (req.session.user) {
    const userId = req.session.user,
      recipeId = parseInt(req.params.recipeId, 10);
    User.findById(userId)
      .then((user) => {
        if (user) {
          return user.getRecipes({
            where: {
              id: recipeId,
            }
          });
        }
        // if no user, redirect? and break chain
        throw {
          message: 'no such User in database'
        };
      })
      .then((recipes) => {
        if (!recipes[0]) {
        // if no recipe found, break chain
          throw {
            message: `user ${userId} has no recipe ${recipeId}`
          };
        }
        const recipe = recipes[0];
        return Promise.all([
          recipe.destroy(),
          recipe
        ]);
      })
      .then(([, recipe]) =>
      // on success
        res.send({
          status: `recipe ${recipeId} removed`, deleted: recipe
        }))
      .catch((err) => {
        if (res.writable) {
          if (!(err instanceof Error)) {
            return res.status(400).send({
              status: 'fail',
              error: err.message,
            });
          }
          res.status(500).send({ status: 'fail', [err.name]: err.message });
        }
        console.error('\ncaught error:\n', err);
      });
  } else {
    // redirect to login if unset cookie
    // res.redirect('users/signin');
    res.status(403).send({
      status: 'fail, signin or signup'
    });
  }
};
