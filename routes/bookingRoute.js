const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

router.post("/book", async (req, res) => {
  try {
    const { name, resortName, checkIn, checkOut, email, phone, card } = req.body;

    // Optional: Validate card number format & mask last 4
    const last4Digits = card.number.slice(-4);

    const newBooking = new Booking({
      name,
      resortName,
      checkIn,
      checkOut,
      email,
      phone,
      card: {
        cardType: card.cardType,
        last4Digits,
        cardHolderName: card.cardHolderName,
        expiration: card.expiration,
      },
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking successful!" });

  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Server error. Booking failed." });
  }
});

module.exports = router;
