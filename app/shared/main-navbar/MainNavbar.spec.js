import constants from 'constants/AppConstants';

import React from 'react';
import Nav from 'react-bootstrap/lib/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import NavItem from 'react-bootstrap/lib/NavItem';

import { getSearchPageUrl } from 'utils/searchUtils';
import { shallowWithIntl } from 'utils/testUtils';
import MainNavbar from './MainNavbar';
import FAIcon from 'shared/fontawesome-icon';

describe('shared/main-navbar/MainNavbar', () => {
  const pathname = 'somepath';

  function getWrapper(props) {
    const defaults = {
      activeLink: pathname,
      changeLocale: () => null,
      currentLanguage: 'fi',
      clearSearchResults: () => null,
      isAdmin: false,
      isLoggedIn: false,
      userName: 'Luke Skywalker',
    };
    return shallowWithIntl(<MainNavbar {...defaults} {...props} />);
  }

  test('renders nav with correct activeKey', () => {
    const nav = getWrapper().find(Nav);
    expect(nav).toHaveLength(1);
    expect(nav.at(0).prop('activeKey')).toBe(pathname);
  });

  test('renders a link to search page', () => {
    const searchLink = getWrapper().find(LinkContainer).filter({ to: getSearchPageUrl() });
    expect(searchLink).toHaveLength(1);
  });

  test('contains a link to about page', () => {
    const link = getWrapper().find(LinkContainer).filter({ to: '/about' });
    expect(link).toHaveLength(1);
  });

  describe('if user is logged in but is not an admin', () => {
    const props = {
      isAdmin: false,
      isLoggedIn: true,
      userName: 'Luke',
    };
    function getLoggedInNotAdminWrapper(extraProps) {
      return getWrapper({ ...props, ...extraProps });
    }

    test('renders a link to my reservations page', () => {
      const myReservationsLink = getLoggedInNotAdminWrapper()
        .find(LinkContainer).filter({ to: '/my-reservations' });
      expect(myReservationsLink).toHaveLength(1);
    });

    test('renders a link to favourites page when logged in', () => {
      const myReservationsLink = getLoggedInNotAdminWrapper()
        .find(LinkContainer).filter({ to: '/favourites' });
      expect(myReservationsLink).toHaveLength(1);
    });

    test('does not render a link to admin resources page', () => {
      const myReservationsLink = getLoggedInNotAdminWrapper()
        .find(LinkContainer).filter({ to: '/admin-resources' });
      expect(myReservationsLink).toHaveLength(0);
    });

    test('does not render a link to manage reservations page', () => {
      const myReservationsLink = getLoggedInNotAdminWrapper()
        .find(LinkContainer).filter({ to: '/manage-reservations' });
      expect(myReservationsLink).toHaveLength(0);
    });

    test('does not render a link to respa admin UI', () => {
      const maintenanceLink = getLoggedInNotAdminWrapper()
        .find(NavItem).filter({ href: 'dev' });
      expect(maintenanceLink).toHaveLength(0);
    });

    test('does not render a link to varaamo gitbook', () => {
      const gitbookLink = getLoggedInNotAdminWrapper()
        .find(NavItem).filter({ href: constants.NAV_ADMIN_URLS.gitbook });
      expect(gitbookLink).toHaveLength(0);
    });
  });

  describe('if user is logged in and is an admin', () => {
    const props = {
      isAdmin: true,
      isLoggedIn: true,
    };

    function getLoggedInAdminWrapper(extraProps) {
      return getWrapper({ ...props, ...extraProps });
    }

    test('renders a link to admin resources page', () => {
      const myReservationsLink = getLoggedInAdminWrapper()
        .find(LinkContainer).filter({ to: '/admin-resources' });
      expect(myReservationsLink).toHaveLength(1);
    });

    test('renders a link to manage reservations page', () => {
      const myReservationsLink = getLoggedInAdminWrapper()
        .find(LinkContainer).filter({ to: '/manage-reservations' });
      expect(myReservationsLink).toHaveLength(1);
    });

    test('renders a link to respa admin UI', () => {
      const respaAdminLink = getLoggedInAdminWrapper().find(NavItem).filter({ eventKey: 'adminGuide' });
      expect(respaAdminLink).toHaveLength(1);
    });

    test('renders a link to respa admin UI, open new tab when clicked', () => {
      const respaAdminLink = getLoggedInAdminWrapper()
        .find(NavItem).filter({ eventKey: 'adminGuide' });
      expect(respaAdminLink.prop('target')).toEqual('_blank');
    });

    test('renders a link to default(finnish) varaamo gitbook when language is not swedish', () => {
      const gitbookLink = getLoggedInAdminWrapper()
        .find(NavItem).filter({ href: constants.NAV_ADMIN_URLS.gitbook });
      expect(gitbookLink).toHaveLength(1);
    });

    test('renders a link to swedish varaamo gitbook when language is swedish', () => {
      const gitbookLink = getLoggedInAdminWrapper({ currentLanguage: 'sv' })
        .find(NavItem).filter({ href: constants.NAV_ADMIN_URLS.gitbook_sv });
      expect(gitbookLink).toHaveLength(1);
    });

    test('renders a link to varaamo gitbook, open new tab when clicked', () => {
      const gitbookLink = getLoggedInAdminWrapper()
        .find(NavItem).filter({ href: constants.NAV_ADMIN_URLS.gitbook });
      expect(gitbookLink.prop('target')).toEqual('_blank');
    });

    test('renders a external link icon to next to respa admin UI text', () => {
      const maintenanceLink = getLoggedInAdminWrapper()
        .find(NavItem).filter({ eventKey: 'adminGuide' });
      const icon = maintenanceLink.find(FAIcon);

      expect(icon).toHaveLength(1);
    });

    test('renders an icon next to varaamo gitbook text', () => {
      const gitbookLink = getLoggedInAdminWrapper()
        .find(NavItem).filter({ href: constants.NAV_ADMIN_URLS.gitbook });

      const icon = gitbookLink.find(FAIcon);
      expect(icon).toHaveLength(1);
    });
  });

  describe('if user is not logged in', () => {
    const props = {
      isAdmin: false,
      isLoggedIn: false,
    };
    function getNotLoggedInWrapper(extraProps) {
      return getWrapper({ ...props, ...extraProps });
    }

    test('does not render a link to my reservations page', () => {
      const myReservationsLink = getNotLoggedInWrapper()
        .find(LinkContainer).filter({ to: '/my-reservations' });
      expect(myReservationsLink).toHaveLength(0);
    });

    test('does not render a link to admin resources page', () => {
      const myReservationsLink = getNotLoggedInWrapper()
        .find(LinkContainer).filter({ to: '/admin-resources' });
      expect(myReservationsLink).toHaveLength(0);
    });

    test('does not render a link to favourites page', () => {
      const myReservationsLink = getNotLoggedInWrapper()
        .find(LinkContainer).filter({ to: '/favourites' });
      expect(myReservationsLink).toHaveLength(0);
    });

    test('does not render a link to respa admin UI', () => {
      const maintenanceLink = getNotLoggedInWrapper()
        .find(NavItem).filter({ eventKey: 'adminGuide' });
      expect(maintenanceLink).toHaveLength(0);
    });

    test('does not render a link to varaamo gitbook', () => {
      const gitbookLink = getNotLoggedInWrapper()
        .find(NavItem).filter({ href: constants.NAV_ADMIN_URLS.gitbook });
      expect(gitbookLink).toHaveLength(0);
    });
  });
});
