import {
  calcPossibleTimes, formatTime, isValidSelection, isValidTime
} from './availabilityTimelineUtils';

describe('availabilityTimelineUtils', () => {
  describe('calcPossibleTimes', () => {
    test('should return an empty array if slotSize or startTime is not provided', () => {
      expect(calcPossibleTimes()).toEqual([]);
      expect(calcPossibleTimes('01:00')).toEqual([]);
      expect(calcPossibleTimes(null, '2024-06-27T08:00:00+03:00')).toEqual([]);
    });

    test('should calculate correct time slots for 1-hour intervals starting at 8:00', () => {
      const result = calcPossibleTimes('01:00', '2024-06-27T08:00:00+03:00');
      expect(result).toEqual([
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
        '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
      ]);
    });

    test('should calculate correct time slots for 30-minute intervals starting at 9:30', () => {
      const result = calcPossibleTimes('00:30', '2024-06-27T09:30:00+03:00');
      expect(result).toEqual([
        '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00',
        '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
        '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
        '21:30', '22:00', '22:30', '23:00', '23:30'
      ]);
    });

    test('should handle slot sizes that do not evenly divide the day', () => {
      const result = calcPossibleTimes('01:20', '2024-06-27T00:00:00+03:00');
      expect(result).toEqual([
        '00:00', '01:20', '02:40', '04:00', '05:20', '06:40', '08:00', '09:20',
        '10:40', '12:00', '13:20', '14:40', '16:00', '17:20', '18:40', '20:00',
        '21:20', '22:40'
      ]);
    });

    test('should handle start times close to midnight', () => {
      const result = calcPossibleTimes('01:00', '2024-06-27T23:00:00+03:00');
      expect(result).toEqual(['23:00']);
    });
  });

  describe('formatTime', () => {
    test('should format midnight correctly', () => {
      const date = new Date('2024-06-27T00:00:00');
      expect(formatTime(date)).toBe('00:00');
    });

    test('should format noon correctly', () => {
      const date = new Date('2024-06-27T12:00:00');
      expect(formatTime(date)).toBe('12:00');
    });

    test('should format single-digit hours correctly', () => {
      const date = new Date('2024-06-27T09:30:00');
      expect(formatTime(date)).toBe('09:30');
    });

    test('should format single-digit minutes correctly', () => {
      const date = new Date('2024-06-27T14:05:00');
      expect(formatTime(date)).toBe('14:05');
    });

    test('should format time with double-digit hours and minutes correctly', () => {
      const date = new Date('2024-06-27T23:59:00');
      expect(formatTime(date)).toBe('23:59');
    });

    test('should handle Date objects with milliseconds', () => {
      const date = new Date('2024-06-27T18:30:45.500');
      expect(formatTime(date)).toBe('18:30');
    });
  });

  describe('isValidTime', () => {
    const possibleTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];

    test('should return true if timestamp is null or undefined', () => {
      expect(isValidTime(null, possibleTimes)).toBe(true);
      expect(isValidTime(undefined, possibleTimes)).toBe(true);
    });

    test('should return true if possibleTimes is null or undefined', () => {
      expect(isValidTime('2024-06-27T10:00:00', null)).toBe(true);
      expect(isValidTime('2024-06-27T10:00:00', undefined)).toBe(true);
    });

    test('should return true if timestamp is in possibleTimes', () => {
      expect(isValidTime('2024-06-27T10:00:00', possibleTimes)).toBe(true);
      expect(isValidTime('2024-06-27T13:00:00', possibleTimes)).toBe(true);
    });

    test('should return false if timestamp is not in possibleTimes', () => {
      expect(isValidTime('2024-06-27T09:30:00', possibleTimes)).toBe(false);
      expect(isValidTime('2024-06-27T15:00:00', possibleTimes)).toBe(false);
    });

    test('should handle timestamps with different dates but valid times', () => {
      expect(isValidTime('2023-01-01T11:00:00', possibleTimes)).toBe(true);
      expect(isValidTime('2025-12-31T14:00:00', possibleTimes)).toBe(true);
    });

    test('should handle timestamps with milliseconds', () => {
      expect(isValidTime('2024-06-27T12:00:00.500', possibleTimes)).toBe(true);
      expect(isValidTime('2024-06-27T12:30:00.500', possibleTimes)).toBe(false);
    });

    test('should handle timestamps with different timezones', () => {
      expect(isValidTime('2024-06-27T10:00:00+03:00', possibleTimes)).toBe(true);
      expect(isValidTime('2024-06-27T07:00:00Z', possibleTimes)).toBe(true);
    });

    test('should return false for invalid date strings', () => {
      expect(isValidTime('invalid-date', possibleTimes)).toBe(false);
    });

    test('should handle empty possibleTimes array', () => {
      expect(isValidTime('2024-06-27T10:00:00', [])).toBe(false);
    });
  });

  describe('isValidSelection', () => {
    const possibleTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];

    test('should return true if both start and end times are valid', () => {
      const selection = { begin: '2024-06-27T10:00:00', end: '2024-06-27T12:00:00' };
      expect(isValidSelection(selection, possibleTimes)).toBe(true);
    });

    test('should return false if start time is invalid', () => {
      const selection = { begin: '2024-06-27T09:30:00', end: '2024-06-27T12:00:00' };
      expect(isValidSelection(selection, possibleTimes)).toBe(false);
    });

    test('should return false if end time is invalid', () => {
      const selection = { begin: '2024-06-27T10:00:00', end: '2024-06-27T12:30:00' };
      expect(isValidSelection(selection, possibleTimes)).toBe(false);
    });

    test('should return false if both start and end times are invalid', () => {
      const selection = { begin: '2024-06-27T09:30:00', end: '2024-06-27T12:30:00' };
      expect(isValidSelection(selection, possibleTimes)).toBe(false);
    });

    test('should return true if selection is null or undefined', () => {
      expect(isValidSelection(null, possibleTimes)).toBe(true);
      expect(isValidSelection(undefined, possibleTimes)).toBe(true);
    });

    test('should return true if selection is missing begin or end', () => {
      expect(isValidSelection({ begin: '2024-06-27T10:00:00' }, possibleTimes)).toBe(true);
      expect(isValidSelection({ end: '2024-06-27T12:00:00' }, possibleTimes)).toBe(true);
    });

    test('should return true if possibleTimes is null or undefined', () => {
      const selection = { begin: '2024-06-27T10:00:00', end: '2024-06-27T12:00:00' };
      expect(isValidSelection(selection, null)).toBe(true);
      expect(isValidSelection(selection, undefined)).toBe(true);
    });

    test('should handle empty possibleTimes array', () => {
      const selection = { begin: '2024-06-27T10:00:00', end: '2024-06-27T12:00:00' };
      expect(isValidSelection(selection, [])).toBe(false);
    });

    test('should handle different dates with valid times', () => {
      const selection = { begin: '2023-01-01T11:00:00', end: '2025-12-31T14:00:00' };
      expect(isValidSelection(selection, possibleTimes)).toBe(true);
    });

    test('should handle timestamps with milliseconds', () => {
      const selection = { begin: '2024-06-27T10:00:00.500', end: '2024-06-27T12:00:00.500' };
      expect(isValidSelection(selection, possibleTimes)).toBe(true);
    });
  });
});
