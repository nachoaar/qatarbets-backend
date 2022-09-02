const { DataTypes, Sequelize } = require("Sequelize");

module.exports = (Sequelize) => {
  Sequelize.define(
    "hisBets",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      id_user:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_bet:{
      type: DataTypes.INTEGER,
      allowNull: false
  },
    },
    {
      timestamps: false,
    }
  );
};
