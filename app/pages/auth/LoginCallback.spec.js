import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';
import Loader from 'react-loader';

import { UnconnectedLoginCallback as LoginCallback } from './LoginCallback';

describe('pages/LoginCallback', () => {
  const history = {
    push: () => {},
  };

  function getWrapper(props) {
    const defaultProps = {
      history
    };
    return shallow(<LoginCallback {...defaultProps} {...props} />);
  }

  describe('renders', () => {
    test('CallbackComponent with correct props', () => {
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

  describe('loginSuccessful', () => {
    describe('calls browserHistory push with correct path', () => {
      test('when user.state.redirectUrl is defined', () => {
        const instance = getWrapper().instance();
        const historyMock = simple.mock(history, 'push');
        const user = { state: { redirectUrl: '/about' } };
        instance.loginSuccessful(user);

        expect(historyMock.callCount).toBe(1);
        expect(historyMock.lastCall.args).toEqual([user.state.redirectUrl]);
      });
      test('when user.state.redirectUrl is not defined', () => {
        const instance = getWrapper().instance();
        const historyMock = simple.mock(history, 'push');
        const user = { state: undefined };
        instance.loginSuccessful(user);

        expect(historyMock.callCount).toBe(1);
        expect(historyMock.lastCall.args).toEqual(['/']);
      });
    });
  });

  describe('loginUnsuccessful', () => {
    test('calls browserHistory push with correct path', () => {
      const instance = getWrapper().instance();
      const historyMock = simple.mock(history, 'push');
      instance.loginUnsuccessful();

      expect(historyMock.callCount).toBe(1);
      expect(historyMock.lastCall.args).toEqual(['/']);
    });
  });
});
