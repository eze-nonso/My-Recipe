import app from '../app';
import { umzug } from '../server/models/index';

app.set('port', parseInt(process.env.PORT, 10) || 8000);

Promise.resolve()
// execute pending migrations
  .then(() =>
  // jump for 'test' since it handles its own setup
    (!(process.env.NODE_ENV === 'test')
      ? umzug.up()
      : undefined))
  .then(() => app.listen(app.get('port')))
  .then(() => console.log('Up and running'))
  .catch(e => console.error(e));
