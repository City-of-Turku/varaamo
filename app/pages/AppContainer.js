import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import Grid from 'react-bootstrap/lib/Grid';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { fetchUser } from 'actions/userActions';
import Favicon from 'shared/favicon';
import Footer from 'shared/footer';
import Header from 'shared/header';
import SkipLink from 'shared/skip-link';
import TestSiteMessage from 'shared/test-site-message';
import Notifications from 'shared/notifications';
import { getCustomizationClassName } from 'utils/customizationUtils';
import { currentLanguageSelector } from 'state/selectors/translationSelectors';
import { contrastSelector } from 'state/selectors/accessibilitySelectors';
import { cookieBotAddListener, cookieBotRemoveListener } from '../utils/cookieUtils';
import ServiceAnnouncement from '../shared/service-announcement/ServiceAnnouncement';

const userSelector = state => state.auth.user;
const fontSizeSelector = state => state.ui.accessibility.fontSize;

export const selector = createStructuredSelector({
  user: userSelector,
  fontSize: fontSizeSelector,
  currentLanguage: currentLanguageSelector,
  contrast: contrastSelector,
});

export class UnconnectedAppContainer extends Component {
  componentDidMount() {
    this.removeFacebookAppendedHash();
    cookieBotAddListener();
  }

  componentWillUpdate(nextProps) {
    if (nextProps.user && nextProps.user !== this.props.user) {
      this.props.fetchUser(nextProps.user.profile.sub);
    }
  }

  componentWillUnmount() {
    cookieBotRemoveListener();
  }

  removeFacebookAppendedHash() {
    if (window.location.hash && window.location.hash.indexOf('_=_') !== -1) {
      window.location.hash = ''; // for older browsers, leaves a # behind
      window.history.pushState('', document.title, window.location.pathname);
    }
  }

  render() {
    const { contrast, currentLanguage, fontSize } = this.props;
    return (
      <div className={classNames('app', getCustomizationClassName(), (fontSize))}>
        <SkipLink />

        <Helmet htmlAttributes={{ lang: this.props.currentLanguage }} title="Varaamo" />

        <Header location={this.props.location}>
          <Favicon />
          <TestSiteMessage />
          <ServiceAnnouncement contrast={contrast} currentLanguage={currentLanguage} />
        </Header>
        <main className={classNames('app-content')} id="main-content" tabIndex="-1">
          <Grid>
            <Notifications />
          </Grid>
          {this.props.children}
        </main>
        <Footer />
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
  contrast: PropTypes.string.isRequired
};

const actions = { fetchUser };

export default withRouter(
  connect(
    selector,
    actions
  )(UnconnectedAppContainer)
);
