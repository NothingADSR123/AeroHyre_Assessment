const express = require("express");
const app = express();
const bookingRoutes = require("./routes/bookings");

app.use(express.json());
app.use("/", bookingRoutes);

app.listen(3000, () => {
  console.log("Booking API running on http://localhost:3000");
});
