export default (sequelize, DataTypes) => {
  const Quantity = sequelize.define('quantity', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Quantity;
};
