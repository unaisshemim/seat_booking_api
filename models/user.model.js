const {DataTypes} =require('sequelize')
const db=require("../config/database")


const User=db.define('user',{
    id:{
        type:DataTypes.UUID,
        primaryKey:true,
        defaultValue: DataTypes.UUIDV4,
       
    },
    phone:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    }
},{timeStamps:true})
module.exports=User