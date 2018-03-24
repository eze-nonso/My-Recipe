import app from '../app';
import {umzug} from '../server/models/index';

app.set('port', parseInt(process.env['PORT']) || 8000);

Promise.resolve()
.then(() => {
  // jump for env test since test handles its own database setup
  if (process.env.NODE_ENV === 'test') throw new Error();
})
// execute pending migrations
.then(() => umzug.up())
.catch(e => {})
.then(() => app.listen(app.get('port')))
.then(() => console.log('Up and running'));
