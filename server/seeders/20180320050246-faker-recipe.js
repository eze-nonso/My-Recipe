import {recipes} from './faker/fakify';

export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert('recipes', recipes
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('recipe'),
}
