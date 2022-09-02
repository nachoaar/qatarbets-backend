const { DataTypes, Sequelize } = require("Sequelize");

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
