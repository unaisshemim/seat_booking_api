var { DataTypes } = require('sequelize');
const db = require('../config/database');


const Seat = db.define('seat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull:false
  },
  seat_identifier: {
    type: DataTypes.TEXT,
    allowNull:false,
    field: 'seat_identifier',
  },
  seat_class: {
    type: DataTypes.STRING,
    field: 'seat_class',
    allowNull:false
  },
  is_booked:{
    type:DataTypes.BOOLEAN,
    default:false
  },
  user_id:{
    type:DataTypes.UUID,
    default:null
  }
 
}, {
  timestamps: true, // Disable timestamps (createdAt, updatedAt)
});

module.exports = Seat;