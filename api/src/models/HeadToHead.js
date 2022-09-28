const { DataTypes, INTEGER } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "headtohead",
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      id_home: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_away: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      result: {
        type: DataTypes.ENUM({
          values: ["winner_home", "tie", "winner_away"],
        }),
        allowNull: false,
      },
      score: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
