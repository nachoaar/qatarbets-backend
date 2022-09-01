const { DataTypes } = require("Sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "group",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
