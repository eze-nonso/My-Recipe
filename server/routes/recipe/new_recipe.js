import {newRecipe} from '../../controllers';

export default app =>
  app.post('/recipes', newRecipe)
