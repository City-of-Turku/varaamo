import {
  FORM_ERRORS, mapResourceOptions, sendMassCancel, validateForm
} from '../massCancelUtils';

describe('massCancelUtils', () => {
  describe('mapResourceOptions', () => {
    test('returns an empty array if resources is undefined', () => {
      expect(mapResourceOptions(undefined)).toEqual([]);
    });

    test('returns an empty array if resources is null', () => {
      expect(mapResourceOptions(null)).toEqual([]);
    });

    test('returns an array of objects with the correct properties', () => {
      const resources = [{ id: 1, name: 'Resource 1' }, { id: 2, name: 'Resource 2' }];
      const expectedOutput = [
        { value: 1, label: 'Resource 1' },
        { value: 2, label: 'Resource 2' }
      ];
      expect(mapResourceOptions(resources)).toEqual(expectedOutput);
    });
  });

  describe('validateForm', () => {
    test('returns an empty object if all fields are valid', () => {
      const values = {
        selectedResource: 1,
        startDate: '2020-01-01',
        endDate: '2020-01-02',
        confirmCancel: true
      };
      expect(validateForm(values)).toEqual({});
    });
    test('returns an object with errors if any fields are invalid', () => {
      const values = {
        selectedResource: undefined,
        startDate: undefined,
        endDate: undefined,
        confirmCancel: undefined
      };
      expect(validateForm(values)).toEqual({
        selectedResource: FORM_ERRORS.requiredResource,
        startDate: FORM_ERRORS.requiredStart,
        endDate: FORM_ERRORS.requiredEnd,
        confirmCancel: FORM_ERRORS.confirmCancel
      });

      const values2 = {
        selectedResource: 1,
        startDate: '2020-01-01',
        endDate: '2020-01-01',
        confirmCancel: undefined
      };
      expect(validateForm(values2)).toEqual({
        confirmCancel: FORM_ERRORS.confirmCancel,
        endDate: FORM_ERRORS.endBeforeStart,
        startDate: FORM_ERRORS.startAfterEnd
      });
    });
  });

  describe('sendMassCancel', () => {
    test('returns an object with errorOccurred set to true if an error occurs', () => {
      global.fetch = jest.fn(() => Promise.resolve({
        ok: false,
        status: 500,
      }));
      const resourceId = 1;
      const begin = '2020-01-01';
      const end = '2020-01-02';
      const state = {
        auth: {
          user: {
            id_token: 'token'
          }
        }
      };
      const expectedOutput = { errorOccurred: true, code: 500 };
      expect(sendMassCancel(resourceId, begin, end, state)).resolves.toEqual(expectedOutput);
    });

    test('returns an object with errorOccurred set to false if no error occurs', () => {
      global.fetch = jest.fn(() => Promise.resolve({
        ok: true,
        status: 200,
      }));
      const resourceId = 1;
      const begin = '2020-01-01';
      const end = '2020-01-02';
      const state = {
        auth: {
          user: {
            id_token: 'token'
          }
        }
      };
      const expectedOutput = { errorOccurred: false, code: 200 };
      expect(sendMassCancel(resourceId, begin, end, state)).resolves.toEqual(expectedOutput);
    });
  });
});
