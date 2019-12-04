import {
  getServiceMapUrl,
} from 'utils/unitUtils';

describe('Utils: unitUtils', () => {
  describe('getServiceMapUrl', () => {
    test('returns correct url when unit has mapServiceId defined and current language is sv', () => {
      const unit = { mapServiceId: '123' };
      const currentLanguage = 'sv';
      const expected = 'https://servicekarta.turku.fi/unit/123#!route-details';

      expect(getServiceMapUrl(unit, currentLanguage)).toBe(expected);
    });

    test('returns correct url when unit has mapServiceId defined and current language is fi', () => {
      const unit = { mapServiceId: '123' };
      const currentLanguage = 'fi';
      const expected = 'https://palvelukartta.turku.fi/unit/123#!route-details';

      expect(getServiceMapUrl(unit, currentLanguage)).toBe(expected);
    });

    test('returns correct url when unit has mapServiceId defined and current language is en', () => {
      const unit = { mapServiceId: '123' };
      const currentLanguage = 'en';
      const expected = 'https://servicemap.turku.fi/unit/123#!route-details';

      expect(getServiceMapUrl(unit, currentLanguage)).toBe(expected);
    });

    test('returns finnish url when unit has mapServiceId defined but language code is not one of the defined ones', () => {
      const unit = { mapServiceId: '123' };
      const currentLanguage = 'test';
      const expected = 'https://palvelukartta.turku.fi/unit/123#!route-details';

      expect(getServiceMapUrl(unit, currentLanguage)).toBe(expected);
    });

    test('returns empty string when unit or unit.mapServiceId is missing', () => {
      const unit = { mapServiceId: null };
      expect(getServiceMapUrl(unit)).toBe('');
    });
  });
});
