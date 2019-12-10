import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';

import PageWrapper from 'pages/PageWrapper';
import { shallowWithIntl } from 'utils/testUtils';
import AccessibilityInfoPage from './AccessibilityInfoPage';
import { FinnishText, SwedishText, EnglishText } from './content';


describe('pages/accessibility-info/AccessibilityInfoPage', () => {
  const defaultProps = {
    currentLanguage: 'fi'
  };
  function getWrapper(props) {
    return shallowWithIntl(<AccessibilityInfoPage {...defaultProps} {...props} />);
  }

  test('componentDidMount', () => {
    const scrollToSpy = jest.fn();
    Object.defineProperty(global.window, 'scrollTo', { value: scrollToSpy });
    const instance = getWrapper().instance();
    instance.componentDidMount();
    expect(scrollToSpy).toHaveBeenCalled();
  });

  describe('getCorrectText', () => {
    test('When current languange is Finnish', () => {
      const instance = getWrapper().instance();
      instance.componentDidMount();
      expect(instance.getCorrectText('fi')).toBe(FinnishText);
    });

    test('When current languange is Swedish', () => {
      const instance = getWrapper().instance();
      instance.componentDidMount();
      expect(instance.getCorrectText('sv')).toBe(SwedishText);
    });

    test('When current languange is English', () => {
      const instance = getWrapper().instance();
      instance.componentDidMount();
      expect(instance.getCorrectText('en')).toBe(EnglishText);
    });

    test('When current languange is something else', () => {
      const instance = getWrapper().instance();
      instance.componentDidMount();
      expect(instance.getCorrectText('jp')).toBe(FinnishText);
    });
  });


  test('renders PageWrapper with correct props', () => {
    const pageWrapper = getWrapper().find(PageWrapper);
    expect(pageWrapper).toHaveLength(1);
    expect(pageWrapper.prop('className')).toBe('accessibility-info-page');
    expect(pageWrapper.prop('title')).toBe('AccessibilityInfo.title');
  });

  describe('render <FormattedHTMLMessage>', () => {
    test('with correct props when language is Finnish', () => {
      const element = getWrapper().find(FormattedHTMLMessage);
      expect(element).toHaveLength(1);
      expect(element.prop('defaultMessage')).toBe(FinnishText);
      expect(element.prop('id')).toBe('AccessibilityContent');
    });
    test('with correct props when language is Swedish', () => {
      const element = getWrapper({ currentLanguage: 'sv' }).find(FormattedHTMLMessage);
      expect(element).toHaveLength(1);
      expect(element.prop('defaultMessage')).toBe(SwedishText);
      expect(element.prop('id')).toBe('AccessibilityContent');
    });
    test('with correct props when language is English', () => {
      const element = getWrapper({ currentLanguage: 'en' }).find(FormattedHTMLMessage);
      expect(element).toHaveLength(1);
      expect(element.prop('defaultMessage')).toBe(EnglishText);
      expect(element.prop('id')).toBe('AccessibilityContent');
    });
  });
});
