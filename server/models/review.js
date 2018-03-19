
export default (sequelize, DataTypes) => {
  const Review = sequelize.define('review', {
    comment: {
      'type': DataTypes.TEXT,
      'allowNull': false,
    },
    star: {
      'type': DataTypes.INTEGER,
      'validate': {
        isIn: {
          'args': [[1, 2, 3, 4, 5]],
          'msg': 'Only stars 1 to 5'
        }
      }
    },
    user_id: {
      'type': DataTypes.INTEGER,
      'unique': 'user_comment_on_recipe'
    },
    recipe_id: {
      'type': DataTypes.INTEGER,
      'unique': 'user_comment_on_recipe'
    }
  }, {
    // defined in config.json
    // schema: 'shuffler',
    // underscored: true,
  });

  Review.associate = models => {
    // associations here
    Review.belongsTo(models['user']);

    Review.belongsTo(models['recipe']);
  }

  return Review;
}
