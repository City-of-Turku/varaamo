import React from 'react';
import simple from 'simple-mock';

import ContrastChanger from './TopNavbarContrast';
import { shallowWithIntl } from 'utils/testUtils';

describe('shared/top-navbar/accessibility/TopNavbarContrast', () => {
  function getWrapper(props) {
    return shallowWithIntl(<ContrastChanger {...props} />);
  }
  let content;
  beforeAll(() => {
    content = getWrapper();
  });

  test('renders li element', () => {
    const element = content.find('li');
    expect(element.length).toBe(1);
  });

  test('renders accessibility__contrast div', () => {
    const element = content.find('.accessibility__contrast');
    expect(element.length).toBe(1);
    expect(element.prop('role')).toBe('presentation');
  });

  test('renders contrast title', () => {
    const text = content.find('.accessibility__contrast').text();
    expect(text).toBe('Nav.Contrast.title');
  });

  test('renders contrast button', () => {
    const element = content.find('button');
    expect(element.length).toBe(1);
  });

  describe('button', () => {
    test('reacts to onClick', () => {
      const changeContrast = simple.mock();
      const instance = getWrapper({ changeContrast }).instance();
      instance.handleOnClick();
      expect(changeContrast.callCount).toBe(1);
    });

    test('aria-pressed toggles from false -> true -> false', () => {
      const toggleAria = simple.mock();
      const instance = getWrapper({ toggleAria }).instance();
      expect(instance.state.ariaState).toBe(false);
      instance.toggleAriaState();
      expect(instance.state.ariaState).toBe(true);
      instance.toggleAriaState();
      expect(instance.state.ariaState).toBe(false);
    });

    test('has correct props', () => {
      const element = content.find('button').last();
      expect(element.prop('aria-label')).toBe('Nav.Contrast.button');
      expect(element.prop('aria-pressed')).toBe(false);
      expect(element.prop('className')).toBe('contrast_button');
      expect(element.prop('id')).toBe('contrastButton');
      expect(element.prop('tabIndex')).toBe('0');
      expect(element.prop('type')).toBe('button');
    });
    test('has correct id based on props', () => {
      let element = content.find('button').last();
      expect(element.prop('id')).toBe('contrastButton');
      content.setProps({ idPrefix: 'mobile' });
      element = content.find('button').last();
      expect(element.prop('id')).toBe('mobile-contrastButton');
    });
  });
});
