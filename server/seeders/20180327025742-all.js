import { users, reviews, quantities, ingredients, recipes } from './faker/fakify';

export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert({
      tableName: 'users',
      schema: 'shuffler'
    }, users)
      .then(() =>
        queryInterface.bulkInsert({
          tableName: 'recipes',
          schema: 'shuffler',
        }, recipes))
      .then(() =>
        queryInterface.bulkInsert({
          tableName: 'ingredients',
          schema: 'shuffler',
        }, ingredients))
      .then(() =>
        queryInterface.bulkInsert({
          tableName: 'quantities',
          schema: 'shuffler',
        }, quantities))
      .then(() =>
        queryInterface.bulkInsert({
          tableName: 'reviews',
          schema: 'shuffler',
        }, reviews)),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete({
      tableName: 'reviews',
      schema: 'shuffler',
    })
      .then(() => {
        queryInterface.bulkDelete({
          tableName: 'quantities',
          schema: 'shuffler',
        });
      })
      .then(() => {
        queryInterface.bulkDelete({
          tableName: 'ingredients',
          schema: 'shuffler',
        });
      })
      .then(() => {
        queryInterface.bulkDelete({
          tableName: 'recipes',
          schema: 'shuffler',
        });
      })
      .then(() => {
        queryInterface.bulkDelete({
          tableName: 'users',
          schema: 'shuffler',
        });
      })
};
