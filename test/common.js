import chai from 'chai';
import chaiHttp from 'chai-http';
import Umzug from 'umzug';
import path from 'path';
import faker from 'faker';
import app from '../app';
import { sequelize } from '../server/models';


chai.use(chaiHttp);
// populate object.prototype
chai.should();
const { expect } = chai;
const { assert } = chai;
const version = process.env.VERSION;

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

/**
 * @description function to create user and recipe
 *
 * @param {obj} agent
 * @return {promise} seeder promise
 * @private
 */
function populateDB(agent) {
  // should always take agent as arg, to resend coookie on create recipe

  return agent.post(`/api/${version}/users/signup`)
    .type('form')
    .send({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    })
    .then(() =>
      agent.post(`/api/${version}/recipes`)
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
        }));
}


export default {
  chai, app, expect, assert, umzugSeed, umzugMigrate, populateDB,
};
