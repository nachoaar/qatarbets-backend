const { DataTypes, Sequelize } = require("Sequelize");

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
