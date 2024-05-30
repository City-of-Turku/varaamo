import moment from 'moment';

import { formatDatetimeToString } from '../../utils/timeUtils';

/**
 * Handles setting the start and end dates when selecting a date range.
 * @param {Object} params
 * @param {Date} params.value new date to set
 * @param {Date|null} params.startDate starting date or null
 * @param {function} params.setStartDate function to set start date
 * @param {Date|null} params.endDate ending date or null
 * @param {function} params.setEndDate function to set end date
 * @param {string} params.overnightStartTime time to set start date to
 * @param {string} params.overnightEndTime time to set end date to
 */
export function handleDateSelect({
  value, startDate, setStartDate, endDate, setEndDate, overnightStartTime, overnightEndTime
}) {
  if (!value) {
    return;
  }

  const startTimedValue = setDatesTime(value, overnightStartTime).toDate();
  const endTimedValue = setDatesTime(value, overnightEndTime).toDate();

  if (!startDate) {
    setStartDate(startTimedValue);
  } else if (startTimedValue.getTime() === startDate.getTime()) {
    setStartDate(null);
    setEndDate(null);
  } else if (startTimedValue.getTime() < startDate.getTime()) {
    setStartDate(startTimedValue);
    setEndDate(null);
  } else if (!endDate) {
    setEndDate(endTimedValue);
  } else {
    setStartDate(startTimedValue);
    setEndDate(null);
  }
}

/**
 * Handles disabling days.
 * @param {Object} params
 * @param {Date} params.day
 * @param {moment} params.now
 * @param {boolean} params.reservable
 * @param {string} params.reservableAfter datetime
 * @param {string} params.reservableBefore datetime
 * @param {Object[]} params.openingHours
 * @param {Object[]} params.reservations
 * @param {boolean} params.hasAdminBypass
 * @param {string} params.overnightStartTime
 * @returns {boolean} is day disabled
 */
export function handleDisableDays({
  day, now, reservable, reservableAfter, reservableBefore,
  openingHours, reservations, hasAdminBypass, overnightStartTime
}) {
  const startTimedDay = setDatesTime(day, overnightStartTime).toDate();
  const isAfterToday = hasAdminBypass ? now.isAfter(day, 'day') : now.isAfter(startTimedDay);
  const beforeDate = reservableAfter || moment();
  const isBeforeDate = moment(day).isBefore(beforeDate, 'day');
  const afterDate = reservableBefore || moment().add(1, 'year');
  const isAfterDate = moment(day).isAfter(afterDate, 'day');
  if (!hasAdminBypass && !reservable) {
    return true;
  }
  if (isAfterToday || isBeforeDate || isAfterDate) {
    return true;
  }
  if (reservationsModifier(day, reservations)) {
    return true;
  }

  const closedDays = getClosedDays(openingHours);
  for (let index = 0; index < closedDays.length; index += 1) {
    const closedDay = closedDays[index];
    if (moment(day).isSame(closedDay.date, 'day')) {
      return true;
    }
  }

  return false;
}

/**
 * Checks if period is over max period.
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {string} maxPeriod
 * @param {string} overnightEndTime
 * @param {string} overnightStartTime
 * @returns {boolean} is period over max period
 */
export function isOverMaxPeriod(
  startDate, endDate, maxPeriod, overnightEndTime, overnightStartTime) {
  const end = setDatesTime(endDate, overnightEndTime);
  const start = setDatesTime(startDate, overnightStartTime);
  const duration = moment.duration(end.diff(start));
  if (duration > moment.duration(maxPeriod)) {
    return true;
  }
  return false;
}

/**
 * Gets closed days in opening hours list
 * @param {Object[]} openingHours
 * @returns {Object[]} closed days
 */
export function getClosedDays(openingHours) {
  return openingHours.filter(oh => !oh.closes || !oh.opens);
}

/**
 * Returns reservations modifier for DayPicker
 * @param {Date} day
 * @param {Object[]} reservations
 * @param {string} granularity e.g. 'day' or 'hour' for checking
 * is day between reservation start and end. Default is 'day'.
 * @param {string} inclusivity e.g. '()' or '[]' for checking
 * is day between reservation start and end. Default is '()'.
 * @returns {boolean} is day booked
 */
export function reservationsModifier(day, reservations, granularity = 'day', inclusivity = '()') {
  if (day && reservations) {
    const dayMoment = moment(day);
    for (let index = 0; index < reservations.length; index += 1) {
      const reservation = reservations[index];
      const beginMoment = moment(reservation.begin);
      const endMoment = moment(reservation.end);
      if (dayMoment.isBetween(beginMoment, endMoment, granularity, inclusivity)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Modifier for DayPicker that checks if the next day is booked.
 * @param {Date} day
 * @param {Object[]} reservations
 * @returns {boolean} is next day booked
 */
export function nextDayBookedModifier(day, reservations) {
  if (day && reservations) {
    const firstBooked = findFirstClosestReservation(day, reservations);
    if (firstBooked && moment(day).isSame(firstBooked.begin, 'day')) {
      return true;
    }
  }

  return false;
}

/**
 * Modifier for DayPicker that checks if the previous day is booked.
 * @param {Date} day
 * @param {Object[]} reservations
 * @returns {boolean} is previous day booked
 */
export function prevDayBookedModifier(day, reservations) {
  if (day && reservations) {
    const firstBooked = findPrevFirstClosestReservation(day, reservations);
    if (firstBooked && moment(day).isSame(firstBooked.end, 'day')) {
      return true;
    }
  }

  return false;
}

/**
 * Returns closed days modifier for DayPicker
 * @param {Date} day
 * @param {Object[]} openingHours
 * @returns {boolean} is day closed
 */
export function closedDaysModifier(day, openingHours) {
  const closedDays = getClosedDays(openingHours);
  const momentDay = moment(day);
  for (let index = 0; index < closedDays.length; index += 1) {
    const closedDay = closedDays[index];
    if (momentDay.isSame(closedDay.date, 'day')) {
      return true;
    }
  }
  return false;
}

/**
 * Modifier for DayPicker that checks if the next day is closed.
 * @param {Date} day
 * @param {Object[]} openingHours
 * @returns {boolean} is next day closed
 */
export function nextDayClosedModifier(day, openingHours) {
  const closedDays = getClosedDays(openingHours);
  const firstClosed = findFirstClosedDay(day, closedDays);
  if (firstClosed && moment(day).add(1, 'day').isSame(firstClosed, 'day')) {
    return true;
  }
  return false;
}

/**
 * Modifier for DayPicker that checks if the previous day is closed.
 * @param {Date} day
 * @param {Object[]} openingHours
 * @returns {boolean} is previous day closed
 */
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

/**
 * Finds first closed day before fromDate.
 * @param {Date} fromDate
 * @param {Object[]} closedDays
 * @returns {string|null} first closed day's date string
 */
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
    reservation => moment(reservation.begin).isSameOrAfter(fromMoment, 'day'));
  const sortedReservations = [...futureReservations].sort(
    (a, b) => moment(a.begin).diff(fromMoment) - moment(b.begin).diff(fromMoment));
  return sortedReservations.length > 0 ? sortedReservations[0] : null;
}

/**
 * Finds first reservation before fromDate.
 * @param {Date} fromDate
 * @param {Object[]} reservations
 * @returns {Object|null} first reservation before fromDate or null if none found.
 */
export function findPrevFirstClosestReservation(fromDate, reservations) {
  const fromMoment = moment(fromDate);
  const pastReservations = reservations.filter(
    reservation => moment(reservation.end).isSameOrBefore(fromMoment, 'day'));
  const sortedReservations = [...pastReservations].sort(
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
 * Sets date and time to a moment object.
 * @param {Date} date
 * @param {string} time
 * @returns {Object} moment object
 */
export function setDatesTime(date, time) {
  const timeUnits = getHoursMinutesSeconds(time);
  const momentDate = moment(date);
  momentDate.set({
    hour: timeUnits.hours,
    minute: timeUnits.minutes,
    second: timeUnits.seconds
  });
  return momentDate;
}

/**
 * Combines date and time into a datetime string and returns it.
 * @param {Date} date
 * @param {string} time e.g. "12:00:00"
 * @param {function} t
 * @returns {string} datetime string e.g. "2018-02-01T12:00:00Z"
 * or empty string if date or time is missing
 */
export function getOvernightDatetime(date, time, t) {
  if (date && time) {
    const momentDate = setDatesTime(date, time);
    return formatDatetimeToString(momentDate, t);
  }
  return '';
}

/**
 * Gets hours, minutes and seconds from time string.
 * @param {string} time
 * @returns {Object} hours, minutes and seconds
 */
export function getHoursMinutesSeconds(time) {
  if (time) {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return { hours, minutes, seconds };
  }
  return { hours: 0, minutes: 0, seconds: 0 };
}

/**
 * Handles formatting selected date and time for reservation redux actions.
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {string} startTime
 * @param {string} endTime
 * @param {string} resourceId
 * @returns {Object} begin, end and resource
 */
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

/**
 * Gets correct URL to reservation page when making a new reservation
 * @param {Object} reservation
 * @param {string} resourceId
 * @returns {string} reservation URL
 */
export function getReservationUrl(reservation, resourceId) {
  return `/reservation?id=${reservation ? reservation.id : ''}&resource=${resourceId}`;
}

/**
 * Returns true if reservation is allowed
 * @param {Object} params
 * @param {boolean} params.isLoggedIn
 * @param {boolean} params.isStrongAuthSatisfied
 * @param {boolean} params.isMaintenanceModeOn
 * @param {Object} params.resource
 * @param {boolean} params.hasAdminBypass
 * @returns {boolean} true if reservation is allowed
 */
export function isReservingAllowed({
  isLoggedIn, isStrongAuthSatisfied, isMaintenanceModeOn, resource, hasAdminBypass
}) {
  if (isMaintenanceModeOn || !resource) {
    return false;
  }
  if (hasAdminBypass) {
    return true;
  }
  const { authentication, reservable } = resource;
  if (!reservable) {
    return false;
  }
  const authRequired = authentication !== 'unauthenticated';

  if (authRequired && (!isLoggedIn || !isStrongAuthSatisfied)) {
    return false;
  }

  return true;
}

/**
 * Returns correct general notification text e.g. user needs to login or maintenance mode is on
 * @param {Object} params
 * @param {boolean} params.isLoggedIn
 * @param {boolean} params.isStrongAuthSatisfied
 * @param {boolean} params.isMaintenanceModeOn
 * @param {Object} params.resource
 * @param {function} params.t
 * @returns {string} notification text
 */
export function getNotificationText({
  isLoggedIn, isStrongAuthSatisfied, isMaintenanceModeOn, resource, t
}) {
  if (isMaintenanceModeOn) {
    return t('Notifications.cannotReserveDuringMaintenance');
  }
  if (resource.reservable && !isStrongAuthSatisfied) {
    return t('Notifications.loginToReserveStrongAuth');
  }
  if (!isLoggedIn && resource.reservable) {
    return t('Notifications.loginToReserve');
  }
  return t('Notifications.noRightToReserve');
}

/**
 * Returns correct not selectable text
 * @param {boolean} isDateDisabled
 * @param {boolean} booked
 * @param {boolean} isNextBlocked
 * @param {function} t
 * @returns {string} not selectable text
 */
export function getNotSelectableNotificationText({
  isDateDisabled, booked, isNextBlocked, t
}) {
  if (!isDateDisabled && !booked && isNextBlocked) {
    return t('Notifications.overnight.notSelectableStart');
  }
  return t('Notifications.overnight.notSelectable');
}

/**
 * Removes the given reservation from reservations list
 * @param {number} reservationId
 * @param {Object[]} reservations
 * @returns {Object[]} filtered reservations
 */
export function filterSelectedReservation(reservationId, reservations) {
  return reservations.filter(reservation => reservation.id !== reservationId);
}

/**
 * Returns overnight selected dates' duration
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {string} overnightStartTime
 * @param {string} overnightEndTime
 * @returns {Object} moment duration
 */
export function getSelectedDuration(startDate, endDate, overnightStartTime, overnightEndTime) {
  const start = setDatesTime(startDate, overnightStartTime);
  const end = setDatesTime(endDate, overnightEndTime);
  return moment.duration(end.diff(start));
}

/**
 * Returns true if duration is below minPeriod
 * @param {Object} duration moment
 * @param {string} minPeriod
 * @returns {boolean} true if duration is below minPeriod
 */
export function isDurationBelowMin(duration, minPeriod) {
  return duration < moment.duration(minPeriod);
}

/**
 * Returns true if duration is over maxPeriod
 * @param {Object} duration moment
 * @param {string} maxPeriod
 * @returns {boolean} true if duration is over maxPeriod
 */
export function isDurationOverMax(duration, maxPeriod) {
  if (!maxPeriod) {
    return false;
  }
  return duration > moment.duration(maxPeriod);
}

/**
 * Returns true if dates are same as initial dates
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {Date} initialStart
 * @param {Date} initialEnd
 * @returns {boolean} true if dates are same as initial dates
 */
export function areDatesSameAsInitialDates(startDate, endDate, initialStart, initialEnd) {
  if (!startDate || !endDate || !initialStart || !initialEnd) {
    return false;
  }
  return moment(startDate).isSame(initialStart) && moment(endDate).isSame(initialEnd);
}

/**
 * Returns true if selection is continous i.e. does not contain disabled days
 * @param {Object} params
 * @param {Date} params.startDate
 * @param {Date} params.endDate
 * @param {Object[]} params.reservations
 * @param {Object[]} params.openingHours
 * @param {string} params.overnightStartTime
 * @param {string} params.overnightEndTime
 * @returns {boolean} true if selection is continous
 */
export function isSelectionContinous({
  startDate, endDate, reservations, openingHours,
  overnightStartTime, overnightEndTime
}) {
  const dates = createDateArray(startDate, endDate);
  if (dates.length < 2) {
    return true;
  }

  dates[0] = setDatesTime(dates[0], overnightStartTime).toDate();
  dates[dates.length - 1] = setDatesTime(dates[dates.length - 1], overnightEndTime).toDate();
  if (overnightStartTime === overnightEndTime) {
    dates[0].setMinutes(dates[0].getMinutes() + 1);
    dates[dates.length - 1].setMinutes(dates[dates.length - 1].getMinutes() - 1);
  }

  for (let index = 0; index < dates.length; index += 1) {
    const date = dates[index];
    const isFirstOrLast = index === 0 || index === dates.length - 1;
    const granularity = isFirstOrLast ? 'seconds' : 'days';
    if (reservationsModifier(date, reservations, granularity, '[]')
     || closedDaysModifier(date, openingHours)) {
      return false;
    }
  }
  return true;
}


/**
 * Creates array of dates between start and end Date
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Date[]} array of dates between start and end Date
 */
export function createDateArray(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateArray = [];

  while (start <= end) {
    dateArray.push(new Date(start));
    start.setDate(start.getDate() + 1);
  }

  return dateArray;
}
