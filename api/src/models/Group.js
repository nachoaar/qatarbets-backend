const { DataTypes, Sequelize } = require("sequelize");

module.exports = (Sequelize) => {
  Sequelize.define(
    "group",
    {
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
