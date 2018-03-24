import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import Umzug from 'umzug';
import {sequelize} from '../server/models';
import path from 'path';


chai.use(chaiHttp);
const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;

const umzugMigrate = new Umzug({
  logging: false,
  migrations: {
    params: [
      sequelize.getQueryInterface(), sequelize.constructor
    ],
    path: path.resolve(__dirname, '../server/migrations'),
    pattern: /\.js$/
  },
  storage: 'sequelize',
  storageOptions: {
    sequelize,
    tableName: 'sequelize_meta',
    schema: 'shuffler'
  }
});

const umzugSeed = new Umzug({
  logging: false,
  migrations: {
    params: [
      sequelize.getQueryInterface(),
      sequelize.constructor
    ],
    path: path.resolve(__dirname, '../server/seeders'),
    pattern: /\.js$/
  },
  storage: 'none'
});


export default {
  chai, app, should, expect, assert, umzugSeed, umzugMigrate, populateDB
};



// function to create a user and a recipe we plan to use often
function populateDB(...args) {
  // should take agent as arg, to resend coookie on create recipe
  const agent = args[0];
  return agent.post('/api/users/signup')
  .type('form')
  .send({
    username: 'newUser',
    email: 'new@user.com',
    password: 'new'
  })
  .then(() =>
    agent.post('/api/recipes')
    .type('form')
    .send({
      name: 'Quinox',
      direction: 'Stir as desired',
      per_serving: 2
    })
  );
}
