import React from 'react';
import { shallow } from 'enzyme';
import simple from 'simple-mock';

import SignInRedirectRoute from './SignInRedirectRoute';
import userManager from 'utils/userManager';

describe('app/shared/sign-in-redirect/SigninRedirectPage', () => {
  const getWrapper = () => shallow(<SignInRedirectRoute />);
  const redirectMock = simple.mock();

  test('componentDidMount calls userManager.signinRedirect', () => {
    const instance = getWrapper().instance();
    simple.mock(userManager, 'signinRedirect', redirectMock);
    instance.componentDidMount();
    expect(redirectMock.callCount).toEqual(1);
  });

  test('renders empty div', () => {
    const div = getWrapper().find('div');
    expect(div.length).toBe(1);
  });
});
