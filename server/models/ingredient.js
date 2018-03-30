
export default (sequelize, DataTypes) => {
  const Ingredient = sequelize.define('ingredient', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });

  Ingredient.associate = (models) => {
    Ingredient.belongsToMany(models.recipe, {
      through: models.quantity
    });
  };

  return Ingredient;
};
