import React from 'react';
import simple from 'simple-mock';

import FontSizeChanger from './TopNavbarFontChanger';
import { shallowWithIntl } from 'utils/testUtils';
import ACC from '../../../constants/AppConstants';

describe('shared/top-navbar/accessibility/TopNavbarFontChanger', () => {
  function getWrapper(props) {
    return shallowWithIntl(<FontSizeChanger {...props} />);
  }
  let content;
  beforeAll(() => {
    content = getWrapper();
  });

  test('renders li element', () => {
    const element = content.find('li');
    expect(element.length).toBe(1);
  });

  test('renders accessibility__buttonGroup div', () => {
    const element = content.find('.accessibility__buttonGroup');
    expect(element.length).toBe(1);
  });

  test('renders FontSize title', () => {
    const text = content.find('.accessibility__buttonGroup').text();
    expect(text).toContain('Nav.FontSize.title');
  });

  test('renders button elements', () => {
    const elements = content.find('button');
    expect(elements.length).toBe(3);
  });

  describe('buttons have correct props at default', () => {
    test('first button', () => {
      const element = content.find('button').first();
      expect(element.prop('aria-label')).toBe('Nav.FontSize.small');
      expect(element.prop('aria-pressed')).toBe(true);
      expect(element.prop('className')).toBe('active');
      expect(element.prop('type')).toBe('button');
    });

    test('second button', () => {
      const element = content.find('button').at(1);
      expect(element.prop('aria-label')).toBe('Nav.FontSize.medium');
      expect(element.prop('aria-pressed')).toBe(false);
      expect(element.prop('className')).toBe('');
      expect(element.prop('type')).toBe('button');
    });

    test('third button', () => {
      const element = content.find('button').last();
      expect(element.prop('aria-label')).toBe('Nav.FontSize.large');
      expect(element.prop('aria-pressed')).toBe(false);
      expect(element.prop('className')).toBe('');
      expect(element.prop('type')).toBe('button');
    });
  });

  describe('getActiveFontButton function works when', () => {
    const instance = getWrapper().instance();
    test('fontsize is small', () => {
      const fontSize = instance.getActiveFontButton(ACC.FONT_SIZES.SMALL);
      expect(fontSize).toBe(instance.first);
    });

    test('fontsize is medium', () => {
      const fontSize = instance.getActiveFontButton(ACC.FONT_SIZES.MEDIUM);
      expect(fontSize).toBe(instance.second);
    });

    test('fontsize is large', () => {
      const fontSize = instance.getActiveFontButton(ACC.FONT_SIZES.LARGE);
      expect(fontSize).toBe(instance.third);
    });
  });
  describe('button elements get active class when selected', () => {
    test('first button get active', () => {
      content.setProps({ fontSize: ACC.FONT_SIZES.SMALL });
      const element = content.find('button').at(0).find('.active');
      expect(element.length).toBe(1);
    });

    test('second button get active', () => {
      content.setProps({ fontSize: ACC.FONT_SIZES.MEDIUM });
      const element = content.find('button').at(1).find('.active');
      expect(element.length).toBe(1);
    });

    test('third button get active', () => {
      content.setProps({ fontSize: ACC.FONT_SIZES.LARGE });
      const element = content.find('button').at(2).find('.active');
      expect(element.length).toBe(1);
    });

    test('only one button is active', () => {
      const element = content.find('button').find('.active');
      expect(element.length).toBe(1);
    });
  });

  describe('button onClicks work', () => {
    test('calls props.changeFontSize', () => {
      const changeFontSize = simple.mock();
      const instance = getWrapper({ changeFontSize }).instance();
      instance.handleFontSizeClick(ACC.FONT_SIZES.SMALL);
      expect(changeFontSize.callCount).toBe(1);
      expect(changeFontSize.lastCall.args).toEqual([ACC.FONT_SIZES.SMALL]);
    });
  });

  describe('setActiveClass returns ', () => {
    test('active when span === spanID', () => {
      const spanID = 'second';
      const instance = getWrapper({ fontSize: ACC.FONT_SIZES.MEDIUM }).instance();
      const span = instance.setActiveClass(spanID);
      expect(span).toBe('active');
    });

    test('"" when span !== spanID', () => {
      const spanID = 'first';
      const instance = getWrapper({ fontSize: ACC.FONT_SIZES.MEDIUM }).instance();
      const span = instance.setActiveClass(spanID);
      expect(span).toBe('');
    });
  });

  describe('setAriaPressed returns ', () => {
    test('true when span === spanID', () => {
      const spanID = 'first';
      const instance = getWrapper({ fontSize: ACC.FONT_SIZES.SMALL }).instance();
      const span = instance.setAriaPressed(spanID);
      expect(span).toBe(true);
    });

    test('false when span !== spanID', () => {
      const spanID = 'second';
      const instance = getWrapper({ fontSize: ACC.FONT_SIZES.SMALL }).instance();
      const span = instance.setAriaPressed(spanID);
      expect(span).toBe(false);
    });
  });

  describe('setAriaLabel returns correct texts', () => {
    const instance = getWrapper().instance();

    test('to the small text button', () => {
      const value = instance.setAriaLabel(ACC.FONT_SIZES.SMALL);
      expect(value).toBe('Nav.FontSize.small');
    });

    test('to the medium text button', () => {
      const value = instance.setAriaLabel(ACC.FONT_SIZES.MEDIUM);
      expect(value).toBe('Nav.FontSize.medium');
    });

    test('to the large text button', () => {
      const value = instance.setAriaLabel(ACC.FONT_SIZES.LARGE);
      expect(value).toBe('Nav.FontSize.large');
    });

    test('default', () => {
      const value = instance.setAriaLabel('error');
      expect(value).toBe('');
    });
  });
});
