const express=require('express')
const router=express.Router();
const {Sequelize}=require('sequelize')
const {createSeat,createPrize,getSeats,getPrizing, bookSeat, addUser, findBooking}=require('../controller/seatbooking.controller')



//add seat
router.post("/addseat", createSeat);

router.post("/addprize",createPrize)

router.get('/seats',getSeats)

router.get('/getprize',getPrizing)

router.post('/addUser',addUser)

router.post('/bookSeat',bookSeat)

router.post('/findBooking',findBooking)

module.exports=router;