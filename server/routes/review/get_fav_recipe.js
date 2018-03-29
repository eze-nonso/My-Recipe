import { getFavRecipe } from '../../controllers';

export default app =>
  app.get('/users/recipes', getFavRecipe)
