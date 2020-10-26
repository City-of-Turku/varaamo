import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import Grid from 'react-bootstrap/lib/Grid';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import CookieBar from 'shared/cookiebar/CookieBar';
import { fetchUser } from 'actions/userActions';
import Favicon from 'shared/favicon';
import Footer from 'shared/footer';
import Header from 'shared/header';
import SkipLink from 'shared/skip-link';
import TestSiteMessage from 'shared/test-site-message';
import Notifications from 'shared/notifications';
import { getCustomizationClassName } from 'utils/customizationUtils';
import { currentLanguageSelector } from 'state/selectors/translationSelectors';

const userSelector = state => state.auth.user;
const fontSizeSelector = state => state.ui.accessibility.fontSize;

export const selector = createStructuredSelector({
  user: userSelector,
  fontSize: fontSizeSelector,
  currentLanguage: currentLanguageSelector,
});

export class UnconnectedAppContainer extends Component {
  constructor(props) {
    super(props);
    this.checkCookie();
  }

  componentDidMount() {
    this.removeFacebookAppendedHash();
  }

  componentWillUpdate(nextProps) {
    if (nextProps.user && nextProps.user !== this.props.user) {
      this.props.fetchUser(nextProps.user.profile.sub);
    }
  }

  removeFacebookAppendedHash() {
    if (window.location.hash && window.location.hash.indexOf('_=_') !== -1) {
      window.location.hash = ''; // for older browsers, leaves a # behind
      window.history.pushState('', document.title, window.location.pathname);
    }
  }

  checkCookie() {
    if (SETTINGS.TRACKING) {
      if (document.cookie.split('; ').find(row => row.startsWith('CookieConsent'))) {
        const consentValue = document.cookie.split('; ').find(row => row.startsWith('CookieConsent')).split('=')[1];
        if (consentValue === 'true') {
          this.addCookie();
        }
      }
    }
    return false;
  }

  addCookie() {
    if (SETTINGS.TRACKING) {
      const cookieScript = document.createElement('script');
      cookieScript.type = 'text/javascript';
      const content = document.createTextNode(this.renderAnalyticsCode(SETTINGS.TRACKING_ID));
      cookieScript.append(content);
      document.getElementsByTagName('head')[0].appendChild(cookieScript);
    }
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
    return scriptString;
  }


  render() {
    const { fontSize } = this.props;
    return (
      <div className={classNames('app', getCustomizationClassName(), (fontSize))}>
        <SkipLink />

        <Helmet htmlAttributes={{ lang: this.props.currentLanguage }} title="Varaamo" />

        <Header location={this.props.location}>
          <Favicon />
          <TestSiteMessage />
        </Header>
        <main className={classNames('app-content')} id="main-content" tabIndex="-1">
          <Grid>
            <Notifications />
          </Grid>
          {this.props.children}
        </main>
        <Footer />
        <CookieBar onAcceptFunc={() => this.addCookie()} />
      </div>
    );
  }
}

UnconnectedAppContainer.propTypes = {
  children: PropTypes.node,
  fetchUser: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  user: PropTypes.object,
  fontSize: PropTypes.string,
  currentLanguage: PropTypes.string,
};

const actions = { fetchUser };

export default withRouter(
  connect(
    selector,
    actions
  )(UnconnectedAppContainer)
);
