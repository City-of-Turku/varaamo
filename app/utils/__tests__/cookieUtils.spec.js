import { cookieBotAddListener, cookieBotRemoveListener, cookieBotImageOverride } from '../cookieUtils';


describe('cookieUtils', () => {
  describe('cookieBotAddListener', () => {
    afterEach(() => {
      delete global.SETTINGS;
      jest.clearAllMocks();
    });
    test('calls addEventListener with correct params if SETTINGS.TRACKING', () => {
      global.SETTINGS = {
        TRACKING: true,
      };
      window.addEventListener = jest.fn();
      cookieBotAddListener();
      expect(window.addEventListener).toHaveBeenCalledWith('CookiebotOnDialogDisplay', cookieBotImageOverride);
    });
    test('does not call addEventListener if !SETTINGS.TRACKING', () => {
      global.SETTINGS = {
        TRACKING: false,
      };
      window.addEventListener = jest.fn();
      cookieBotAddListener();
      expect(window.addEventListener).not.toBeCalled();
    });
  });

  describe('cookiebotRemoveListener', () => {
    afterEach(() => {
      delete global.SETTINGS;
      jest.clearAllMocks();
    });
    test('calls removeEventListener with correct params if SETTINGS.TRACKING', () => {
      global.SETTINGS = {
        TRACKING: true,
      };
      window.removeEventListener = jest.fn();
      cookieBotRemoveListener();
      expect(window.removeEventListener).toHaveBeenCalledWith('CookiebotOnDialogDisplay', cookieBotImageOverride);
    });
    test('does not call removeEventListener if !SETTINGS.TRACKING', () => {
      global.SETTINGS = {
        TRACKING: false,
      };
      window.removeEventListener = jest.fn();
      cookieBotRemoveListener();
      expect(window.removeEventListener).not.toBeCalled();
    });
  });
});
