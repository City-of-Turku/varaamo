import {
  getItemStyle, getListStyle, getResourceIDs, sendResourceOrder, sortResources
} from '../resourceOrderUtils';

describe('resourceOrderUtils', () => {
  describe('sendResourceOrder', () => {
    test('returns an object with errorOccurred set to true if an error occurs', () => {
      global.fetch = jest.fn(() => Promise.resolve({
        ok: false,
        status: 500,
      }));
      const resourceIDs = [];
      const state = {
        auth: {
          user: {
            id_token: 'token'
          }
        }
      };
      const expectedOutput = { errorOccurred: true, code: 500 };
      expect(sendResourceOrder(resourceIDs, state)).resolves.toEqual(expectedOutput);
    });

    test('returns an object with errorOccurred set to false if no error occurs', () => {
      global.fetch = jest.fn(() => Promise.resolve({
        ok: true,
        status: 200,
      }));
      const resourceIDs = [];
      const state = {
        auth: {
          user: {
            id_token: 'token'
          }
        }
      };
      const expectedOutput = { errorOccurred: false, code: 200 };
      expect(sendResourceOrder(resourceIDs, state)).resolves.toEqual(expectedOutput);
    });
  });

  describe('getResourceIDs', () => {
    test('returns an array of resource IDs', () => {
      const resources = [
        { id: 'abc1', name: 'resource 1' },
        { id: 'abc2', name: 'resource 2' },
      ];
      const expectedOutput = ['abc1', 'abc2'];
      expect(getResourceIDs(resources)).toEqual(expectedOutput);
      expect(getResourceIDs([])).toEqual([]);
    });
  });

  describe('sortResources', () => {
    test('returns an array of resources sorted by name', () => {
      const resources = [
        { id: 'abcb', name: 'resource b' },
        { id: 'abcc', name: 'resource c' },
        { id: 'abca', name: 'resource a' },
        { id: 'abcd', name: 'resource d' },
      ];

      expect(sortResources(resources, [])).toEqual([
        { id: 'abca', name: 'resource a' },
        { id: 'abcb', name: 'resource b' },
        { id: 'abcc', name: 'resource c' },
        { id: 'abcd', name: 'resource d' },
      ]);

      expect(sortResources(resources, ['abcb', 'abcc'])).toEqual([
        { id: 'abcb', name: 'resource b' },
        { id: 'abcc', name: 'resource c' },
        { id: 'abca', name: 'resource a' },
        { id: 'abcd', name: 'resource d' },
      ]);

      expect(sortResources(resources, ['abcb', 'abcc', 'abcd', 'abca'])).toEqual([
        { id: 'abcb', name: 'resource b' },
        { id: 'abcc', name: 'resource c' },
        { id: 'abcd', name: 'resource d' },
        { id: 'abca', name: 'resource a' },
      ]);

      expect(sortResources(resources, ['not-included', 'abcb'])).toEqual([
        { id: 'abcb', name: 'resource b' },
        { id: 'abca', name: 'resource a' },
        { id: 'abcc', name: 'resource c' },
        { id: 'abcd', name: 'resource d' },
      ]);
    });
  });

  describe('getItemStyle', () => {
    test('returns correct style obj', () => {
      expect(getItemStyle(false, { color: 'red' })).toStrictEqual({
        background: 'white',
        color: 'red',
        left: 'auto !important',
        margin: '0 0 8px 0',
        padding: 16,
        top: 'auto !important',
        userSelect: 'none',
      });
      expect(getItemStyle(true, { color: 'red' })).toStrictEqual({
        background: 'lightgreen',
        color: 'red',
        left: 'auto !important',
        margin: '0 0 8px 0',
        padding: 16,
        top: 'auto !important',
        userSelect: 'none',
      });
    });
  });

  describe('getListStyle', () => {
    test('returns correct style obj', () => {
      expect(getListStyle()).toStrictEqual({
        background: 'lightgrey',
        padding: 8,
        width: 'auto'
      });
    });
  });
});
