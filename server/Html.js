/* eslint-disable react/no-danger */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';

class Html extends Component {
  getInitialStateHtml(initialState) {
    return `window.INITIAL_STATE = ${serialize(initialState)};`;
  }

  renderAnalyticsCode(piwikSiteId) {
    if (!piwikSiteId) {
      return null;
    }
    const scriptString = `
      var _paq = _paq || [];
      _paq.push(['trackPageView']);
      _paq.push(['enableLinkTracking']);
      (function() {
        var u="//localhost/matomo/";
        _paq.push(['setTrackerUrl', u+'piwik.php']);
        _paq.push(['setSiteId', ${piwikSiteId}]);
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.type='text/javascript';
        g.async=true;
        g.defer=true;
        g.src=u+'piwik.js';
        s.parentNode.insertBefore(g,s);
      })();
    `;
    const imgSrc = `//localhost/matomo/piwik.php?idsite=${piwikSiteId}`;
    return (
      <div>
        <script dangerouslySetInnerHTML={{ __html: scriptString }} />
        <noscript>
          <p><img alt="" src={imgSrc} style={{ border: 0 }} /></p>
        </noscript>
      </div>
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
      piwikSiteId,
    } = this.props;
    const initialStateHtml = this.getInitialStateHtml(initialState);

    return (
      <html lang="fi">
        <head>
          <meta charSet="utf-8" />
          <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <meta content="Varaamo, Turku, Kirjasto, Pääkirjasto, Yliopisto, Palvelu, Pelitila, Soittohuone, Työpiste, 3D-tulostin, Stoori, Varauspalvelu, Kokoustila, Tulostus, Mikrofilmit, Musiikki, Askartelut" name="keywords" />
          <meta content="Varaamo – Tilat ja laitteet varattavana. Varaamosta voit varata julkisia tiloja ja laitteita omaan käyttöösi. Varaamo on Turun kaupungin varauspalvelu." name="description" />
          <meta content="Digipoint" name="author" />
          <link href="https://overpass-30e2.kxcdn.com/overpass.css" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,800" rel="stylesheet" />
          {this.renderStylesLink(appCssSrc, isProduction)}
          <title>Varaamo</title>
        </head>
        <body>
          <div id="root" />
          <script dangerouslySetInnerHTML={{ __html: initialStateHtml }} />
          <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en-gb,Intl.~locale.fi,Intl.~locale.sv" />
          <script src={appScriptSrc} />
          {this.renderAnalyticsCode(piwikSiteId)}
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
