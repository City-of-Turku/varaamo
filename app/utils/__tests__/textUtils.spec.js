import { cleanseNamedLinks, createTextSnippet, capitalizeFirst } from 'utils/textUtils';

describe('Utils: textUtils', () => {
  describe('cleanseNamedLinks', () => {
    test('replaces all named links with only the link names', () => {
      const testText = 'text and [named link](https://www.google.com) and text again and [link](url)';
      const expectedResult = 'text and named link and text again and link';
      expect(cleanseNamedLinks(testText)).toEqual(expectedResult);
    });
    test('returns an empty string if the given text is an empty string', () => {
      expect(cleanseNamedLinks('')).toEqual('');
    });
  });

  describe('createTextSnippet', () => {
    test('if given string is null, returns empty string', () => {
      const nullString = null;
      expect(createTextSnippet(nullString, 100)).toEqual('');
    });
    test('if given string is shorter than given length, returns same given string', () => {
      const testString = 'this is a test string';
      expect(createTextSnippet(testString, 100)).toEqual(testString);
    });
    test('if given string is longer than given length, returns string of given length with added dots', () => {
      const testString = 'this is a test string';
      expect(createTextSnippet(testString, 4)).toEqual('this...');
    });
  });

  describe('capitalizeFirst', () => {
    test('returns correct capitalized string', () => {
      expect(capitalizeFirst('test')).toEqual('Test');
      expect(capitalizeFirst('test string')).toEqual('Test string');
      expect(capitalizeFirst('Test String')).toEqual('Test String');
      expect(capitalizeFirst('tEST sTRING')).toEqual('TEST sTRING');
    });
  });
});
