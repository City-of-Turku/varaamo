import constants from 'constants/AppConstants';

import { getFeedbackLink } from '../languageUtils';

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
