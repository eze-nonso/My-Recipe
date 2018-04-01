
export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('ingredients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      schema: 'shuffler'
    })
      .then(() => queryInterface.addConstraint('shuffler.ingredients', [
        'name'
      ], {
        type: 'unique'
      })),
  down: queryInterface => (
    queryInterface.dropTable('ingredients', {
      schema: 'shuffler'
    })
  )
};
