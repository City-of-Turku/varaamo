import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';

import PageWrapper from 'pages/PageWrapper';
import { shallowWithIntl } from 'utils/testUtils';
import AccessibilityInfoPage from './AccessibilityInfoPage';
import { FinnishText, SwedishText } from './content';


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
  });
});
