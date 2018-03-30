import { getFavRecipe } from '../../controllers';

export default app =>
  app.get('/users/recipes', validUser, getFavRecipe);

// implement such functions in ../../middlewares
function validUser(req, res, next) {
  if (req.session.user) {
    return next();
  }

  res.status(403).send({
    status: 'fail',
    error: 'Login or signup',
  });
}
