import { getFavRecipe } from '../../controllers';

const validUser = (req, res, next) => {
  if (req.session.user) {
    return next();
  }

  res.status(403).send({
    status: 'fail',
    error: 'Login or signup',
  });
};


export default app =>
  app.get('/users/recipes', validUser, getFavRecipe);
