import { deleteRecipe } from '../../../controllers';

export default app =>
  app.delete('/recipes/:recipeId', deleteRecipe);
