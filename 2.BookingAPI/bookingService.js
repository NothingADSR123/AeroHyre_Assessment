const { v4: uuidv4 } = require("uuid");
const bookings = require("./data");
const ROOMS = ["Room A", "Room B", "Room C"];
const WORK_START_HOUR = 9; // 9 AM
const WORK_END_HOUR = 18;  // 6 PM

function isOverlapping(start1, end1, start2, end2) {
  return start1 < end2 && start2 < end1;
}

function checkConflict(newBooking) {
  for (let [, existing] of bookings) {
    if (
      existing.room === newBooking.room &&
      isOverlapping(new Date(existing.start), new Date(existing.end), new Date(newBooking.start), new Date(newBooking.end))
    ) {
      return true;
    }
  }
  return false;
}

function createBooking({ room, start, end }) {
  const newBooking = {
    id: uuidv4(),
    room,
    start,
    end,
  };
  if (checkConflict(newBooking)) {
    throw new Error("Booking conflict detected");
  }
  bookings.set(newBooking.id, newBooking);
  return newBooking;
}

function getFreeSlots(date) {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    if (isNaN(dayStart)) {
      throw new Error("Invalid date format");
    }
  
    const freeSlotsByRoom = {};
  
    ROOMS.forEach((room) => {
      const bookingsForRoom = Array.from(bookings.values()).filter(
        (b) =>
          b.room === room &&
          b.start.startsWith(date)
      );
  
      bookingsForRoom.sort((a, b) => new Date(a.start) - new Date(b.start));
  
      const slots = [];
      let currentStart = new Date(dayStart);
      currentStart.setHours(WORK_START_HOUR, 0, 0, 0);
  
      bookingsForRoom.forEach((booking) => {
        const bookingStart = new Date(booking.start);
        if (bookingStart > currentStart) {
          slots.push({
            start: currentStart.toISOString(),
            end: bookingStart.toISOString(),
          });
        }
        const bookingEnd = new Date(booking.end);
        if (bookingEnd > currentStart) {
          currentStart = bookingEnd;
        }
      });
  
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(WORK_END_HOUR, 0, 0, 0);
  
      if (currentStart < dayEnd) {
        slots.push({
          start: currentStart.toISOString(),
          end: dayEnd.toISOString(),
        });
      }
  
      freeSlotsByRoom[room] = slots;
    });
  
    return freeSlotsByRoom;
  }
  
  

function rescheduleBooking(id, newStart, newEnd) {
  const booking = bookings.get(id);
  if (!booking) throw new Error("Booking not found");

  const updatedBooking = { ...booking, start: newStart, end: newEnd };

  bookings.delete(id);
  if (checkConflict(updatedBooking)) {
    bookings.set(id, booking); // rollback
    throw new Error("Conflict on reschedule");
  }

  bookings.set(id, updatedBooking);
  return updatedBooking;
}

function deleteBooking(id) {
  return bookings.delete(id);
}

module.exports = {
  createBooking,
  getFreeSlots,
  rescheduleBooking,
  deleteBooking,
};
