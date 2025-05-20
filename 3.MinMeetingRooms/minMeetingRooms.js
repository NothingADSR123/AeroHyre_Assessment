function minMeetingRooms(events) {
  if (!events.length) return 0;

  // Sort events by start time
  events.sort((a, b) => a.start - b.start);

  // Min-heap to store end times (simulated with array)
  const endTimes = [];

  for (const event of events) {
    // Remove all rooms that are free (event starts after a meeting ends)
    for (let i = 0; i < endTimes.length; i++) {
      if (event.start >= endTimes[i]) {
        endTimes.splice(i, 1);
        break; // Only remove the earliest end time
      }
    }

    // Add current meeting's end time to heap
    endTimes.push(event.end);

    // Sort heap to maintain the earliest end time at the start
    endTimes.sort((a, b) => a - b);
  }

  // The size of endTimes array is the number of rooms needed
  return endTimes.length;
}

console.log(minMeetingRooms([])); // 0
console.log(minMeetingRooms([{ start: 1, end: 5 }])); // 1
console.log(minMeetingRooms([{ start: 1, end: 2 }, { start: 3, end: 4 }])); // 1
console.log(minMeetingRooms([{ start: 1, end: 4 }, { start: 2, end: 5 }, { start: 6, end: 8 }])); // 2
