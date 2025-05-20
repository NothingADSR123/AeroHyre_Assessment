const {
    createBooking,
    rescheduleBooking,
    deleteBooking,
    getFreeSlots,
  } = require("../bookingService");
  const bookings = require("../data");
  
  beforeEach(() => {
    bookings.clear();
  });
  
  test("should create a booking", () => {
    const booking = createBooking({
      room: "Room A",
      start: "2025-05-20T10:00:00",
      end: "2025-05-20T11:00:00",
    });
    expect(booking).toHaveProperty("id");
  });
  
  test("should prevent overlapping bookings", () => {
    createBooking({
      room: "Room A",
      start: "2025-05-20T10:00:00",
      end: "2025-05-20T11:00:00",
    });
  
    expect(() =>
      createBooking({
        room: "Room A",
        start: "2025-05-20T10:30:00",
        end: "2025-05-20T11:30:00",
      })
    ).toThrow("Booking conflict detected");
  });
  
  // New test: rescheduleBooking success and conflict
  test("should reschedule a booking", () => {
    const booking = createBooking({
      room: "Room B",
      start: "2025-05-21T09:00:00",
      end: "2025-05-21T10:00:00",
    });
  
    const updated = rescheduleBooking(booking.id, "2025-05-21T11:00:00", "2025-05-21T12:00:00");
    expect(updated.start).toBe("2025-05-21T11:00:00");
  });
  
  test("should not reschedule to conflicting time", () => {
    createBooking({
      room: "Room C",
      start: "2025-05-22T09:00:00",
      end: "2025-05-22T10:00:00",
    });
  
    const booking = createBooking({
      room: "Room C",
      start: "2025-05-22T11:00:00",
      end: "2025-05-22T12:00:00",
    });
  
    expect(() =>
      rescheduleBooking(booking.id, "2025-05-22T09:30:00", "2025-05-22T10:30:00")
    ).toThrow("Conflict on reschedule");
  });
  
  // New test: delete booking
  test("should delete a booking", () => {
    const booking = createBooking({
      room: "Room A",
      start: "2025-05-23T13:00:00",
      end: "2025-05-23T14:00:00",
    });
    const result = deleteBooking(booking.id);
    expect(result).toBe(true);
    expect(bookings.has(booking.id)).toBe(false);
  });
  
  // New test: getFreeSlots
  test("should return free slots correctly", () => {
    createBooking({
      room: "Room A",
      start: "2025-05-24T09:00:00",
      end: "2025-05-24T10:00:00",
    });
    createBooking({
      room: "Room A",
      start: "2025-05-24T11:00:00",
      end: "2025-05-24T12:00:00",
    });
  
    const freeSlots = getFreeSlots("2025-05-24");
    expect(freeSlots["Room A"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          start: expect.any(String),
          end: expect.any(String),
        }),
      ])
    );
  });
  