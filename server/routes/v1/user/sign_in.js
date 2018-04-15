import { signIn } from '../../../controllers';

export default app =>
  app.post('/users/signin', signIn);
