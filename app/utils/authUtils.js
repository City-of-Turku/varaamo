import moment from 'moment';

import userManager from 'utils/userManager';

/**
 * Silently refreshes login if current login is old enough
 * @param {bool} isLoggedIn
 * @param {number} loginExpiresAt unix timestamp when current login will expire
 * @param {number} minMinutesLeft refresh sign in when current login has less than this
 * amount of minutes left
 */
export function handleSigninRefresh(isLoggedIn, loginExpiresAt, minMinutesLeft = 20) {
  // dont handle if user is not currently logged in
  if (isLoggedIn && loginExpiresAt) {
    const expiresAt = moment.unix(loginExpiresAt);
    const minutesLeft = expiresAt.diff(moment(), 'minutes');
    if (minutesLeft < minMinutesLeft) {
      userManager.signinSilent();
    }
  }
}
