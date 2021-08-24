import React from 'react';
import { shallow } from 'enzyme';
import simple from 'simple-mock';
import { Helmet } from 'react-helmet';

import Header from 'shared/header';
import Footer from 'shared/footer';
import Notifications from 'shared/notifications';
import SkipLink from 'shared/skip-link';
import { getState } from 'utils/testUtils';
import * as customizationUtils from 'utils/customizationUtils';
import { selector, UnconnectedAppContainer as AppContainer } from './AppContainer';
import { cookieBotAddListener, cookieBotRemoveListener } from '../utils/cookieUtils';

jest.mock('../utils/cookieUtils');

describe('pages/AppContainer', () => {
  function getWrapper(props) {
    const defaults = {
      children: <div id="child-div" />,
      fetchUser: () => null,
      location: {},
      user: null,
      currentLanguage: 'fi',
    };
    return shallow(<AppContainer {...defaults} {...props} />);
  }

  describe('selector', () => {
    const searchResultIds = ['resource-1', 'resourece-2'];

    const defaultProps = {
      location: {
        pathname: '/',
      },
    };

    function getSelected(props = defaultProps) {
      const state = getState({
        auth: {
          user: {
            profile: {
              sub: 'u-1',
            },
          },
        },
        'ui.search': {
          results: searchResultIds,
          showMap: true,
          unitId: 'search-unit',
        },
        'ui.resourceMap': {
          resourceId: 'selected-resource',
          showMap: false,
          unitId: 'resource-unit',
        },
      });
      return selector(state, props);
    }

    describe('with path in root', () => {
      test('returns user from state', () => {
        const user = { profile: { sub: 'u-1' } };
        expect(getSelected().user).toEqual(user);
      });
    });

    describe('with path in /resources/', () => {
      const customProps = {
        location: {
          pathname: '/resources/qwertyqwerty',
        },
      };
      test('returns userId from state', () => {
        const user = { profile: { sub: 'u-1' } };
        expect(getSelected(customProps).user).toEqual(user);
      });
    });
  });

  describe('render', () => {
    const wrapper = getWrapper();

    test('renders SkipLink', () => {
      expect(getWrapper().find(SkipLink)).toHaveLength(1);
    });

    test('renders Header', () => {
      expect(getWrapper().find(Header)).toHaveLength(1);
    });

    test('renders main', () => {
      const element = getWrapper().find('main');
      expect(element).toHaveLength(1);
      expect(element.prop('className')).toBe('app-content');
      expect(element.prop('id')).toBe('main-content');
      expect(element.prop('tabIndex')).toBe('-1');
    });

    test('renders Notifications', () => {
      expect(getWrapper().find(Notifications)).toHaveLength(1);
    });

    test('renders props.children', () => {
      const children = wrapper.find('#child-div');
      expect(children).toHaveLength(1);
    });

    test('renders Footer', () => {
      expect(getWrapper().find(Footer)).toHaveLength(1);
    });

    test('html lang attribute is set correctly when language is Finnish', () => {
      const lang = { lang: 'fi' };
      const element = wrapper.find(Helmet);
      expect(element.props().htmlAttributes).toEqual(lang);
    });

    test('html lang attribute is set correctly when language is Swedish', () => {
      const lang = { lang: 'sv' };
      const element = getWrapper({ currentLanguage: 'sv' }).find(Helmet);
      expect(element.props().htmlAttributes).toEqual(lang);
    });
  });

  describe('render Espoo/Vantaa custom classname', () => {
    const mockCity = 'ESPOO';

    beforeAll(() => {
      simple.mock(customizationUtils, 'getCustomizationClassName').returnWith(mockCity);
    });

    afterAll(() => {
      simple.restore();
    });

    test('have custom classname for Espoo when specified in config', () => {
      expect(getWrapper().prop('className')).toContain(mockCity);
    });

    test('render app className normally', () => {
      expect(getWrapper().prop('className')).toContain('app');
    });
  });

  describe('componentDidMount', () => {
    test('calls removeFacebookAppendedHash', () => {
      const instance = getWrapper().instance();
      simple.mock(instance, 'removeFacebookAppendedHash').returnWith('some text');
      instance.componentDidMount();

      expect(instance.removeFacebookAppendedHash.callCount).toBe(1);
    });
    test('calls cookieBotAddListener', () => {
      const instance = getWrapper().instance();
      instance.componentDidMount();
      expect(cookieBotAddListener).toHaveBeenCalledTimes(1);
    });
  });

  describe('componentWillUpdate', () => {
    describe('when user does not change', () => {
      test('does not fetch user data', () => {
        const fetchUser = simple.mock();
        const user = {
          profile: {
            sub: 'u-1'
          }
        };
        const instance = getWrapper({ fetchUser, user }).instance();
        instance.componentWillUpdate({ user });
        expect(fetchUser.callCount).toBe(0);
      });
    });

    describe('when user does change', () => {
      test('fetches user data if new user is not null', () => {
        const fetchUser = simple.mock();
        const user = null;
        const newUserId = 'u-99';
        const newUser = {
          profile: {
            sub: newUserId
          }
        };
        const instance = getWrapper({ fetchUser, user }).instance();
        instance.componentWillUpdate({ user: newUser });
        expect(fetchUser.callCount).toBe(1);
        expect(fetchUser.lastCall.arg).toBe(newUserId);
      });

      test('does not fetch user data if new user is null', () => {
        const fetchUser = simple.mock();
        const user = { profile: { sub: 'u-1' } };
        const newUser = null;
        const instance = getWrapper({ fetchUser, user }).instance();
        instance.componentWillUpdate({ user: newUser });
        expect(fetchUser.callCount).toBe(0);
      });
    });
  });

  describe('componentWillUnmount', () => {
    test('calls cookieBotRemoveListener', () => {
      const instance = getWrapper().instance();
      instance.componentWillUnmount();
      expect(cookieBotRemoveListener).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeFacebookAppendedHash', () => {
    beforeEach(() => {
      window.location.hash = '_=_';
    });

    test('removes "_=_" hash if it exists', () => {
      const instance = getWrapper().instance();
      instance.removeFacebookAppendedHash();
      expect(window.location.hash).toEqual(expect.not.arrayContaining(['_=_']));
    });
  });
});
