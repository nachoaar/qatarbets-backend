const { DataTypes,Sequelize} = require("Sequelize")


module.exports = (Sequelize) =>{
    Sequelize.define('group',{
        id:{
            type:DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        name:{
            type:DataTypes.STRING,
            allowNull: false,
        }
    })
}
