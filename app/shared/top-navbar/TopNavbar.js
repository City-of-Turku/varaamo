import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import Button from 'react-bootstrap/lib/Button';
import NavItem from 'react-bootstrap/lib/NavItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWheelchair, faUserAlt
} from '@fortawesome/free-solid-svg-icons';

import MobileNavbar from 'shared/top-navbar/mobile/MobileNavbar';
import FontChanger from './accessibility/TopNavbarFontContainer';
import ContrastChanger from './accessibility/TopNavbarContrastContainer';
import { injectT } from 'i18n';
import userManager from 'utils/userManager';
import LanguageDropdown from './language-dropdown/LanguageDropdown';
import LogoutControls from './login-logout-controls/LogoutControls';
import LoginControls from './login-logout-controls/LoginControls';

class TopNavbar extends Component {
  static propTypes = {
    addNotification: PropTypes.func.isRequired,
    changeLocale: PropTypes.func.isRequired,
    currentLanguage: PropTypes.string.isRequired,
    idToken: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    userName: PropTypes.string.isRequired,
    contrast: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      expandMobileNavbar: false,
    };

    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.toggleMobileNavbar = this.toggleMobileNavbar.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
  }

  componentDidUpdate(prevState) {
    if (!prevState.expandMobileNavbar && this.state.expandMobileNavbar) {
      document.getElementById('mobile-contrastButton').focus();
    }
  }

  collapseItem() {
    this.setState({ expanded: false });
  }

  toggleCollapse() {
    this.setState(prevState => ({ expanded: !prevState.expanded }));
  }

  handleLogoutClick() {
    // passing id token hint skips logout confirm on tunnistamo's side
    userManager.signoutRedirect({ id_token_hint: this.props.idToken });
    userManager.removeUser();
  }

  handleLanguageChange(lang, e) {
    this.props.changeLocale(lang, e);
    e.preventDefault();
  }

  async handleLoginClick() {
    try {
      await userManager.signinRedirect({
        data: {
          redirectUrl: window.location.pathname
        },
        extraQueryParams: {
          ui_locales: this.props.currentLanguage
        },
      });
    } catch (error) {
      this.props.addNotification({
        message: this.props.t('Notifications.loginErrorMessage'),
        type: 'error',
        timeOut: 10000,
      });
    }
  }

  toggleMobileNavbar() {
    this.setState(prevState => ({ expandMobileNavbar: !prevState.expandMobileNavbar }));
  }

  render() {
    const {
      changeLocale,
      currentLanguage,
      isLoggedIn,
      t,
      userName,
      contrast,
    } = this.props;
    const currentLogo = (currentLanguage === 'sv') ? 'varaamo-logo-sv' : 'varaamo-logo';
    return (
      <div>
        <MobileNavbar contrast={contrast} toggle={this.state.expandMobileNavbar} />
        <Navbar className={classNames('app-TopNavbar', contrast)} expanded={this.state.expanded} onToggle={() => this.toggleCollapse()}>

          <Navbar.Header>
            <Navbar.Brand>
              <Link aria-label={t('Navbar.aria.topNavbar.frontpage')} id="main" to="/">
                <span aria-label="Vaakuna" className={currentLogo} title="Etusivu" />
              </Link>
            </Navbar.Brand>
            <div className="mobile-buttons">
              <button className="navbar-toggle lang" data-target="#mobile" data-toggle="collapse" tabIndex="-1" type="button">
                <div aria-label={t('Navbar.aria.topNavbar.mobileLocale')} className="mobile_lang" role="list" type="button">
                  <LanguageDropdown
                    changeLocale={changeLocale}
                    classNameOptional="mobile_lang_dropdown"
                    currentLanguage={currentLanguage}
                    handleLanguageChange={this.handleLanguageChange}
                    id="mobileLang"
                  />
                </div>
              </button>
              <button
                aria-controls="mobileNavbar"
                aria-label={t('Navbar.aria.topNavbar.mobileAccessibility')}
                className="navbar-toggle"
                onClick={this.toggleMobileNavbar}
                type="button"
              >
                <div
                  className="mobile_accessibility"
                >
                  <FontAwesomeIcon icon={faWheelchair} />
                </div>
              </button>

              <Navbar.Toggle aria-label={t('Navbar.aria.topNavbar.mobileLogin')} data-target="#navCollapse">
                <div className="mobile_login">
                  <FontAwesomeIcon icon={faUserAlt} />
                </div>
              </Navbar.Toggle>
            </div>
          </Navbar.Header>
          <Navbar.Collapse id="navCollapse">
            <Nav pullRight role="list">
              <ContrastChanger idPrefix="desktop" />

              <FontChanger />
              <LanguageDropdown
                changeLocale={changeLocale}
                currentLanguage={currentLanguage}
                handleLanguageChange={this.handleLanguageChange}
                id="desktopLang"
              />

              {isLoggedIn && (
                <LogoutControls handleLogoutClick={this.handleLogoutClick} userName={userName} />
              )}


              {!isLoggedIn && (
                <LoginControls handleLoginClick={this.handleLoginClick} />
              )}

              {isLoggedIn && (
                <Fragment>
                  <li className="app-TopNavbar__mobile username">
                    <Navbar.Text>{userName}</Navbar.Text>
                  </li>
                  <NavItem className="app-TopNavbar__mobile logout" id="mobile_logout">
                    <Button onClick={this.handleLogoutClick} type="button">
                      {t('Navbar.logout')}
                    </Button>

                  </NavItem>
                </Fragment>
              )

              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default injectT(TopNavbar);
