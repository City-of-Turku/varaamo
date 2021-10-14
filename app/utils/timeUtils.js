import constants from 'constants/AppConstants';
import { DEFAULT_SLOT_SIZE } from 'constants/SlotConstants';

import forEach from 'lodash/forEach';
import map from 'lodash/map';
import Moment from 'moment';
import { extendMoment } from 'moment-range';


const moment = extendMoment(Moment);

function addToDate(date, daysToIncrement) {
  const newDate = moment(date).add(daysToIncrement, 'days');

  return newDate.format(constants.DATE_FORMAT);
}

function getDateStartAndEndTimes(date, useTimeRange, startTime, endTime, duration) {
  if (!date) {
    return {};
  }
  const start = `${date}T00:00:00Z`;
  const end = `${date}T23:59:59Z`;
  if (useTimeRange && endTime && startTime) {
    const timeZone = moment().format('Z');
    const availableStart = `${date}T${startTime}:00${timeZone}`;
    const availableEnd = `${date}T${endTime}:00${timeZone}`;
    const availableBetween = `${availableStart},${availableEnd},${duration}`;
    return { availableBetween, end, start };
  }
  return { end, start };
}

function getDateString(date) {
  if (!date) {
    return moment().format(constants.DATE_FORMAT);
  }

  return date;
}

function getDuration(duration) {
  if (!duration) {
    return moment(constants.FILTER.timePeriod, constants.FILTER.timePeriodType).minutes();
  }
  return duration;
}

function getDurationHours(duration) {
  const value = duration || constants.FILTER.timePeriod;
  return value / 60;
}

function calculateDuration(duration, start, end) {
  const { timeFormat, timePeriodType } = constants.FILTER;
  const startTime = moment(start, timeFormat);
  const endTime = moment(end, timeFormat);
  const diffMinutes = endTime.diff(startTime, timePeriodType);
  return Math.min(duration, diffMinutes);
}

function getEndTimeString(endTime) {
  if (!endTime) {
    return '23:30';
  }
  return endTime;
}

function calculateEndTime(end, start) {
  const { timeFormat, timePeriod, timePeriodType } = constants.FILTER;
  const startTime = moment(start, timeFormat);
  const endTime = moment(end, timeFormat);
  if (startTime.isSameOrAfter(endTime)) {
    return startTime.add(timePeriod, timePeriodType).format(timeFormat);
  }
  return end;
}

function getStartTimeString(startTime) {
  if (!startTime) {
    const now = moment();
    const nextPeriod = moment()
      .startOf('hour')
      .add(constants.FILTER.timePeriod, constants.FILTER.timePeriodType);
    while (nextPeriod.isBefore(now)) {
      nextPeriod.add(constants.FILTER.timePeriod, constants.FILTER.timePeriodType);
    }
    return nextPeriod.format(constants.FILTER.timeFormat);
  }
  return startTime;
}

function getTimeSlots(
  start, end,
  period = DEFAULT_SLOT_SIZE,
  reservations = [],
  reservationsToEdit = [],
  cooldown = 0
) {
  if (!start || !end) {
    return [];
  }

  const range = moment.range(moment(start), moment(end));
  const duration = moment.duration(period);

  const reservationRanges = map(
    reservations, reservation => moment.range(
      moment(reservation.begin), moment(reservation.end)
    )
  );

  /*
    reservation cooldown range is calculated in the following way:
    cooldown range = from (begin time - cooldown) to (end time + cooldown)
  */
  const cooldownRanges = map(reservations, reservation => moment.range(
    moment(reservation.begin).subtract(moment.duration(cooldown)),
    moment(reservation.end).add(moment.duration(cooldown))
  ));

  const editRanges = map(
    reservationsToEdit, reservation => moment.range(
      moment(reservation.begin), moment(reservation.end),
    )
  );

  const slots = map(
    Array.from(
      range.by(constants.FILTER.timePeriodType, {
        excludeEnd: true,
        step: duration.as(constants.FILTER.timePeriodType),
      })
    ),
    (startMoment) => {
      const endMoment = moment(startMoment).add(duration);
      const asISOString = `${startMoment.toISOString()}/${endMoment.toISOString()}`;
      const asString = `${startMoment.format(constants.TIME_FORMAT)}\u2013${endMoment.format(
        constants.TIME_FORMAT
      )}`;

      const slotRange = moment.range(startMoment, endMoment);
      const editing = editRanges.some(editRange => editRange.overlaps(slotRange));

      let reserved = false;
      let reservation = [];
      let reservationStarting = false;
      let reservationEnding = false;
      forEach(reservationRanges, (reservationRange, index) => {
        if (reservationRange.overlaps(slotRange)) {
          reserved = true;
          reservation = reservations[index];
          const [reservationStart, reservationEnd] = reservationRange.toDate();
          const [slotStart, slotEnd] = slotRange.toDate();
          reservationStarting = reservationStart.getTime() === slotStart.getTime();
          reservationEnding = reservationEnd.getTime() === slotEnd.getTime();
        }
      });

      /*
        slot is on cooldown if it's within cooldown range of a reservation,
        slot is not on cooldown if it's set as reserved.
        When a slot is within cooldown range of a reservation it gets added to the slot,
        if slot is within cooldown range of two reservations both are added.
        The cooldown slots get a reservation but are NOT set as reserved.

        When editing a reservation,
        the cooldown slots that ONLY have the users reservation are false.
        If a cooldown slots reservation is NOT
        the users or its shared with another reservation it remains true.
      */
      const isEditing = Boolean(reservationsToEdit.length);
      let onCooldown = false;
      forEach(cooldownRanges, (cooldownRange, index) => {
        if (!reserved && cooldownRange.overlaps(slotRange)) {
          reservation.push(reservations[index]);

          if (isEditing) {
            if (reservation.some(res => !res.isOwn)) {
              onCooldown = true;
            } else {
              onCooldown = false;
            }
          } else {
            onCooldown = true;
          }
        }
      });


      return {
        asISOString,
        asString,
        editing,
        reservation,
        reservationStarting,
        reservationEnding,
        reserved,
        start: startMoment.toISOString(),
        end: endMoment.toISOString(),
        onCooldown,
      };
    }
  );

  return slots;
}

function isPastDate(date) {
  const now = moment();
  return moment(date).isBefore(now, 'day');
}

/**
 * Tells whether date string is formatted correctly or not.
 * Expects string to be 8-10 characters long and written in the following format:
 * DD.MM.YYYY, where days and months can also be written with only one number.
 *
 * @param {string} dateString
 */
function isValidDateString(dateString) {
  if (dateString.length < 8 || dateString.length > 10) {
    return false;
  }

  // eslint-disable-next-line
  const regex = /\d{1,2}[.]\d{1,2}[.]\d{4}/;
  if (regex.test(dateString) && moment(dateString, 'L').isValid()) {
    return true;
  }

  return false;
}

/**
 * Formats given period into hours and/or minutes
 * @param {string} period e.g. 1:30:00
 * @returns {string} e.g. '1h 30min', '2h' or '45min'
 */
function getPrettifiedPeriodUnits(period) {
  const duration = moment.duration(period);
  const hours = duration.hours();
  const minutes = duration.minutes();

  const hoursText = hours > 0 ? `${hours}h` : '';
  const minutesText = minutes > 0 ? `${minutes}min` : '';
  const spacer = hoursText && minutesText ? ' ' : '';

  return `${hoursText}${spacer}${minutesText}`;
}

function prettifyHours(hours, showMinutes = false) {
  if (showMinutes && hours < 0.5) {
    const minutes = moment.duration(hours, 'hours').minutes();
    return `${minutes} min`;
  }

  const rounded = Math.ceil(hours * 2) / 2;
  return `${rounded} h`;
}

function padLeft(number) {
  return number < 10 ? `0${number}` : String(number);
}
/**
 * Convert time period to minutes;
 *
 * @param {string} period Time string, usually HH:MM:SS
 * @returns {Int} Period in minutes
 */
function periodToMinute(period) {
  return moment.duration(period).asMinutes();
}

/**
 * Get end time slot with minPeriod time range.
 * For example: start slot at 2AM, minPeriod = 1h, expected result 3AM
 *
 * @param {object} startSlot
 * @param {string} slotSize
 * @param {string} minPeriod
 * @return {object} endSlot
 */
function getEndTimeSlotWithMinPeriod(startSlot, minPeriod, slotSize) {
  const minPeriodInMinutes = periodToMinute(minPeriod) - periodToMinute(slotSize);
  // minPeriod always >= slotSize
  // minus 1 timeSlot here so the timediff between start slot and end slot is equal with minPeriod.

  return {
    resource: startSlot.resource,
    begin: moment(startSlot.begin).add(minPeriodInMinutes, 'minutes').toISOString(),
    end: moment(startSlot.end).add(minPeriodInMinutes, 'minutes').toISOString()
  };
}

/**
 * Get time different
 * This function can be use to compare time
 * @param {string} startTime ISO Time String
 * @param {string} endTime ISO Time String
 * @returns {int} timediff
 */
function getTimeDiff(startTime, endTime, unit) {
  return moment(startTime).diff(moment(endTime), unit);
}

export {
  addToDate,
  calculateDuration,
  calculateEndTime,
  getDateStartAndEndTimes,
  getDateString,
  getDuration,
  getDurationHours,
  getEndTimeString,
  getPrettifiedPeriodUnits,
  getStartTimeString,
  getTimeSlots,
  isPastDate,
  isValidDateString,
  prettifyHours,
  padLeft,
  periodToMinute,
  getEndTimeSlotWithMinPeriod,
  getTimeDiff
};
