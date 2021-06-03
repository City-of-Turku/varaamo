import React from 'react';
import NavItem from 'react-bootstrap/lib/NavItem';
import Navbar from 'react-bootstrap/lib/Navbar';
import Button from 'react-bootstrap/lib/Button';

import LanguageDropdown from './language-dropdown/LanguageDropdown';
import LoginControls from './login-logout-controls/LoginControls';
import LogoutControls from './login-logout-controls/LogoutControls';
import { shallowWithIntl } from 'utils/testUtils';
import TopNavbar from './TopNavbar';
import MobileNavbar from './mobile/MobileNavbar';

describe('shared/top-navbar/TopNavbar', () => {
  const defaults = {
    addNotification: () => null,
    changeLocale: () => null,
    toggleMobileNavbar: () => null,
    handleLanguageChange: () => null,
    handleLoginClick: () => null,
    currentLanguage: 'fi',
    idToken: 'some-token',
    isLoggedIn: false,
    userName: 'Luke Skywalker',
  };
  function getWrapper(props) {
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

  describe('collapse functions', () => {
    let element;
    let instance;
    beforeEach(() => {
      element = getWrapper();
      instance = element.instance();
    });
    test('collapseItem sets expanded to false', () => {
      element.setState({ expanded: true });
      expect(element.state('expanded')).toBe(true);
      instance.collapseItem();
      expect(element.state('expanded')).toBe(false);
    });

    test('toggleCollapse toggles expanded to !prevState.expanded', () => {
      element.setState({ expanded: true });
      expect(element.state('expanded')).toBe(true);
      instance.toggleCollapse();
      expect(element.state('expanded')).toBe(false);
      instance.toggleCollapse();
      expect(element.state('expanded')).toBe(true);
    });

    test('toggleMobileNavbar toggles expandMobileNavbar state', () => {
      element.setState({ expandMobileNavbar: false });
      expect(element.state('expandMobileNavbar')).toBe(false);
      instance.toggleMobileNavbar();
      expect(element.state('expandMobileNavbar')).toBe(true);
      instance.toggleMobileNavbar();
      expect(element.state('expandMobileNavbar')).toBe(false);
    });
  });

  describe('handle functions', () => {
    let element;
    let instance;
    let spy;
    const handleLoginClickMock = jest.fn();
    const handleLogoutClickMock = jest.fn();
    const handleLanguageChangeMock = jest.fn();
    beforeEach(() => {
      element = getWrapper({ isLoggedIn: true });
      element.instance().handleLoginClick = handleLoginClickMock;
      element.instance().handleLogoutClick = handleLogoutClickMock;
      element.instance().handleLanguageChange = handleLanguageChangeMock;
      element.instance().forceUpdate();
      instance = element.instance();
    });

    test('handleLoginClick is called', () => {
      spy = jest.spyOn(instance, 'handleLoginClick');
      instance.handleLoginClick();
      expect(spy).toHaveBeenCalled();
    });

    test('handleLogoutClick is called', () => {
      spy = jest.spyOn(instance, 'handleLogoutClick');
      element.find(Button).simulate('click');
      expect(spy).toHaveBeenCalled();
    });

    test('handleLanguageChange is called', () => {
      spy = jest.spyOn(instance, 'handleLanguageChange');
      instance.handleLanguageChange();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('renders Navbar', () => {
    test('with default props', () => {
      const wrap = getWrapper();
      wrap.setState({ expanded: false });
      const element = wrap.find(Navbar);
      expect(element).toHaveLength(1);
      expect(element.prop('className')).toBe('app-TopNavbar');
      expect(element.prop('expanded')).toBe(false);
      expect(element.prop('onToggle')).toBeDefined();
    });

    test('with correct className when high-contrast', () => {
      const element = getWrapper({ contrast: 'high-contrast' }).find(Navbar);
      expect(element.prop('className')).toBe('app-TopNavbar high-contrast');
    });

    test('with correct className when default contrast', () => {
      const element = getWrapper({ contrast: '' }).find(Navbar);
      expect(element.prop('className')).toBe('app-TopNavbar');
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

      test('LanguageDropdown with correct props', () => {
        const element = getLanguageDropdownWrap().find(LanguageDropdown);
        expect(element).toHaveLength(1);
        expect(element.prop('changeLocale')).toBe(defaults.changeLocale);
        expect(element.prop('classNameOptional')).toBe('mobile_lang_dropdown');
        expect(element.prop('currentLanguage')).toBe(defaults.currentLanguage);
        expect(element.prop('handleLanguageChange')).toBeDefined();
        expect(element.prop('id')).toBe('mobileLang');
      });

      test('LanguageDropdown gets currentLanguage', () => {
        const propSV = { currentLanguage: 'sv' };
        const propFI = { currentLanguage: 'fi' };
        const elementSV = getLanguageDropdownWrap(propSV).find(LanguageDropdown);
        const elementFI = getLanguageDropdownWrap(propFI).find(LanguageDropdown);
        expect(elementSV.prop('currentLanguage')).toBe(propSV.currentLanguage);
        expect(elementFI.prop('currentLanguage')).toBe(propFI.currentLanguage);
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

      test('button onClick works', () => {
        const element = getWrapper();
        element.setState({ expandMobileNavbar: false });
        element.find('button').last().simulate('click');
        expect(element.state('expandMobileNavbar')).toBe(true);
      });

      test('div with correct prop', () => {
        const element = getMobileA11yWrapper().find('div');
        expect(element).toHaveLength(1);
        expect(element.prop('className')).toBe('mobile_accessibility');
      });
    });
  });

  describe('desktop language dropdown', () => {
    function getLanguageDropdownWrap(props) {
      return getWrapper(props).find('#navCollapse').find(LanguageDropdown);
    }

    test('is rendered', () => {
      expect(getLanguageDropdownWrap()).toHaveLength(1);
    });

    test('LanguageDropdown has correct props', () => {
      const element = getLanguageDropdownWrap();
      expect(element).toHaveLength(1);
      expect(element.prop('changeLocale')).toBe(defaults.changeLocale);
      expect(element.prop('currentLanguage')).toBe(defaults.currentLanguage);
      expect(element.prop('handleLanguageChange')).toBeDefined();
      expect(element.prop('id')).toBe('desktopLang');
    });

    test('LanguageDropdown gets currentLanguage', () => {
      const elementSV = getLanguageDropdownWrap({ currentLanguage: 'sv' });
      const elementFI = getLanguageDropdownWrap({ currentLanguage: 'fi' });
      expect(elementSV.prop('currentLanguage')).toBe('sv');
      expect(elementFI.prop('currentLanguage')).toBe('fi');
    });
  });

  describe('if user is logged in ', () => {
    const props = {
      isLoggedIn: true,
      userName: 'Luke',
    };
    function getLoggedInWrapper() {
      return getWrapper({ ...props });
    }
    test('renders LogoutControls component with correct props', () => {
      const element = getLoggedInWrapper().find(LogoutControls);
      expect(element).toHaveLength(1);
      expect(element.prop('handleLogoutClick')).toBeDefined();
      expect(element.prop('userName')).toBe(props.userName);
    });

    test('renders username text in mobileview', () => {
      const element = getLoggedInWrapper().find('li').find('.app-TopNavbar__mobile.username');
      expect(element).toHaveLength(1);
      expect(element.prop('className')).toBe('app-TopNavbar__mobile username');
      expect(element.find('NavbarText').prop('children')).toBe(props.userName);
    });

    test('renders NavItem for logout button in mobileview', () => {
      const element = getLoggedInWrapper().find(NavItem).find('.app-TopNavbar__mobile.logout');
      expect(element).toHaveLength(1);
      expect(element.prop('className')).toBe('app-TopNavbar__mobile logout');
      expect(element.prop('id')).toBe('mobile_logout');
    });

    test('renders logout button in mobileview', () => {
      const element = getLoggedInWrapper().find(NavItem).find(Button);
      expect(element).toHaveLength(1);
      expect(element.prop('onClick')).toBeDefined();
      expect(element.prop('type')).toBe('button');
      expect(element.prop('children')).toBe('Navbar.logout');
    });
  });

  describe('if user is not logged in', () => {
    const props = {
      isLoggedIn: false,
    };
    function getNotLoggedInWrapper() {
      return getWrapper({ ...props });
    }

    test('renders LoginControls component', () => {
      const element = getNotLoggedInWrapper().find(LoginControls);
      expect(element).toHaveLength(1);
      expect(element.prop('handleLoginClick')).toBeDefined();
    });
  });
});
