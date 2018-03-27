import {ingredients} from './faker/fakify';

export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      {
        tableName: 'ingredients',
        schema: 'shuffler',
      }, ingredients
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete(
      {
        tableName: 'ingredients',
        schema: 'shuffler',
      }
    )
};
