/**
 * Calculates and returns all possible time points in a day
 * @param {string} slotSize
 * @param {string} startTime - Start time e.g. "2024-06-27T08:00:00+03:00"
 * @returns {string[]} array of time points in 24h format (HH:MM)
 */
export function calcPossibleTimes(slotSize, startTime) {
  if (!slotSize || !startTime) {
    return [];
  }

  const slots = [];
  const [hours, minutes] = slotSize.split(':').map(Number);
  const slotMinutes = hours * 60 + minutes;

  const start = new Date(startTime);
  const midnight = new Date(start);
  midnight.setHours(24, 0, 0, 0);

  let current = start;
  while (current < midnight) {
    slots.push(formatTime(current));
    current = new Date(current.getTime() + slotMinutes * 60000);
  }

  return slots;
}

/**
 * Formats a Date object to HH:MM string
 * @param {Date} date
 * @returns {string} time in HH:MM format
 */
export function formatTime(date) {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

/**
 * Check if given timestamp is in possible times
 * @param {string} timestamp
 * @param {string[]} possibleTimes
 * @returns {boolean} true if timestamp is in possible times, false otherwise
 */
export function isValidTime(timestamp, possibleTimes) {
  if (!timestamp || !possibleTimes) {
    return true;
  }
  const date = new Date(timestamp);
  const timeString = date.toTimeString().slice(0, 5); // Get HH:MM format
  return possibleTimes.includes(timeString);
}

/**
 * Validates that currently selected start and end times are valid. When missing
 * values result is considered valid.
 * @param {Object} selection currently selected times
 * @param {string[]} possibleTimes array of possible time points in a day
 * @returns {boolean} true if both start and end times are valid, false otherwise
 */
export function isValidSelection(selection, possibleTimes) {
  return isValidTime(selection?.begin, possibleTimes)
   && isValidTime(selection?.end, possibleTimes);
}
