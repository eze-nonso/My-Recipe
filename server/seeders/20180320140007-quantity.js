import {quantities} from './faker/fakify';

export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      {
        tableName: 'quantities',
        schema: 'shuffler',
      }, quantities
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete(
      {
        tableName: 'quantities',
        schema: 'shuffler',
      }
    )
};
