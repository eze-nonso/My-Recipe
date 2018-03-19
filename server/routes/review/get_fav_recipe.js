import {getFavRecipe} from '../../controllers';

export default app =>
  app.get('/users/:userId/recipes', getFavRecipe)
