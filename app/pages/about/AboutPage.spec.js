
import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';

import PageWrapper from 'pages/PageWrapper';
import { shallowWithIntl } from 'utils/testUtils';
import AboutPage from './AboutPage';
import { getAboutContent } from './content/aboutContent';
import { getFeedbackLink } from '../../utils/languageUtils';

describe('pages/about/AboutPage', () => {
  const defaultProps = {
    currentLanguage: 'fi'
  };

  function getWrapper(props) {
    return shallowWithIntl(<AboutPage {...defaultProps} {...props} />);
  }

  test('renders PageWrapper with correct props', () => {
    const pageWrapper = getWrapper().find(PageWrapper);
    expect(pageWrapper).toHaveLength(1);
    expect(pageWrapper.prop('className')).toBe('about-page');
    expect(pageWrapper.prop('title')).toBe('AboutPage.title');
  });

  test('renders div with main content', () => {
    const div = getWrapper().find('div');
    const expectedContent = {
      __html: getAboutContent(
        defaultProps.currentLanguage,
        getFeedbackLink(defaultProps.currentLanguage))
    };
    expect(div).toHaveLength(1);
    expect(div.prop('dangerouslySetInnerHTML')).toStrictEqual(expectedContent);
  });

  test('renders correct amount of <p> elements', () => {
    const p = getWrapper().find('p');
    expect(p.length).toBe(4);
  });

  test('render correct amount of <FormattedHTMLMessage>', () => {
    const elements = getWrapper().find(FormattedHTMLMessage);
    expect(elements.length).toBe(4);
  });
});
