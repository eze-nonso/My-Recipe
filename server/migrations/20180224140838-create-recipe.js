
export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('recipes', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      direction: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      per_serving: {
        type: Sequelize.DECIMAL(3, 1),
      },

      user_id: {
        type: Sequelize.INTEGER,
        // // this works too
        // 'references': {
        //   model: {
        //     tableName: 'users',
        //     schema: 'shuffler',
        //   },
        //   key: 'id',
        // },
        // 'onDelete': 'SET NULL',
        // 'onUpdate': 'CASCADE',
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
      schema: 'shuffler',
    })
      .then(() =>
        queryInterface.addConstraint({
          tableName: 'recipes',
          schema: 'shuffler',
        }, [
          'name', 'direction'
        ], {
          type: 'unique',
          name: 'recipes_name_direction_uk',
        }))
      .then(() =>
        queryInterface.addConstraint({
          tableName: 'recipes',
          schema: 'shuffler',
        }, [
          'user_id'
        ], {
          type: 'foreign key',
          name: 'recipes_user_id_fkey',
          references: {
            table: {
              tableName: 'users',
              schema: 'shuffler',
            },
            field: 'id'
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        })),

  down: queryInterface =>
    queryInterface.dropTable({
      tableName: 'recipes',
      schema: 'shuffler'
    })
};
