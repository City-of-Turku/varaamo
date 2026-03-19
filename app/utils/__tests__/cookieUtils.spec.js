import constants from 'constants/AppConstants';
import { cookieBotAddListener, cookieBotRemoveListener, cookieBotImageOverride } from '../cookieUtils';

describe('cookieUtils', () => {
  describe('cookieBotAddListener', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('calls addEventListener with correct params if constants.TRACKING', () => {
      constants.TRACKING = true;
      window.addEventListener = jest.fn();
      cookieBotAddListener();
      expect(window.addEventListener).toHaveBeenCalledWith('CookiebotOnDialogDisplay', cookieBotImageOverride);
    });
    test('does not call addEventListener if !constants.TRACKING', () => {
      constants.TRACKING = false;
      window.addEventListener = jest.fn();
      cookieBotAddListener();
      expect(window.addEventListener).not.toBeCalled();
    });
  });

  describe('cookiebotRemoveListener', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('calls removeEventListener with correct params if constants.TRACKING', () => {
      constants.TRACKING = true;
      window.removeEventListener = jest.fn();
      cookieBotRemoveListener();
      expect(window.removeEventListener).toHaveBeenCalledWith('CookiebotOnDialogDisplay', cookieBotImageOverride);
    });
    test('does not call removeEventListener if !constants.TRACKING', () => {
      constants.TRACKING = false;
      window.removeEventListener = jest.fn();
      cookieBotRemoveListener();
      expect(window.removeEventListener).not.toBeCalled();
    });
  });
});
