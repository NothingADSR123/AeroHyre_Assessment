const express = require("express");
const router = express.Router();
const {
  createBooking,
  getFreeSlots,
  rescheduleBooking,
  deleteBooking,
} = require("../bookingService");

router.post("/bookings", (req, res) => {
  try {
    const booking = createBooking(req.body);
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/slots", (req, res) => {
  const { date } = req.query;
  const slots = getFreeSlots(date);
  res.json(slots);
});

router.put("/bookings/:id", (req, res) => {
  const { id } = req.params;
  const { start, end } = req.body;
  try {
    const updated = rescheduleBooking(id, start, end);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/bookings/:id", (req, res) => {
  const { id } = req.params;
  const success = deleteBooking(id);
  res.status(success ? 204 : 404).end();
});

module.exports = router;
