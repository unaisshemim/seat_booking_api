const Sequlize=require('sequelize')

module.exports=new Sequlize('seat_booking','postgres','unais123',{
    host:'localhost',
    dialect:'postgres'
})