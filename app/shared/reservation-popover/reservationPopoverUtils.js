import moment from 'moment';

/**
 * Checks if given duration is within given min and max period limits.
 * @param {object} duration moment duration obj
 * @param {string} minPeriod - format HH:mm:ss, e.g. '08:00:00' or '00:30:00'
 * @param {string} maxPeriod - format HH:mm:ss, e.g. '08:00:00' or '00:30:00'
 * @returns {boolean} true if duration is within limits, false otherwise.
 */
export function isDurationWithinLimits(duration, minPeriod, maxPeriod) {
  if (!duration) return true;

  const durMinutes = duration.asMinutes();
  const timeFormat = 'HH:mm:ss';

  if (minPeriod && maxPeriod) {
    return durMinutes >= moment.duration(minPeriod, timeFormat).asMinutes()
     && durMinutes <= moment.duration(maxPeriod, timeFormat).asMinutes();
  }
  if (minPeriod) {
    return (durMinutes >= moment.duration(minPeriod, timeFormat).asMinutes());
  }
  if (maxPeriod) {
    return (durMinutes <= moment.duration(maxPeriod, timeFormat).asMinutes());
  }
  return true;
}
