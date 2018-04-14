// eslint-disable no-console

import app from '../app';
import { umzug } from '../server/models/index';

Promise.resolve()
// execute pending migrations
  .then(() =>
  // jump for 'test' since it handles its own setup
    (!(process.env.NODE_ENV === 'test')
      ? umzug.up()
      : undefined))
  .then(() =>
    app.set('port', parseInt(process.env.PORT, 10) || 8000)
  )
  .then(() => app.listen(app.get('port')))
  .then(() => console.log(`Up and running on PORT ${app.get('port')}`))
  .catch(e => console.error(e));

