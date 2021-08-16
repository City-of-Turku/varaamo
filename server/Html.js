/* eslint-disable react/no-danger */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';

class Html extends Component {
  getInitialStateHtml(initialState) {
    return `window.INITIAL_STATE = ${serialize(initialState)};`;
  }


  getCookieScript() {
    if (this.props.piwikSiteId) {
      const scriptString = `
      var _paq = _paq || [];
      _paq.push(['trackPageView']);
      _paq.push(['enableLinkTracking']);
      (function() {
        var u="https://testivaraamo.turku.fi:8003/";
        _paq.push(['setTrackerUrl', u+'piwik.php']);
        _paq.push(['setSiteId', ${this.props.piwikSiteId}]);
        _paq.push(['setVisitorCookieTimeout','7776000']);
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.type='text/javascript';
        g.async=true;
        g.defer=true;
        g.src=u+'matomo.js';
        s.parentNode.insertBefore(g,s);
      })();
    `;
      return (
        React.createElement(
          'script',
          { type: 'text/javascript' },
          scriptString,
        )
      );
    }
    return null;
  }

  getConsentScripts() {
    return (
      // eslint-disable-next-line react/self-closing-comp
      <script
        data-blockingmode="auto"
        data-cbid="92860cd1-d931-4496-8621-2adb011dafb0"
        id="Cookiebot"
        src="https://consent.cookiebot.com/uc.js"
        type="text/javascript"
      >
      </script>
    );
  }

  renderStylesLink(appCssSrc, isProduction) {
    if (!isProduction) {
      return null;
    }

    return <link href={appCssSrc} rel="stylesheet" />;
  }

  render() {
    const {
      appCssSrc,
      appScriptSrc,
      initialState,
      isProduction,
    } = this.props;
    const initialStateHtml = this.getInitialStateHtml(initialState);

    let ogImage;
    if (process.env.OG_IMG_URL) {
      ogImage = process.env.OG_IMG_URL;
    } else {
      ogImage = isProduction
        ? 'https://varaamo.turku.fi/static/images/aurajoki.jpg'
        : 'https://testivaraamo.turku.fi/static/images/aurajoki.jpg';
    }

    return (
      <html lang="fi">
        <head>
          <meta charSet="utf-8" />
          <meta content="37B6C7A87B582B25B0C1C938BD8AD440" name="msvalidate.01" />
          <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <meta content="Varaamo, Turku, Kirjasto, Pääkirjasto, Yliopisto, Palvelu, Pelitila, Soittohuone, Työpiste, 3D-tulostin, Stoori, Varauspalvelu, Kokoustila, Tulostus, Mikrofilmit, Musiikki, Askartelut" name="keywords" />
          <meta content="Turun kaupungin Varaamo-palvelusta voit varata tiloja, laitteita ja palveluita, kun haluat pitää kokouksen, pelata pelejä, harrastaa tai tavata asiantuntijan." name="description" />
          <meta content="Digipoint" name="author" />
          <meta content="x4GUwZEJru1x6OpgxdEMMfLatFyGx5lmxlbD0AMqtbw" name="google-site-verification" />
          <meta content={ogImage} property="og:image" />
          <meta content="image/jpeg" property="og:image:type" />
          <meta content="1200" property="og:image:width" />
          <meta content="630" property="og:image:height" />
          <meta content="website" property="og:type" />
          <meta content="Varaamo" property="og:title" />
          <meta content="Turun kaupungin Varaamo-palvelusta voit varata tiloja, laitteita ja palveluita, kun haluat pitää kokouksen, pelata pelejä, harrastaa tai tavata asiantuntijan." property="og:description" />
          <link href="https://overpass-30e2.kxcdn.com/overpass.css" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,800" rel="stylesheet" />
          {this.getConsentScripts()}
          {this.getCookieScript()}
          {this.renderStylesLink(appCssSrc, isProduction)}
          <title>Varaamo</title>
        </head>
        <body>
          <div id="root" />
          <script dangerouslySetInnerHTML={{ __html: initialStateHtml }} />
          <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en-gb,Intl.~locale.fi,Intl.~locale.sv" />
          <script src={appScriptSrc} />
        </body>
      </html>
    );
  }
}

Html.propTypes = {
  appCssSrc: PropTypes.string.isRequired,
  appScriptSrc: PropTypes.string.isRequired,
  initialState: PropTypes.object.isRequired,
  isProduction: PropTypes.bool.isRequired,
  piwikSiteId: PropTypes.string,
};

export default Html;
