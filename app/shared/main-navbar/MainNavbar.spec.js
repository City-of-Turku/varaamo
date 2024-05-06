
import React from 'react';
import Nav from 'react-bootstrap/lib/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import NavItem from 'react-bootstrap/lib/NavItem';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

import constants from 'constants/AppConstants';
import { getSearchPageUrl } from 'utils/searchUtils';
import { shallowWithIntl } from 'utils/testUtils';
import MainNavbar from './MainNavbar';
import AdminDropdownLinks from './AdminDropdownLinks';

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
      authUserAmr: '',
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

    test('renders AdminDropdownLinks', () => {
      const adminDropdownLinks = getLoggedInAdminWrapper().find(AdminDropdownLinks);
      expect(adminDropdownLinks).toHaveLength(1);
      expect(adminDropdownLinks.prop('currentLanguage')).toBe('fi');
      expect(adminDropdownLinks.prop('gitbookURL')).toBe(constants.NAV_ADMIN_URLS.gitbook);
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

  describe('Feedback link', () => {
    describe('when user is admin', () => {
      test('is not visible', () => {
        const nav = getWrapper({ isAdmin: true }).find(NavItem).filter({ eventKey: 'feedback' });
        expect(nav).toHaveLength(0);
      });
    });

    describe('when user login method is turku_adfs', () => {
      test('is visible', () => {
        const nav = getWrapper({ authUserAmr: 'turku_adfs' }).find(NavItem).filter({ eventKey: 'feedback' });
        expect(nav).toHaveLength(1);
      });
    });

    describe('when visible', () => {
      const wrapper = getWrapper({ authUserAmr: 'turku_adfs', isAdmin: false });

      test('NavItem is rendered correctly', () => {
        const link = wrapper.find(NavItem).filter({ eventKey: 'feedback' });
        expect(link.prop('href')).toBe('https://opaskartta.turku.fi/eFeedback/fi/Feedback/30/1039');
        expect(link.prop('target')).toBe('_blank');
        expect(link.prop('rel')).toBe('noreferrer');
        expect(link.prop('children')).toContain('Navbar.feedback');
      });

      test('Icon is rendered correctly', () => {
        const icon = wrapper.find(NavItem).filter({ eventKey: 'feedback' }).find('FAIcon');
        expect(icon.prop('icon')).toBe(faExternalLinkAlt);
      });
    });

    describe('when user login method is not turku_adfs and user is not admin', () => {
      test('is not visible', () => {
        const wrapper = getWrapper({ authUserAmr: 'something', isAdmin: false });
        expect(wrapper.find(NavItem).filter({ eventKey: 'feedback' })).toHaveLength(0);
      });
    });
  });
});
