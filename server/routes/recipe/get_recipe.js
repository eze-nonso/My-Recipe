import { getRecipe } from '../../controllers';

export default app =>
  app.get(
    '/recipes', (req, res, next) =>
      (req.query.sort && req.query.order
        ? next('route')
        : next()),
    getRecipe
  );
