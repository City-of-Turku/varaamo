import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import Button from 'react-bootstrap/lib/Button';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import NavItem from 'react-bootstrap/lib/NavItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWheelchair, faUserAlt
} from '@fortawesome/free-solid-svg-icons';

import MobileNavbar from 'shared/top-navbar/mobile/MobileNavbar';
import FontChanger from './accessibility/TopNavbarFontContainer';
import ContrastChanger from './accessibility/TopNavbarContrastContainer';
import { injectT } from 'i18n';
import LoginForm from './temp/LoginForm';

class TopNavbar extends Component {
  static propTypes = {
    changeLocale: PropTypes.func.isRequired,
    currentLanguage: PropTypes.string.isRequired,
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
      tempShowForm: false,
    };

    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.toggleMobileNavbar = this.toggleMobileNavbar.bind(this);
  }

  componentDidUpdate(prevState) {
    if (!prevState.expandMobileNavbar && this.state.expandMobileNavbar) {
      document.getElementById('contrastButton').focus();
      event.preventDefault();
    }
  }

  collapseItem() {
    this.setState({ expanded: false });
  }

  toggleCollapse() {
    this.setState(prevState => ({ expanded: !prevState.expanded }));
  }

  handleLoginClick() {
    /* UNCOMMENT ME
      const next = encodeURIComponent(window.location.href);
      window.location.assign(`${window.location.origin}/login?next=${next}`);
    */

    // TEMP BYPASS
    if (SETTINGS.TEMP_BYPASS) {
      this.setState(prevState => ({
        tempShowForm: !prevState.tempShowForm
      }));
    } else {
      const next = encodeURIComponent(window.location.href);
      window.location.assign(`${window.location.origin}/login?next=${next}`);
    }
    // TEMP BYPASS
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
    const currentLogo = (currentLanguage === 'sv') ? 'turku-logo-sv' : 'turku-logo';
    return (
      <div>
        <MobileNavbar contrast={contrast} toggle={this.state.expandMobileNavbar} />
        <Navbar aria-label={t('Navbar.aria.topNavbar.title')} className={classNames('app-TopNavbar', contrast)} expanded={this.state.expanded} onToggle={() => this.toggleCollapse()}>

          <Navbar.Header>
            <Navbar.Brand>
              <Link aria-label={t('Navbar.aria.topNavbar.frontpage')} id="main" to="/">
                <span aria-label="Turun vaakuna" className={`${currentLogo}`} title="Etusivu" />
              </Link>
            </Navbar.Brand>
            <div className="mobile-buttons">
              <button className="navbar-toggle lang" data-target="#mobile" data-toggle="collapse" tabIndex="-1" type="button">
                <div aria-label={t('Navbar.aria.topNavbar.mobileLocale')} className="mobile_lang" role="list" type="button">
                  <NavDropdown
                    className="mobile_lang_dropdown"
                    eventKey="lang"
                    id="mobile"
                    onSelect={changeLocale}
                    title={currentLanguage}
                  >
                    {currentLanguage === 'fi'
                      ? (<MenuItem active aria-label="Suomi" eventKey="fi">FI</MenuItem>)
                      : (<MenuItem aria-label="Suomi" eventKey="fi">FI</MenuItem>)
                    }
                    {currentLanguage === 'sv'
                      ? (<MenuItem active aria-label="Svenska" eventKey="sv">SV</MenuItem>)
                      : (<MenuItem aria-label="Svenska" eventKey="sv">SV</MenuItem>)
                    }
                  </NavDropdown>
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
          <Navbar.Collapse id="navCollapse" role="presentation">
            <Nav aria-label={t('Navbar.aria.topNavbar.options')} pullRight role="list">
              <ContrastChanger />

              <FontChanger />

              <NavDropdown
                className="app-TopNavbar__language"
                eventKey="lang"
                id="language-nav-dropdown"
                onSelect={changeLocale}
                tabIndex="0"
                title={currentLanguage}
              >
                {currentLanguage === 'fi'
                  ? (<MenuItem active aria-label="Suomi" eventKey="fi">FI</MenuItem>)
                  : (<MenuItem aria-label="Suomi" eventKey="fi">FI</MenuItem>)
                    }
                {currentLanguage === 'sv'
                  ? (<MenuItem active aria-label="Svenska" eventKey="sv">SV</MenuItem>)
                  : (<MenuItem aria-label="Svenska" eventKey="sv">SV</MenuItem>)
                    }

              </NavDropdown>

              {isLoggedIn && (
              <NavDropdown
                aria-label="Logout"
                className="app-TopNavbar__name"
                eventKey="lang"
                id="user-nav-dropdown"
                noCaret
                title={userName}
              >
                <MenuItem eventKey="logout" href={`/logout?next=${window.location.origin}`}>
                  {t('Navbar.logout')}
                </MenuItem>
              </NavDropdown>
              )}

              {!isLoggedIn && (
              <NavItem className="login-button" id="app-TopNavbar__login" onClick={this.handleLoginClick}>
                {t('Navbar.login')}
              </NavItem>
              )}
              {isLoggedIn && (
                <Fragment>
                  <li className="app-TopNavbar__mobile username">
                    <Navbar.Text>{userName}</Navbar.Text>
                  </li>

                  <NavItem className="app-TopNavbar__mobile logout" href={`/logout?next=${window.location.origin}`} id="mobile_logout">

                    <Button type="button">
                      {t('Navbar.logout')}
                    </Button>

                  </NavItem>
                </Fragment>
              )

              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        {this.state.tempShowForm
          && <LoginForm hideForm={() => this.setState({ tempShowForm: false })} />}
      </div>
    );
  }
}

export default injectT(TopNavbar);
