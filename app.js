import express from 'express';
import cookieSession from 'cookie-session';
import pg from 'pg';
import routes from './server/routes';


// pg client by default returns strings for bigInt types,
// thus by extension sequelize count fn returns strings.. change this default
pg.defaults.parseInt8 = true;

const urlParser = express.urlencoded({
  extended: true, limit: '50kb', parameterLimit: 10
});

const key = process.env.KEY1;

const cert = process.env.KEY2;

const app = express();

// define our non-api specific router
const router = express.Router();

app
  .use(urlParser)
  .all('/api', (req, res) => ({
    return res.send({
      message: 'This is the Projekt-blue api'
    });
  }))
  .use('/api', router)
  .all('/', (req, res) => ({
    return res.send({
      message: 'Welcome to the top secret Projekt-blue server'
    });
  }));

// including cookieSession
router
  .use(cookieSession({
    keys: [
      key, cert
    ],
    maxAge: 86400000
  }));

// attaching routes
Object.keys(routes).forEach((ident) => {
  routes[ident](router);
});

router.all('/*', (req, res) => {
  res.status(501).send({
    status: 'Oops! try not to fall on the wayside, says catchall'
  });
});

export default app;
