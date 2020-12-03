import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import CookieBar from './CookieBar';

describe('shared/CookieBar', () => {
  function getWrapper() {
    return shallowWithIntl(<CookieBar />);
  }

  test('renders CookieBar with correct props', () => {
    const wrapper = getWrapper();
    expect(wrapper).toHaveLength(1);
    expect(wrapper.prop('buttonClasses')).toBe('cookie-button');
    expect(wrapper.prop('buttonId')).toBe('cookie-accept-button');
    expect(wrapper.prop('buttonText')).toEqual('CookieBar.accept');
    expect(wrapper.prop('contentClasses')).toBe('cookie-content');
    expect(wrapper.prop('declineButtonClasses')).toBe('cookie-button');
    expect(wrapper.prop('declineButtonId')).toBe('cookie-decline-button');
    expect(wrapper.prop('declineButtonText')).toEqual('CookieBar.decline');
    expect(wrapper.prop('disableStyles')).toBe(true);
    expect(wrapper.prop('enableDeclineButton')).toBe(true);
    expect(wrapper.prop('onDecline')).toBeDefined();
    expect(wrapper.prop('onAccept')).toBeDefined();
    expect(wrapper.prop('expires')).toBe(90);
    expect(wrapper.prop('setDeclineCookie')).toBe(true);
    expect(wrapper.contains('CookieBar.description')).toBe(true);
  });

  test('renders div.cookiePolicy', () => {
    const div = getWrapper().find('div.cookiePolicy');
    expect(div.length).toBe(1);
  });

  test('renders link to cookie policy with correct props', () => {
    const policyLink = getWrapper().find('a');
    expect(policyLink.length).toBe(1);
    expect(policyLink.prop('href')).toEqual('CookieBar.link.href');
    expect(policyLink.prop('style')).toEqual({ color: 'white' });
    expect(policyLink.text()).toEqual('CookieBar.link.text');
  });
});
