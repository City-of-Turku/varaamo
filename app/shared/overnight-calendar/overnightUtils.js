import moment from 'moment';

/**
 * Handles setting the start and end dates when selecting a date range.
 * @param {Date} value new date to set
 * @param {Date|null} startDate starting date or null
 * @param {function} setStartDate function to set start date
 * @param {Date|null} endDate ending date or null
 * @param {function} setEndDate function to set end date
 */
export function handleDateSelect(value, startDate, setStartDate, endDate, setEndDate) {
  if (!value) {
    return;
  }

  if (!startDate) {
    setStartDate(value);
  } else if (value.getTime() === startDate.getTime()) {
    setStartDate(null);
    setEndDate(null);
  } else if (!endDate) {
    setEndDate(value);
  } else if (value.getTime() === endDate.getTime()) {
    setStartDate(null);
    setEndDate(null);
  } else {
    setStartDate(value);
    setEndDate(null);
  }
}

/**
 * Handles disabling days based on reservable, reservableAfter and reservableBefore.
 * @param {Object} params
 * @param {moment} params.day
 * @param {moment} params.now
 * @param {boolean} params.reservable
 * @param {string} params.reservableAfter datetime
 * @param {string} params.reservableBefore datetime
 * @param {Date} params.startDate
 * @param {Object[]} params.openingHours
 * @returns {boolean} is day disabled
 */
export function handleDisableDays({
  day, now, reservable, reservableAfter, reservableBefore, startDate,
  openingHours, reservations
}) {
  // TODO: min/max reservation time
  const isAfterToday = now.isAfter(day, 'day');
  const beforeDate = reservableAfter || moment();
  const isBeforeDate = moment(day).isBefore(beforeDate);
  const afterDate = reservableBefore || moment().add(1, 'year');
  const isAfterDate = moment(day).isAfter(afterDate);
  const isBeforeStartDate = startDate && moment(day).isBefore(startDate);
  if (!reservable) {
    return true;
  }
  if (isAfterToday || isBeforeDate || isAfterDate || isBeforeStartDate) {
    return true;
  }

  const closedDays = getClosedDays(openingHours);
  for (let index = 0; index < closedDays.length; index += 1) {
    const closedDay = closedDays[index];
    if (moment(day).isSame(closedDay.date, 'day')) {
      return true;
    }
  }

  if (startDate) {
    const firstBlockedDay = getFirstBlockedDay(startDate, reservations, closedDays);
    if (firstBlockedDay && moment(day).isSameOrAfter(firstBlockedDay, 'day')) {
      return true;
    }
  }

  return false;
}

export function getClosedDays(openingHours) {
  return openingHours.filter(oh => !oh.closes || !oh.opens);
}

/**
 * Returns reservations modifier for DayPicker
 * @param {Date} day
 * @param {Object[]} reservations
 * @returns {boolean} is day booked
 */
export function reservationsModifier(day, reservations) {
  if (day && reservations) {
    for (let index = 0; index < reservations.length; index += 1) {
      const reservation = reservations[index];
      const dayMoment = moment(day);
      const beginMoment = moment(reservation.begin);
      const endMoment = moment(reservation.end);
      if (dayMoment.isBetween(beginMoment, endMoment, 'day', '[]')) {
        return true;
      }
    }
  }

  return false;
}

export function nextDayBookedModifier(day, reservations) {
  const firstBooked = findFirstClosestReservation(day, reservations);
  if (firstBooked && moment(day).add(1, 'day').isSame(firstBooked.begin, 'day')) {
    return true;
  }
  return false;
}

export function prevDayBookedModifier(day, reservations) {
  const firstBooked = findPrevFirstClosestReservation(day, reservations);
  if (firstBooked && moment(day).subtract(1, 'day').isSame(firstBooked.end, 'day')) {
    return true;
  }
  return false;
}

export function nextDayClosedModifier(day, openingHours) {
  const closedDays = getClosedDays(openingHours);
  const firstClosed = findFirstClosedDay(day, closedDays);
  if (firstClosed && moment(day).add(1, 'day').isSame(firstClosed, 'day')) {
    return true;
  }
  return false;
}

export function prevDayClosedModifier(day, openingHours) {
  const closedDays = getClosedDays(openingHours);
  const firstClosed = findPrevFirstClosedDay(day, closedDays);
  if (firstClosed && moment(day).subtract(1, 'day').isSame(firstClosed, 'day')) {
    return true;
  }
  return false;
}

/**
 * Finds first closed day after fromDate.
 * @param {Date} fromDate
 * @param {Object[]} closedDays opening hrs objects
 * @returns {string|null} first closed day's date string
 */
export function findFirstClosedDay(fromDate, closedDays) {
  const fromMoment = moment(fromDate);
  const futureDates = closedDays.filter(closedDay => moment(closedDay.date).isAfter(fromMoment));
  const sortedDates = [...futureDates].sort(
    (a, b) => moment(a).diff(fromMoment) - moment(b).diff(fromMoment));
  return sortedDates.length > 0 ? sortedDates[0].date : null;
}

export function findPrevFirstClosedDay(fromDate, closedDays) {
  const fromMoment = moment(fromDate);
  const beforeDates = closedDays.filter(closedDay => moment(closedDay.date).isBefore(fromMoment));
  const sortedDates = [...beforeDates].sort(
    (a, b) => moment(a).diff(fromMoment) - moment(b).diff(fromMoment));
  return sortedDates.length > 0 ? sortedDates[sortedDates.length - 1].date : null;
}

/**
 * Finds first reservation after fromDate.
 * @param {Date} fromDate
 * @param {Object[]} reservations
 * @returns {Object|null} first reservation after fromDate or null if none found.
 */
export function findFirstClosestReservation(fromDate, reservations) {
  const fromMoment = moment(fromDate);
  const futureReservations = reservations.filter(
    reservation => moment(reservation.begin).isAfter(fromMoment));
  const sortedReservations = [...futureReservations].sort(
    (a, b) => moment(a.begin).diff(fromMoment) - moment(b.begin).diff(fromMoment));
  return sortedReservations.length > 0 ? sortedReservations[0] : null;
}

export function findPrevFirstClosestReservation(fromDate, reservations) {
  const fromMoment = moment(fromDate);
  const futureReservations = reservations.filter(
    reservation => moment(reservation.begin).isBefore(fromMoment));
  const sortedReservations = [...futureReservations].sort(
    (a, b) => moment(a.begin).diff(fromMoment) - moment(b.begin).diff(fromMoment));
  return sortedReservations.length > 0 ? sortedReservations[sortedReservations.length - 1] : null;
}

/**
 * Finds first blocked day after fromDate.
 * @param {Date} fromDate
 * @param {Object[]} reservations
 * @param {Object[]} openingHours
 * @returns {string|null} first blocked day's date string or null if none found.
 */
export function getFirstBlockedDay(fromDate, reservations, openingHours) {
  const firstClosedDay = findFirstClosedDay(fromDate, openingHours);
  const firstReservation = findFirstClosestReservation(fromDate, reservations);

  // If both firstClosedDay and firstReservation are available, compare their dates
  if (firstClosedDay && firstReservation) {
    const firstClosedDayMoment = moment(firstClosedDay);
    const firstReservationMoment = moment(firstReservation.begin);

    // Return whichever date is closer to fromDate
    return firstClosedDayMoment.diff(
      fromDate) < firstReservationMoment.diff(fromDate) ? firstClosedDay : firstReservation.begin;
  }

  // Return whichever is available
  if (firstClosedDay) {
    return firstClosedDay;
  }
  if (firstReservation) {
    return firstReservation.begin;
  }

  return null;
}

/**
 * Combines date and time into a datetime string and returns it.
 * @param {Date} date
 * @param {string} time e.g. "12:00:00"
 * @returns {string} datetime string e.g. "2018-02-01T12:00:00Z"
 * or empty string if date or time is missing
 */
export function getOvernightDatetime(date, time) {
  if (date && time) {
    const timeUnits = getHoursMinutesSeconds(time);
    const momentDate = moment(date);
    momentDate.set({
      hour: timeUnits.hours,
      minute: timeUnits.minutes,
      second: timeUnits.seconds
    });
    return momentDate.format('D.M.YYYY HH:mm');
  }
  return '';
}

export function getHoursMinutesSeconds(time) {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return { hours, minutes, seconds };
}

export function handleFormattingSelected(startDate, endDate, startTime, endTime, resourceId) {
  const startTimeUnits = getHoursMinutesSeconds(startTime);
  const endTimeUnits = getHoursMinutesSeconds(endTime);
  const begin = moment(startDate).set({
    hour: startTimeUnits.hours,
    minute: startTimeUnits.minutes,
    second: startTimeUnits.seconds
  }).toISOString();
  const end = moment(endDate).set({
    hour: endTimeUnits.hours,
    minute: endTimeUnits.minutes,
    second: endTimeUnits.seconds
  }).toISOString();
  return { begin, end, resource: resourceId };
}

export function getReservationUrl(reservation, resourceId) {
  return `/reservation?id=${reservation ? reservation.id : ''}&resource=${resourceId}`;
}
