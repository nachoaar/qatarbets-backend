const { DataTypes, Sequelize } = require("sequelize");

module.exports = (Sequelize) => {
  Sequelize.define(
    "stage_fixture",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      home_team_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      away_team_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      home_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      away_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      result_match: {
        type: DataTypes.ENUM({
          values: ["home", "tie", "away"],
        }),
        allowNull: true,
      },
      profit_coef_home: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      profit_coef_draw: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      profit_coef_away: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      stadium_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      home_stage_position: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      away_stage_position: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      stage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );
};
