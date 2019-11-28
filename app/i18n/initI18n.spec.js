import constants from 'constants/AppConstants';

import * as persistState from 'store/middleware/persistState';
import enMessages from 'i18n/messages/en.json';
import fiMessages from 'i18n/messages/fi.json';
import svMessages from 'i18n/messages/sv.json';
import initI18n from './initI18n';

describe('initI18n', () => {
  const messages = {
    en: enMessages,
    fi: fiMessages,
    se: svMessages,
  };

  test('calls loadPersistedLocale', () => {
    persistState.loadPersistedLocale = jest.fn();
    initI18n();
    expect(persistState.loadPersistedLocale.mock.calls.length).toBe(1);
  });

  describe('returns correct initial state', () => {
    const { navigator } = window;

    beforeAll(() => {
      delete window.navigator;
    });

    afterAll(() => {
      window.navigator = navigator;
    });

    test('when persisted language data exists', () => {
      window.navigator = { language: 'fi' };
      persistState.loadPersistedLocale.mockReturnValueOnce('se');
      const expected = {
        intl: {
          defaultLocale: constants.DEFAULT_LOCALE,
          locale: 'se',
          messages: messages.se,
        },
      };

      expect(initI18n()).toEqual(expected);
    });

    test('when window.navigator.language is sv', () => {
      window.navigator = { language: 'sv' };
      const expected = {
        intl: {
          defaultLocale: constants.DEFAULT_LOCALE,
          locale: 'se',
          messages: messages.se,
        },
      };

      expect(initI18n()).toEqual(expected);
    });

    test('when window.navigator.language is en', () => {
      window.navigator = { language: 'en' };
      const expected = {
        intl: {
          defaultLocale: constants.DEFAULT_LOCALE,
          locale: 'en',
          messages: messages.en,
        },
      };

      expect(initI18n()).toEqual(expected);
    });

    test('when window.navigator.language is fi', () => {
      window.navigator = { language: 'fi' };
      const expected = {
        intl: {
          defaultLocale: constants.DEFAULT_LOCALE,
          locale: 'fi',
          messages: messages.fi,
        },
      };

      expect(initI18n()).toEqual(expected);
    });

    test('when window.navigator.language is other than the ones defined for Varaamo', () => {
      window.navigator = { language: 'some-other-language-code' };
      const expected = {
        intl: {
          defaultLocale: constants.DEFAULT_LOCALE,
          locale: constants.DEFAULT_LOCALE,
          messages: messages[constants.DEFAULT_LOCALE],
        },
      };

      expect(initI18n()).toEqual(expected);
    });
  });
});
