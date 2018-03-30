import { newReview } from '../../controllers';

export default app =>
  app.post('/recipes/:recipeId/reviews', newReview);
