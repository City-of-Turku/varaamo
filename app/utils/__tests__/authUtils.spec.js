import moment from 'moment';
import simple from 'simple-mock';

import userManager from 'utils/userManager';
import { handleSigninRefresh } from '../authUtils';

describe('Utils: authUtils', () => {
  describe('handleSigninRefresh', () => {
    const signinSilentMock = simple.mock();

    beforeEach(() => {
      signinSilentMock.reset();
      simple.mock(userManager, 'signinSilent', signinSilentMock);
    });

    describe('when isLoggedIn and loginExpiresAt are defined', () => {
      test('calls userManager.signinSilent when minutesLeft < minMinutesLeft', () => {
        const isLoggedIn = true;
        const minMinutesLeft = 15;
        const loginExpiresAt = moment().add(10, 'minutes').unix();
        handleSigninRefresh(isLoggedIn, loginExpiresAt, minMinutesLeft);
        expect(signinSilentMock.callCount).toBe(1);
      });

      test('does not call userManager.signinSilent when minutesLeft > minMinutesLeft', () => {
        const isLoggedIn = true;
        const minMinutesLeft = 15;
        const loginExpiresAt = moment().add(30, 'minutes').unix();
        handleSigninRefresh(isLoggedIn, loginExpiresAt, minMinutesLeft);
        expect(signinSilentMock.callCount).toBe(0);
      });
    });


    test('does not call userManager.signinSilent if isLoggedIn or loginExpiresAt is undefined', () => {
      const isLoggedIn = false;
      const loginExpiresAt = 1612788418;
      handleSigninRefresh(isLoggedIn, loginExpiresAt);
      expect(signinSilentMock.callCount).toBe(0);
    });
  });
});
