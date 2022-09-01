const {DataTypes, Sequelize, DATE} = require('sequelize')

module.exports = (Sequelize) =>{
    Sequelize.define('bet' ,{
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, 
            allowNull:false,
            primaryKey: true,
        },
        fecha_hora:{
            type: DataTypes.DATE,
            allowNull:false
        },
        money_bet:{
            type: DataTypes.FLOAT,
            allowNull: false
        },
        result:{
            type: DataTypes.ENUM("home","draw","away"),
            allowNull: false,
        },
        condition:{
            type: DataTypes.STRING,
            allowNull: false
        },
        expected_profit:{
            type: DataTypes.FLOAT,
            allowNull: false
        },
        final_profit:{
            type: DataTypes.FLOAT
        }

    })
}
