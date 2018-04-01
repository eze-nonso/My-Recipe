export default {

  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('quantities', {
      qty: {
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
      schema: 'shuffler',
    })
      .then(() =>
        queryInterface.addConstraint({
          tableName: 'quantities',
          schema: 'shuffler',
        }, [
          'ingredient_id',
          'recipe_id'
        ], {
          type: 'unique'
        }))
      .then(() =>
        queryInterface.addConstraint({
          tableName: 'quantities',
          schema: 'shuffler'
        }, [
          'ingredient_id'
        ], {
          type: 'foreign key',
          name: 'quantities_ingredient_id_fkey',
          references: {
            table: {
              tableName: 'ingredients',
              schema: 'shuffler'
            },
            field: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade'
        })),
  down: queryInterface => (
    queryInterface.dropTable({
      tableName: 'quantities',
      schema: 'shuffler'
    })
  )
};
