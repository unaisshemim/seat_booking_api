const {DataTypes}=require('sequelize')
const db=require('../config/database')


const Prize=db.define('prize',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull:false
      },
      seat_class: {
        type: DataTypes.STRING,
        field: 'seat_class',
        allowNull:false
      },
      min_price: {
        type: DataTypes.FLOAT,
        
      },
      normal_price: {
        type: DataTypes.FLOAT,
        
      },
      max_price: {
        type: DataTypes.FLOAT,
        
      },
      
},{timestamps:true})

module.exports=Prize