import express from 'express';
import cookieSession from 'cookie-session';
import fs from 'fs';
import routes from './server/routes';
import pg from 'pg';

// pg client by default returns strings for bigInt types, thus by extension sequelize count fn returns strings.. change this default
pg.defaults.parseInt8 = true;

const urlParser = express.urlencoded({
  extended: true, limit: '50kb', parameterLimit: 10
});

const key = fs.readFileSync('/Users/user/Desktop/node tutorial/beginner-node/connect/key.pem');

const cert = fs.readFileSync('/Users/user/Desktop/node tutorial/beginner-node/connect/cert.pem');

const app = express();

// define our non-api specific router
const router = express.Router();

app
  .use(urlParser)
  .use('/api', router);

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
