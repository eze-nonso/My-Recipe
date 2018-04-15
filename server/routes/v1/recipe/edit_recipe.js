import { editRecipe } from '../../../controllers';

export default app =>
  app.put('/recipes/:recipeId', editRecipe);
