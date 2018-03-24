export default (sequelize, DataTypes) => {
  const Quantity = sequelize.define('quantity', {
    qty: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Quantity;
};
