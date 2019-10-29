import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';
import Loader from 'react-loader';

import { UnconnectedLogoutCallback as LogoutCallback } from './LogoutCallback';

describe('pages/LogoutCallback', () => {
  const history = {
    push: () => {},
  };

  function getWrapper(props) {
    const defaultProps = {
      history
    };
    return shallow(<LogoutCallback {...defaultProps} {...props} />);
  }

  describe('renders', () => {
    test('SignoutCallbackComponent with correct props', () => {
      const callback = getWrapper();
      expect(callback.length).toBe(1);
      expect(callback.prop('userManager')).toBeDefined();
      expect(callback.prop('errorCallback')).toBeDefined();
      expect(callback.prop('successCallback')).toBeDefined();
    });

    test('Loader', () => {
      const loader = getWrapper().find(Loader);
      expect(loader.length).toBe(1);
    });
  });

  describe('logoutSuccessful', () => {
    test('calls browserHistory push with correct path', () => {
      const instance = getWrapper().instance();
      const historyMock = simple.mock(history, 'push');
      instance.logoutSuccessful();

      expect(historyMock.callCount).toBe(1);
      expect(historyMock.lastCall.args).toEqual(['/']);
    });
  });

  describe('logoutUnsuccessful', () => {
    test('calls browserHistory push with correct path', () => {
      const instance = getWrapper().instance();
      const historyMock = simple.mock(history, 'push');
      instance.logoutUnsuccessful();

      expect(historyMock.callCount).toBe(1);
      expect(historyMock.lastCall.args).toEqual(['/']);
    });
  });
});
