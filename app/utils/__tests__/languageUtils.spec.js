import constants from 'constants/AppConstants';

import { getFeedbackLink, getLocalizedFieldValue } from '../languageUtils';

describe('getFeedbackLink', () => {
  test('returns correct feedback link when language code is sv', () => {
    expect(getFeedbackLink('sv')).toBe(constants.FEEDBACK_URL.SV);
  });

  test('returns correct feedback link when language code is fi', () => {
    expect(getFeedbackLink('fi')).toBe(constants.FEEDBACK_URL.FI);
  });

  test('returns correct feedback link when language code is en', () => {
    expect(getFeedbackLink('en')).toBe(constants.FEEDBACK_URL.EN);
  });

  test('returns Finnish feedback link when language code is not defined', () => {
    expect(getFeedbackLink('test')).toBe(constants.FEEDBACK_URL.FI);
  });
});

describe('getLocalizedFieldValue', () => {
  const field = {
    en: 'test',
    fi: 'testi',
  };

  describe('when fallback is false', () => {
    // fallback is false by default
    test('returns defined locale', () => {
      const result = getLocalizedFieldValue(field, 'en');
      expect(result).toBe(field.en);
    });

    test('returns null when locale is not defined', () => {
      const result = getLocalizedFieldValue(field, 'sv');
      expect(result).toBeNull();
    });
  });

  describe('when fallback is true', () => {
    test('returns defined locale', () => {
      const result = getLocalizedFieldValue(field, 'en', true);
      expect(result).toBe(field.en);
    });

    test('returns fallback value when locale is not defined', () => {
      const result = getLocalizedFieldValue(field, 'sv', true);
      expect(result).toBe(field.en);
    });
  });
});
