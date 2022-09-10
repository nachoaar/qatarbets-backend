const { DataTypes, Sequelize } = require("sequelize");

module.exports = (Sequelize) => {
  Sequelize.define(
    "hisBets",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    },
    {
      timestamps: false,
    }
  );
};
