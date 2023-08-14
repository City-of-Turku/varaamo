
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import classNames from 'classnames';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

import constants from 'constants/AppConstants';
import FAIcon from 'shared/fontawesome-icon';
import { injectT } from 'i18n';
import { getSearchPageUrl } from 'utils/searchUtils';

class MainNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  collapseItem() {
    this.setState({ expanded: false });
  }

  toggleCollapse() {
    this.setState(prevState => ({ expanded: !prevState.expanded }));
  }

  render() {
    const {
      activeLink,
      clearSearchResults,
      isAdmin,
      isLoggedIn,
      t,
      contrast,
      currentLanguage,
    } = this.props;

    const gitbookURL = currentLanguage === 'sv' ? constants.NAV_ADMIN_URLS.gitbook_sv : constants.NAV_ADMIN_URLS.gitbook;

    return (
      <Navbar aria-label={t('Navbar.aria.mainNavbar.title')} className={classNames('app-MainNavbar', contrast)} expanded={this.state.expanded} onToggle={() => this.toggleCollapse()}>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Varaamo</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-label={t('Navbar.aria.topNavbar.mobileToggle')} />

        </Navbar.Header>
        <Navbar.Collapse>
          <Nav activeKey={activeLink}>
            <LinkContainer to={getSearchPageUrl()}>
              <NavItem
                eventKey="search"
                onClick={() => {
                  this.collapseItem();
                  clearSearchResults();
                }}
              >
                {t('Navbar.search')}
              </NavItem>
            </LinkContainer>
            {(isLoggedIn && !isAdmin) && (
              <LinkContainer to="/favourites">
                <NavItem eventKey="favourites" onClick={() => this.collapseItem()}>
                  {isAdmin ? t('Navbar.adminResources') : t('Navbar.userFavorites')}
                </NavItem>
              </LinkContainer>
            )}
            {(isLoggedIn && isAdmin) && (
              <LinkContainer to="/admin-resources">
                <NavItem eventKey="admin-resources" onClick={() => this.collapseItem()}>
                  {isAdmin ? t('Navbar.adminResources') : t('Navbar.userFavorites')}
                </NavItem>
              </LinkContainer>
            )}

            {isLoggedIn && (
              <LinkContainer to="/my-reservations">
                <NavItem eventKey="my-reservations" onClick={() => this.collapseItem()}>
                  {t('Navbar.userResources')}
                </NavItem>
              </LinkContainer>
            )}
            {isAdmin
              && (
                <Fragment>
                  <LinkContainer to="/manage-reservations">
                    <NavItem eventKey="manage-reservations" onClick={() => this.collapseItem()}>
                      {t('Navbar.manageReservations')}
                    </NavItem>
                  </LinkContainer>
                  <NavItem eventKey="adminMaintenance" href={constants.NAV_ADMIN_URLS.respa} target="_blank">
                    {t('Navbar.adminMaintenance')}
                    <FAIcon icon={faExternalLinkAlt} />
                  </NavItem>

                  <NavItem eventKey="adminGuide" href={gitbookURL} target="_blank">
                    {t('Navbar.adminGuide')}
                    <FAIcon icon={faExternalLinkAlt} />
                  </NavItem>
                </Fragment>
              )
            }
            <LinkContainer to="/about">
              <NavItem eventKey="about" onClick={() => this.collapseItem()}>
                {t('Navbar.aboutLink')}
              </NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

MainNavbar.propTypes = {
  activeLink: PropTypes.string.isRequired,
  clearSearchResults: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  contrast: PropTypes.string,
  currentLanguage: PropTypes.string,
};

export default injectT(MainNavbar);
