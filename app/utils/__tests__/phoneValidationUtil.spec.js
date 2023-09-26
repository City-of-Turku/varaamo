import { isValidPhoneNumber } from '../phoneValidationUtil';

describe('Utils: phoneValidationUtil', () => {
  describe('isValidPhoneNumber', () => {
    describe('when number contains non numbers excluding first + char', () => {
      describe('returns false', () => {
        test('when number is empty', () => {
          expect(isValidPhoneNumber('')).toBe(false);
        });

        test('when number without + contains non number', () => {
          expect(isValidPhoneNumber('123-123123')).toBe(false);
        });

        test('when number with + contains non number', () => {
          expect(isValidPhoneNumber('+123-123123')).toBe(false);
        });
      });
    });

    describe('when number does not contains non numbers excluding first + char', () => {
      describe('returns false', () => {
        test('when number with + isnt valid', () => {
          expect(isValidPhoneNumber('+12365645645645645645645')).toBe(false);
        });

        test('when number without + isnt valid', () => {
          expect(isValidPhoneNumber('12')).toBe(false);
        });
      });
      describe('returns true', () => {
        test('when number with + is valid', () => {
          expect(isValidPhoneNumber('+35840123123')).toBe(true);
        });

        test('when number without + is valid', () => {
          expect(isValidPhoneNumber('04012312312')).toBe(true);
        });
      });
    });
  });
});

