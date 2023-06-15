const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
//model
const Seat = require("../models/seat.model");
const Prize = require("../models/seatPrize.model");
const User = require("../models/user.model");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.MAIL_GRID);
exports.createSeat = async (req, res) => {
  const { id, seat_identifier, seat_class } = req.body;
  await Seat.create({
    id,
    seat_identifier,
    seat_class,
  })
    .then((value) => {
      res.status(200).json(value);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

exports.createPrize = async (req, res) => {
  await Prize.create({
    id: value.id,
    seat_class: value.seat_class,
    min_price: parseFloat(value.min_price.replace("$", "")),
    normal_price: parseFloat(value.normal_price.replace("$", "")),
    max_price: parseFloat(value.max_price.replace("$", "")),
  })
    .then((value) => {
      res.status(200).json(value);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

exports.getSeats = async (req, res) => {
  try {
    // Retrieve all seats from the database, ordered by seat class
    const seats = await Prize.findAll({
      order: [["seat_class", "ASC"]],
    });

    // Map the seats to include the is_booked property
    const seatsWithIsBooked = seats.map((seat) => ({
      id: seat.id,
      seat_class: seat.seat_class,
      is_booked: seat.is_booked,
    }));

    // Return the seats as a JSON response
    res.json(seatsWithIsBooked);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error retrieving seats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getPrizing = async (req, res) => {
  try {
    const seatId = req.query.id;

    // Find the seat by ID
    const filterCondition = seatId ? { seat_class: seatId } : {};
    const seats = await Seat.findAll({
      where: filterCondition,
      order: [["seat_class", "ASC"]],
    });

    if (!seats) {
      return res.status(404).json({ error: "Seat not found" });
    }

    // Find the seat pricing based on seat class
    const seatPricing = await Prize.findOne({
      where: { seat_class: seatId },
    });

    if (!seatPricing) {
      return res.status(404).json({ error: "Seat pricing not found" });
    }

    // Calculate the percentage of seats booked for the seat class
    const totalSeats = await Seat.count({ where: { seat_class: seatId } });
    const bookedSeats = await Seat.count({
      where: { seat_class: seatId, is_booked: true },
    });
    const seatsBookedPercentage = (bookedSeats / totalSeats) * 100;

    // // Determine the pricing based on the percentage of seats booked
    let pricing;
    if (seatsBookedPercentage < 40) {
      pricing = seatPricing.min_price;
    } else if (seatsBookedPercentage >= 40 && seatsBookedPercentage <= 60) {
      pricing = seatPricing.normal_price;
    } else {
      pricing = seatPricing.max_price;
    }

    // Return the seat details and pricing as a JSON response
    res.json({
      id: seats.id,
      seat_class: seats.seat_class,
      pricing,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.addUser = async (req, res) => {
  const { phone, email } = req.body;
  await User.create({
    phone,
    email,
  })
    .then((value) => {
      res.status(200).json(value);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
};

exports.bookSeat = async (req, res) => {
  const { seatId, email, phone } = req.body;
  if (!email && !phone) {
    return res.status(400).json({ error: "Email or phone must be provided" });
  }

  try {
    const user = await User.findOne({
      where: email ? { email } : { phone },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const seat = await Seat.findOne({
      where: {
        seat_identifier: seatId,
        is_booked: false,
      },
    });

    if (!seat) {
      return res.status(404).json({ error: "Seat not found or already booked" });
    }

    seat.is_booked = true;
    seat.user_id = user.id;
    await seat.save();
    const msg = {
      to: 'pjajeena@gmail.com', // Email address of the recipient
      from: 'unaisshemim@gmail.com', // Email address of the sender
      subject: 'Hello from SendGrid', // Email subject
      text: 'This is a test email sent using SendGrid', // Plain text content
      html: '<p>This is a test email sent using <strong>SendGrid</strong></p>', // HTML content
    };
    
    sgMail.send(msg)
      .then(() => {
        console.log('Email sent successfully');
      })
      .catch((error) => {
        console.error('Error sending email', error);
      });
    res.json("Booking updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.findBooking=async(req,res)=>{
  const {email, phone } = req.body;
  if (!email && !phone) {
    return res.status(400).json({ error: "Email or phone must be provided" });
  }
  try {
    const user = await User.findOne({
      where: email ? { email } : { phone },

    });
    const bookings = await Seat.findAll({
      where: { user_id: user.id },
    })
    res.json(bookings)
  } catch (error) {
    res.json(error)
  }
 
}
