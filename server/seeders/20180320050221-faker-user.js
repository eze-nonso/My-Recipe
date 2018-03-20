import {users} from './faker/fakify';

export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert('users', users
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('users'),
}
