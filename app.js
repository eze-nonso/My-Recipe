import express from 'express';
import cookieSession from 'cookie-session';
import pg from 'pg';
import v1 from './server/routes/v1';

// pg client by default returns strings for bigInt types,
// thus by extension sequelize count fn returns strings.. change this default
pg.defaults.parseInt8 = true;

const VERSIONS = {
  v1,
};

const urlParser = express.urlencoded({
  extended: true, limit: '50kb',
});

const key = process.env.KEY1;

const cert = process.env.KEY2;

const app = express();

app
  .use(urlParser)
  .use(cookieSession({
    keys: [
      key, cert
    ],
    maxAge: 86400000
  }))
  .all('/api', (req, res) => (
    res.send({
      message: 'This is the Projekt-blue api'
    })
  ))
  .all('/', (req, res) => (
    res.send({
      message: 'Welcome to the top secret Projekt-blue server'
    })
  ));

// attach versions
Object.keys(VERSIONS).forEach((v) => {
  // define non-api specific router
  let router = express.Router();

  let routes = VERSIONS[v];
  // attach routes
  Object.keys(routes).forEach((ident) => {
    routes[ident](router);
  });

  app
    .use(`/api/${v}`, router);

  // define catchall
  router.all('/*', (req, res) => (
    res.status(501).send({
      status: 'Oops! try not to fall on the wayside, says catchall'
    })
  ));
});


export default app;
