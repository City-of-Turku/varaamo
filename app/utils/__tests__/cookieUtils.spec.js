import { checkCookieConsent, addCookieScript, renderAnalyticsCode } from '../cookieUtils';

describe('cookieUtils', () => {
  Object.defineProperty(global, 'SETTINGS', {
    writable: true,
    value: {
      TRACKING: true,
      TRACKING_ID: '1',
    }
  });
  Object.defineProperty(document, 'cookie', {
    writable: true,
    value: 'CookieConsent=true'
  });
  afterEach(() => {
    document.head.innerHTML = '';
  });
  describe('checkCookieConsent', () => {
    test('script is set if SETTINGS.TRACKING is true and CookieConsent=true', () => {
      // <head> shouldn't have any children at this point
      let scriptElement = document.getElementsByTagName('head').item(0).firstElementChild;
      expect(scriptElement).toBe(null);
      checkCookieConsent();
      // <head> should now have a child, the <script> element
      scriptElement = document.getElementsByTagName('head').item(0).firstElementChild;
      const scriptElementAttributes = scriptElement.getAttributeNames();
      const values = ['', 'https://testivaraamo.turku.fi:8003/matomo.js', 'text/javascript'];

      scriptElementAttributes.forEach(attr => (
        expect(values).toContain(scriptElement.getAttribute(attr))
      ));
    });
  });
  describe('addCookieScript', () => {
    test('adds script element to head', () => {
      // <head> shouldn't have any children at this point
      let scriptElement = document.getElementsByTagName('head').item(0).firstElementChild;
      expect(scriptElement).toBe(null);
      addCookieScript();
      // <head> should now have a child, the <script> element
      scriptElement = document.getElementsByTagName('head').item(0).firstElementChild;
      const scriptElementAttributes = scriptElement.getAttributeNames();
      const values = ['', 'https://testivaraamo.turku.fi:8003/matomo.js', 'text/javascript'];

      scriptElementAttributes.forEach(attr => (
        expect(values).toContain(scriptElement.getAttribute(attr))
      ));
    });
  });
  describe('renderAnalyticsCode', () => {
    test('returns scriptString with SiteId according to given param', () => {
      let value = renderAnalyticsCode(2);
      expect(value).toContain('\'setSiteId\', 2');
      value = renderAnalyticsCode(4);
      expect(value).toContain('\'setSiteId\', 4');
      value = renderAnalyticsCode(6);
      expect(value).toContain('\'setSiteId\', 6');
    });
  });
});
