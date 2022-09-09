const { DataTypes, Sequelize } = require("sequelize");

module.exports = (Sequelize) => {
  Sequelize.define(
    "match",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
      },
      home_team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          as: 'home',
          model: 'teams',
          key: 'id',
        }
      },
      away_team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          as: 'away',
          model: 'teams',
          key: 'id',
        }
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
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
