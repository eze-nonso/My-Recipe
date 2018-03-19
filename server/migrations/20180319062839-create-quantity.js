export default {
  up: (queryInterface, Sequelize) =>
     queryInterface.createTable('quantities', {
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
      },

      ingredient_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      recipe_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'recipes',
            schema: 'shuffler'
          },
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }
    }, {
      schema: 'shuffler'
    })
    .then(() =>
      queryInterface.addConstraint('shuffler.quantities', [
        'ingredient_id',
        'recipe_id'
      ], {
        type: 'unique'
      })
    )
    .then(() =>
      queryInterface.addConstraint({
        tableName: 'quantities',
        schema: 'shuffler'
      }, [
        'ingredient_id'
      ], {
        type: 'foreign key',
        references: {
          table: {
            tableName: 'ingredients',
            schema: 'shuffler'
          },
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    ),
  down: (queryInterface, Sequelize) =>
     queryInterface.dropTable({
       tableName: 'quantities',
       schema: 'shuffler'
     })
};
