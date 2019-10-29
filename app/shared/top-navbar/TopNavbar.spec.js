import React from 'react';
import NavItem from 'react-bootstrap/lib/NavItem';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';

import { shallowWithIntl } from 'utils/testUtils';
import TopNavbar from './TopNavbar';
import MobileNavbar from './mobile/MobileNavbar';

describe('shared/top-navbar/TopNavbar', () => {
  function getWrapper(props) {
    const defaults = {
      changeLocale: () => null,
      toggleMobileNavbar: () => null,
      currentLanguage: 'fi',
      isLoggedIn: false,
      userName: 'Luke Skywalker',
    };
    return shallowWithIntl(<TopNavbar {...defaults} {...props} />);
  }

  describe('componentDidUpdate', () => {
    let element;
    let instance;
    let spy;
    beforeEach(() => {
      element = getWrapper();
      instance = getWrapper().instance();
      spy = jest.spyOn(instance, 'componentDidUpdate');
    });
    test('has been called when !expandMobileNavbar -> expandMobileNavbar', () => {
      expect(element.state('expandMobileNavbar')).toBe(false);
      element.find('button').at(1).simulate('click');
      expect(element.state('expandMobileNavbar')).toBe(true);
      instance.componentDidUpdate({ expandMobileNavbar: false });
      expect(spy).toHaveBeenCalled();
    });

    test('has been called when expandMobileNavbar -> !expandMobileNavbar', () => {
      element.setState({ expandMobileNavbar: true });
      expect(element.state('expandMobileNavbar')).toBe(true);
      element.find('button').at(1).simulate('click');
      expect(element.state('expandMobileNavbar')).toBe(false);
      instance.componentDidUpdate({ expandMobileNavbar: true });
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('renders mobile, ', () => {
    test('renders MobileNavbar', () => {
      const element = getWrapper().find(MobileNavbar);
      expect(element.length).toBe(1);
    });

    test('renders all 3 navbar-toggles', () => {
      const first = getWrapper().find('.navbar-toggle');
      expect(first.length).toBe(2);
      const second = getWrapper().find('.navbar-toggle.lang');
      expect(second.length).toBe(1);
    });

    test('mobile-buttons div', () => {
      const element = getWrapper().find('.mobile-buttons');
      expect(element).toHaveLength(1);
    });

    describe('language dropdown ', () => {
      function getLanguageDropdownWrap(props) {
        return getWrapper(props).find('button').filter('.navbar-toggle').filter('.lang');
      }

      test('with correct props', () => {
        const element = getLanguageDropdownWrap();
        expect(element).toHaveLength(1);
        expect(element.prop('className')).toBe('navbar-toggle lang');
        expect(element.prop('tabIndex')).toBe('-1');
        expect(element.prop('type')).toBe('button');
      });

      test('div with correct props', () => {
        const element = getLanguageDropdownWrap().find('div');
        expect(element).toHaveLength(1);
        expect(element.prop('className')).toBe('mobile_lang');
        expect(element.prop('type')).toBe('button');
      });

      test('NavDropdown with correct props', () => {
        const changeLocale = () => null;
        const currentLanguage = 'fi';
        const nav = getLanguageDropdownWrap({ changeLocale, currentLanguage }).find(NavDropdown);

        expect(nav).toHaveLength(1);
        expect(nav.prop('className')).toBe('mobile_lang_dropdown');
        expect(nav.prop('eventKey')).toBe('lang');
        expect(nav.prop('id')).toBe('mobile');
        expect(nav.prop('onSelect')).toBe(changeLocale);
        expect(nav.prop('title')).toBe(currentLanguage);
      });
    });

    describe('mobile accessibility', () => {
      function getMobileA11yWrapper(props) {
        return getWrapper(props).find('button').last();
      }

      test('button with correct props', () => {
        const element = getMobileA11yWrapper();
        expect(element).toHaveLength(1);
        expect(element.prop('aria-controls')).toBe('mobileNavbar');
        expect(element.prop('className')).toBe('navbar-toggle');
        expect(element.prop('onClick')).toBeDefined();
        expect(element.prop('type')).toBe('button');
      });

      test('div with correct prop', () => {
        const element = getMobileA11yWrapper().find('div');
        expect(element).toHaveLength(1);
        expect(element.prop('className')).toBe('mobile_accessibility');
      });
    });
  });

  describe('language nav', () => {
    function getLanguageNavWrapper(props) {
      return getWrapper(props).find('#language-nav-dropdown');
    }

    test('is rendered', () => {
      expect(getLanguageNavWrapper()).toHaveLength(1);
    });

    test('has changeLocale as onSelect prop', () => {
      const changeLocale = () => null;
      const actual = getLanguageNavWrapper({ changeLocale }).prop('onSelect');
      expect(actual).toBe(changeLocale);
    });

    test('renders correct MenuItems when language is Finnish', () => {
      const currentLanguage = 'fi';
      const menuItems = getLanguageNavWrapper({ currentLanguage }).find(MenuItem);
      expect(menuItems).toHaveLength(2);
      expect(menuItems.at(0).prop('active')).toBe(true);
      expect(menuItems.at(0).prop('aria-label')).toBe('Suomi');
      expect(menuItems.at(0).prop('eventKey')).toBe('fi');
      expect(menuItems.at(1).prop('active')).toBeUndefined();
      expect(menuItems.at(1).prop('aria-label')).toBe('Svenska');
      expect(menuItems.at(1).prop('eventKey')).toBe('sv');
    });

    test('renders correct MenuItems when language is Swedish', () => {
      const currentLanguage = 'sv';
      const menuItems = getLanguageNavWrapper({ currentLanguage }).find(MenuItem);
      expect(menuItems).toHaveLength(2);
      expect(menuItems.at(0).prop('active')).toBeUndefined();
      expect(menuItems.at(0).prop('aria-label')).toBe('Suomi');
      expect(menuItems.at(0).prop('eventKey')).toBe('fi');
      expect(menuItems.at(1).prop('active')).toBe(true);
      expect(menuItems.at(1).prop('aria-label')).toBe('Svenska');
      expect(menuItems.at(1).prop('eventKey')).toBe('sv');
    });
  });

  describe('if user is logged in but is not an admin', () => {
    const props = {
      isAdmin: false,
      isLoggedIn: true,
      userName: 'Luke',
    };
    function getLoggedInNotAdminWrapper() {
      return getWrapper({ ...props });
    }

    test('renders the name of the logged in user', () => {
      const userNavDropDown = getLoggedInNotAdminWrapper().find('#user-nav-dropdown');
      expect(userNavDropDown).toHaveLength(1);
      expect(userNavDropDown.at(0).prop('title')).toBe(props.userName);
    });

    test('renders a logout link/button', () => {
      const logoutLink = getLoggedInNotAdminWrapper()
        .find(MenuItem)
        .filter({ eventKey: 'logout' });
      expect(logoutLink).toHaveLength(1);
    });

    test('does not render a link to login page', () => {
      const loginLink = getLoggedInNotAdminWrapper()
        .find(NavItem)
        .filter('#app-TopNavbar__login');
      expect(loginLink).toHaveLength(0);
    });
  });

  describe('if user is not logged in', () => {
    const props = {
      isLoggedIn: false,
    };
    function getNotLoggedInWrapper() {
      return getWrapper({ ...props });
    }

    test('renders a link to login page', () => {
      const wrapper = getNotLoggedInWrapper();
      const loginLink = wrapper.find(NavItem).filter('#app-TopNavbar__login');
      expect(loginLink).toHaveLength(1);
      expect(loginLink.at(0).prop('onClick')).toBe(wrapper.instance().handleLoginClick);
    });

    test('does not render a logout link/button', () => {
      const logoutLink = getNotLoggedInWrapper()
        .find(NavItem)
        .filter({ eventKey: 'logout' });
      expect(logoutLink).toHaveLength(0);
    });
  });
});
