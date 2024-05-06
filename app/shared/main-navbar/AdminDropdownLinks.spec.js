import React from 'react';
import { MenuItem, NavDropdown } from 'react-bootstrap';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

import constants from 'constants/AppConstants';
import AdminDropdownLinks from './AdminDropdownLinks';
import { shallowWithIntl } from 'utils/testUtils';
import FAIcon from 'shared/fontawesome-icon';


describe('shared/main-navbar/AdminDropdownLinks', () => {
  const defaultProps = {
    currentLanguage: 'fi',
    gitbookURL: 'https://gitbook.com/abc'
  };

  function getWrapper(props) {
    return shallowWithIntl(<AdminDropdownLinks {...defaultProps} {...props} />);
  }

  describe('renders', () => {
    test('NavDropdown', () => {
      const navDropdown = getWrapper().find(NavDropdown);
      expect(navDropdown).toHaveLength(1);
      expect(navDropdown.prop('className')).toBe('nav-link-dropdown');
      expect(navDropdown.prop('eventKey')).toBe('link-dropdown');
      expect(navDropdown.prop('id')).toBe('nav-admin-dropdown');
      expect(navDropdown.prop('title')).toBe('Navbar.links');
    });

    test('all MenuItems', () => {
      const menuItems = getWrapper().find(MenuItem);
      expect(menuItems).toHaveLength(3);

      menuItems.forEach(menuItem => {
        expect(menuItem.prop('className')).toBe('nav-dropdown-link');
        expect(menuItem.prop('rel')).toBe('noreferrer');
        expect(menuItem.prop('target')).toBe('_blank');
      });
    });

    test('first menu item has correct unique props', () => {
      const menuItem = getWrapper().find(MenuItem).first();
      expect(menuItem.prop('href')).toBe(constants.NAV_ADMIN_URLS.respa);
      expect(menuItem.prop('eventKey')).toBe('adminMaintenance');
      expect(menuItem.prop('children')).toContain('Navbar.adminMaintenance');
    });

    test('second menu item has correct unique props', () => {
      const menuItem = getWrapper().find(MenuItem).at(1);
      expect(menuItem.prop('href')).toBe(defaultProps.gitbookURL);
      expect(menuItem.prop('eventKey')).toBe('adminGuide');
      expect(menuItem.prop('children')).toContain('Navbar.adminGuide');
    });

    test('third menu item has correct unique props', () => {
      const menuItem = getWrapper().find(MenuItem).at(2);
      expect(menuItem.prop('href')).toBe(
        `https://opaskartta.turku.fi/eFeedback/${defaultProps.currentLanguage}/Feedback/30/1039`
      );
      expect(menuItem.prop('eventKey')).toBe('feedback');
      expect(menuItem.prop('children')).toContain('Navbar.feedback');
    });

    test('all FAIcons', () => {
      const icons = getWrapper().find(FAIcon);
      expect(icons).toHaveLength(3);
      icons.forEach(icon => expect(icon.prop('icon')).toBe(faExternalLinkAlt));
    });
  });
});
