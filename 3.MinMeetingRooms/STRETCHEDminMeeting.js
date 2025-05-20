function minMeetingRoomsWithAssignments(events) {
  if (!events.length) return { roomCount: 0, assignments: [] };

  // Sort events by start time
  const sortedEvents = events.map((e, idx) => ({ ...e, index: idx }));
  sortedEvents.sort((a, b) => a.start - b.start);

  const rooms = []; // Array of { endTime, roomId }
  const assignments = new Array(events.length);
  let nextRoomId = 1;

  for (const event of sortedEvents) {
    let assigned = false;

    // Try to reuse an available room
    for (const room of rooms) {
      if (event.start >= room.endTime) {
        room.endTime = event.end;
        assignments[event.index] = room.roomId;
        assigned = true;
        break;
      }
    }

    // If no room is free, assign a new room
    if (!assigned) {
      rooms.push({ endTime: event.end, roomId: nextRoomId });
      assignments[event.index] = nextRoomId;
      nextRoomId++;
    }
  }

  return {
    roomCount: rooms.length,
    assignments: assignments
  };
}


const events = [
  { start: 0, end: 30 },
  { start: 5, end: 10 },
  { start: 15, end: 20 }
];

const result = minMeetingRoomsWithAssignments(events);
console.log("Rooms Needed:", result.roomCount);         // e.g., 2
console.log("Room Assignments:", result.assignments);   // e.g., [1, 2, 1]
