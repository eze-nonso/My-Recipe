
export default (sequelize, DataTypes) => {
  const Recipe = sequelize.define('recipe', {
    name: {
      'type': DataTypes.STRING,
      'allowNull': false
    },
    direction: {
      'type': DataTypes.TEXT,
      'allowNull': false
    },
    per_serving: {
      'type': DataTypes.DECIMAL(3,1)
    },
    user_id: {
      'type': DataTypes.INTEGER,
      'references': {
        model: 'users',
        key: 'id',
      },
      // this is also the default
      'onDelete': 'SET NULL',
      'onUpdate': 'CASCADE'
    }
  }, {
    // schema: 'shuffler',
    indexes: [
      {
        unique: true,
        fields: [
          'name', 'direction',
        ],
      }
    ],
    // underscored: true
  });

  Recipe.associate = models => {
    // associations here
    Recipe.belongsTo(models['user'], {
      foreignKey: 'user_id'
    });

    Recipe.hasMany(models['review']);

    Recipe.belongsToMany(models['ingredient'], {
      through: models['quantity']
    });
  }

  return Recipe
}
