
import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import constants from 'constants/AppConstants';
import { shallowWithIntl } from 'utils/testUtils';
import FooterContent from './FooterContent';

describe('shared/footer/FooterContent', () => {
  function getWrapper(props) {
    return shallowWithIntl(<FooterContent {...props} />);
  }

  describe('When there is no customization in use', () => {
    let content;

    beforeAll(() => {
      content = getWrapper();
    });

    test('contains turku img', () => {
      const image = content.find('img');
      expect(image.length).toBe(1);
    });

    test('contains Link to Saavutettavuusseloste', () => {
      const seloste = getWrapper().find(Link);
      expect(seloste).toHaveLength(1);
      expect(seloste.prop('className')).toBe('accessibility-info-link');
      expect(seloste.prop('to')).toBe('/accessibility-info');
    });

    describe('contains feedback link with correct props', () => {
      test('when current language is fi', () => {
        const feedbackLink = getWrapper({ currentLang: 'fi' }).find('.feedback-link');
        expect(feedbackLink.length).toBe(1);
        expect(feedbackLink.prop('href')).toBe(constants.FEEDBACK_URL.FI);
        expect(feedbackLink.prop('rel')).toBe('noopener noreferrer');
        expect(feedbackLink.prop('target')).toBe('_blank');
      });

      test('when current language is sv', () => {
        const feedbackLink = getWrapper({ currentLang: 'sv' }).find('.feedback-link');
        expect(feedbackLink.length).toBe(1);
        expect(feedbackLink.prop('href')).toBe(constants.FEEDBACK_URL.SV);
        expect(feedbackLink.prop('rel')).toBe('noopener noreferrer');
        expect(feedbackLink.prop('target')).toBe('_blank');
      });

      test('when current language is en', () => {
        const feedbackLink = getWrapper({ currentLang: 'en' }).find('.feedback-link');
        expect(feedbackLink.length).toBe(1);
        expect(feedbackLink.prop('href')).toBe(constants.FEEDBACK_URL.EN);
        expect(feedbackLink.prop('rel')).toBe('noopener noreferrer');
        expect(feedbackLink.prop('target')).toBe('_blank');
      });
    });

    test('renders FormattedHTMLMessage for Turku', () => {
      const texts = content.find(FormattedHTMLMessage);
      expect(texts.length).toBe(1);
    });
  });
});
