/**
  * Checks if cookie with the name 'CookieConsent' exists.
  * If it exists and its value is 'true' -> this.addCookie() is called.
   * @example
   * const consentValue = document.cookie.split('; ')
   * .find(row => row.startsWith('CookieConsent')).split('=')[1];
   * if (consentValue === 'true') { this.addCookie(); }
  */
function checkCookieConsent() {
  if (SETTINGS.TRACKING) {
    if (document.cookie.split('; ').find(row => row.startsWith('CookieConsent'))) {
      const consentValue = document.cookie.split('; ').find(row => row.startsWith('CookieConsent')).split('=')[1];
      if (consentValue === 'true') {
        addCookieScript();
      }
    }
  }
}
/**
  * Creates new script element with content from this.renderAnalyticsCode.
  * The element is then appended to <head>.
  */
function addCookieScript() {
  if (SETTINGS.TRACKING) {
    const cookieScript = document.createElement('script');
    cookieScript.type = 'text/javascript';
    const content = document.createTextNode(
      renderAnalyticsCode(SETTINGS.TRACKING_ID)
    );
    cookieScript.append(content);
    document.getElementsByTagName('head')[0].appendChild(cookieScript);
  }
}
/**
   * Returns script string with siteId according to param
   * @param piwikSiteId
   * @returns {string|null}
   */
function renderAnalyticsCode(piwikSiteId) {
  const scriptString = `
      var _paq = _paq || [];
      _paq.push(['trackPageView']);
      _paq.push(['enableLinkTracking']);
      (function() {
        var u="https://testivaraamo.turku.fi:8003/";
        _paq.push(['setTrackerUrl', u+'piwik.php']);
        _paq.push(['setSiteId', ${piwikSiteId}]);
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.type='text/javascript';
        g.async=true;
        g.defer=true;
        g.src=u+'matomo.js';
        s.parentNode.insertBefore(g,s);
      })();
    `;
  return piwikSiteId ? scriptString : null;
}


export { checkCookieConsent, addCookieScript, renderAnalyticsCode };
