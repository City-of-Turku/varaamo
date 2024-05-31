import moment from 'moment';

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
 * Gets reservation begin and end datetimes
 * @param {string} beginDayTime DTHH:mm:ssZ
 * @param {string} endDayTime DTHH:mm:ssZ
 * @returns {Object} object with begin and end datetime
 */
export function getReservationBeginEnd(beginDayTime, endDayTime) {
  const currentYear = moment().year();
  const currentMonth = moment().month();

  let beginDate = moment(`${currentYear}-${currentMonth + 1}-${beginDayTime}`, 'YYYY-M-DTHH:mm:ssZ');
  let endDate = moment(`${currentYear}-${currentMonth + 1}-${endDayTime}`, 'YYYY-M-DTHH:mm:ssZ');

  beginDate = beginDate.add(1, 'months');
  endDate = endDate.add(1, 'months');

  const begin = beginDate.format();
  const end = endDate.format();
  return { begin, end };
}

/**
 * Gets closed date with null opens and closes
 * @param {string} day e.g. '15'
 * @returns {Object} object with date, opens: null and closes: null
 */
export function getClosedDate(day) {
  const currentYear = moment().year();
  const currentMonth = moment().month();

  const date = moment(`${currentYear}-${currentMonth + 1}-${day}`, 'YYYY-M-D');
  date.add(1, 'months');
  return { date: date.format(), opens: null, closes: null };
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

/**
 * Forces given user to login
 * @param {Object} userData user data fixture
 * @param {Object} userOidc user oidc fixture
 */
export function forceUserLogin(userData, userOidc) {
  // force user login data
  cy.window().then((win) => {
    const { uuid } = userData;
    // eslint-disable-next-line no-param-reassign
    win.INITIAL_STATE = {
      data: {
        users: {
          [uuid]: userData
        }
      }
    };
  });
  cy.window().its('store').invoke('dispatch', {
    type: 'redux-oidc/USER_FOUND',
    payload: userOidc
  });
}
