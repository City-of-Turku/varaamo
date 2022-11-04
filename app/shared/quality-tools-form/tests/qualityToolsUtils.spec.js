import constants from '../../../constants/AppConstants';
import { buildAPIUrl, getHeadersCreator } from '../../../utils/apiUtils';
import {
  checkQualityToolsLink, getFeedbackForm, getFormFieldText, getFormTitleText, postFeedback
} from '../qualityToolsUtils';

describe('app/shared/quality-tools-form/qualityToolsUtils', () => {
  describe('checkQualityToolsLink', () => {
    const testResult = { has_qualitytool: true };

    beforeAll(() => {
      global.fetch = jest.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(testResult),
      }));
    });

    afterAll(() => {
      fetch.mockClear();
    });

    test('calls fetch with correct params and handles result correctly', async () => {
      const resourceId = 123;
      const payload = { resource: resourceId };
      const request = { method: 'POST', headers: constants.REQUIRED_API_HEADERS, body: JSON.stringify(payload) };
      const result = await checkQualityToolsLink(resourceId);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch.mock.calls[0][0]).toBe(buildAPIUrl('qualitytool/check'));
      expect(fetch.mock.calls[0][1]).toStrictEqual(request);
      expect(result).toBe(true);
    });
  });

  describe('getFeedbackForm', () => {
    const testResult = { fi: { starsLabel: 'label fi' } };

    beforeAll(() => {
      global.fetch = jest.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(testResult),
      }));
    });

    afterAll(() => {
      fetch.mockClear();
    });

    test('calls fetch with correct params and handles result correctly', async () => {
      const state = { auth: { user: null } };
      const request = { method: 'GET', headers: getHeadersCreator()(state) };
      const result = await getFeedbackForm(state);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch.mock.calls[0][0]).toBe(buildAPIUrl('qualitytool/form'));
      expect(fetch.mock.calls[0][1]).toStrictEqual(request);
      expect(result).toBe(testResult);
    });
  });

  describe('postFeedback', () => {
    const testResult = { test: 'success' };

    beforeAll(() => {
      global.fetch = jest.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(testResult),
      }));
    });

    afterAll(() => {
      fetch.mockClear();
    });

    test('calls fetch with correct params and handles result correctly', async () => {
      const state = { auth: { user: null } };
      const reservationId = 123;
      const stars = 4;
      const feedbackText = 'some feedback';
      const payload = { reservation_id: reservationId, rating: stars, text: feedbackText };
      const request = {
        method: 'POST',
        headers: getHeadersCreator()(state),
        body: JSON.stringify(payload)
      };
      const result = await postFeedback(reservationId, stars, feedbackText, state);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch.mock.calls[0][0]).toBe(buildAPIUrl('qualitytool/feedback'));
      expect(fetch.mock.calls[0][1]).toStrictEqual(request);
      expect(result).toBe(testResult);
    });
  });

  describe('getFormFieldText', () => {
    const label = 'star rating label fi';
    const formData = {
      fi: {
        starRating: {
          label,
          hint: 'star rating hint fi',
        }
      }
    };
    const currentLanguage = 'fi';

    test('returns correct form string when currentLanguage and formData exists', () => {
      expect(getFormFieldText(formData, currentLanguage, 'starRating', 'label')).toBe(label);
    });

    test('returns an empty string when currentLanguage is missing', () => {
      expect(getFormFieldText(formData, undefined, 'starRating', 'label')).toBe('');
    });

    test('returns an empty string when formData is missing', () => {
      expect(getFormFieldText({}, currentLanguage, 'starRating', 'label')).toBe('');
    });
  });

  describe('getFormTitleText', () => {
    const label = 'star rating label fi';
    const title = 'title text fi';
    const formData = {
      fi: {
        starRating: {
          label,
          hint: 'star rating hint fi',
        },
        title
      }
    };
    const currentLanguage = 'fi';

    test('returns correct form string when currentLanguage and formData exists', () => {
      expect(getFormTitleText(formData, currentLanguage)).toBe(title);
    });

    test('returns an empty string when currentLanguage is missing', () => {
      expect(getFormTitleText(formData, undefined,)).toBe('');
    });

    test('returns an empty string when formData is missing', () => {
      expect(getFormTitleText({}, currentLanguage)).toBe('');
    });
  });
});
