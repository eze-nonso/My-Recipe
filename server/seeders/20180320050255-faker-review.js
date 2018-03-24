import {reviews} from './faker/fakify';

export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert('reviews', reviews
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('reviews'),
}
