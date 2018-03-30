
export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    // defined on new Sequelize
    // schema: 'shuffler',
    // underscored: true
  });

  User.associate = (models) => {
    // associations here
    User.hasMany(models.recipe, {
      foreignKey: 'user_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    User.hasMany(models.review);
  };

  return User;
};
