import { getFavRecipe } from '../../../controllers';

const validUser = (req, res, next) => {
  if (req.session.user) {
    return next();
  }

  return res.status(403).send({
    status: 'fail, login or signup',
  });
};


export default app =>
  app.get('/users/recipes', validUser, getFavRecipe);
