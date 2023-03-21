
import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';

import constants from 'constants/AppConstants';
import PageWrapper from 'pages/PageWrapper';
import { shallowWithIntl } from 'utils/testUtils';
import AboutPage from './AboutPage';

describe('pages/about/AboutPage', () => {
  function getWrapper() {
    return shallowWithIntl(<AboutPage />);
  }

  test('renders PageWrapper with correct props', () => {
    const pageWrapper = getWrapper().find(PageWrapper);
    expect(pageWrapper).toHaveLength(1);
    expect(pageWrapper.prop('className')).toBe('about-page');
    expect(pageWrapper.prop('title')).toBe('AboutPage.title');
  });

  test('renders AboutPageContent.defaultHeader', () => {
    const text = getWrapper().find('h1').text();
    expect(text).toBe('AboutPageContent.defaultHeader');
  });
  test('renders correct amount of <p> elements', () => {
    const p = getWrapper().find('p');
    expect(p.length).toBe(10);
  });
  test('render correct amount of <FormattedHTMLMessage>', () => {
    const elements = getWrapper().find(FormattedHTMLMessage);
    expect(elements.length).toBe(5);
  });

  test('render feedbacklink according to currentLanguage ', () => {
    const lan = {
      currentLanguage: 'fi'
    };
    const elements = getWrapper({ lan }).find('a');
    expect(elements.prop('href')).toBe(constants.FEEDBACK_URL.FI);
    expect(elements.prop('rel')).toBe('noopener noreferrer');
    expect(elements.prop('target')).toBe('_blank');
  });
});
