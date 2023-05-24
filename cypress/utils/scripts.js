function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Generates opening hours for past 7 days and the next 14 days
 * @returns {Object[]} opening hours
 */
export function generateOpeningHrs() {
  const openingHrs = [];
  const today = new Date();

  // Add dates from seven days ago to 14 days in the future
  for (let i = -7; i <= 14; i += 1) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    const dateString = formatDate(date);
    openingHrs.push({
      date: dateString,
      opens: `${dateString}T08:00:00+03:00`,
      closes: `${dateString}T16:00:00+03:00`,
    });
  }

  return openingHrs;
}

/**
 * Gets tomorrow's date in the format DD.MM.YYYY
 * @returns {string} tomorrow's date
 */
export function getTomorrowDate() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dd = String(tomorrow.getDate()).padStart(2, '0');
  const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const yyyy = tomorrow.getFullYear();

  return `${dd}.${mm}.${yyyy}`;
}

/**
 * Formats date and time for begin and end in the format yyyy.mm.ddTHH:MM:SS+03:00
 * @param {string} date date in the format yyyy.mm.dd
 * @param {string} beginTime time in the format HH:MM
 * @param {string} endTime time in the format HH:MM
 * @returns {Object} object with begin and end date and time
 */
export function formatDateTime(date, beginTime, endTime) {
  const [day, month, year] = date.split('.');
  const [beginHour, beginMinute] = beginTime.split(':');
  const [endHour, endMinute] = endTime.split(':');

  const begin = new Date(`${year}-${month}-${day}T${beginHour}:${beginMinute}:00+03:00`).toISOString();
  const end = new Date(`${year}-${month}-${day}T${endHour}:${endMinute}:00+03:00`).toISOString();

  return {
    begin,
    end,
  };
}
