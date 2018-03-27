import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import Umzug from 'umzug';
import {sequelize} from '../server/models';
import path from 'path';
import faker from 'faker';

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
    // setup sequelize instance provides storage options including schema
    sequelize,
    tableName: 'sequelize_meta',
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
  chai, app, should, expect, assert, umzugSeed, umzugMigrate, populateDB,
};



// function to create a user and a recipe we plan to use often
function populateDB(...args) {
  // should always take agent as arg, to resend coookie on create recipe
  const agent = args[0];
  return agent.post('/api/users/signup')
  .type('form')
  .send({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  })
  .then(() =>
    agent.post('/api/recipes')
    .type('form')
    .send({
      name: faker.lorem.word(),
      direction: faker.lorem.text(),
      per_serving: faker.fake('{{random.number(3)}}.{{random.number(5)}}'),
      ingredients: [
        {
          [faker.lorem.word()]: faker.fake('{{random.number(4)}}.{{random.number(5)}} {{lorem.word}}')
        },
        {
          [faker.lorem.word()]: faker.fake('{{random.number(4)}}.{{random.number(5)}} {{lorem.word}}')
        },
        {
          [faker.lorem.word()]: faker.fake('{{random.number(4)}}.{{random.number(5)}} {{lorem.word}}')
        },
        {
          [faker.lorem.word()]: faker.fake('{{random.number(4)}}.{{random.number(5)}} {{lorem.word}}')
        },
      ]
    })
  );
}
