const { DataTypes } = require("sequelize");


module.exports = (sequelize) => {
  sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pass: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwMwl2hG1ZsOajflM1eEAiK6rsVSJ3jej5KQ&usqp=CAU'
      },
      rol: {
        type: DataTypes.ENUM({values: ['admin', 'gambler']}),
        allowNull: false,
        defaultValue: 'gambler'
      },
      saldo: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      }
    }, { timestamps: false }
  );
}