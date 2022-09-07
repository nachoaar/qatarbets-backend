const { DataTypes, INTEGER } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
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
     // matches: {
     //   type: DataTypes.ARRAY(),
     //   get: function() {
     //       return JSON.parse(this.getDataValue('matches'));
     //   }, 
     //   set: function(val) {
     //       return this.setDataValue('matches', JSON.stringify(val));
     //   }
     // },
    },
    {
      timestamps: false,
    }
  );
};
