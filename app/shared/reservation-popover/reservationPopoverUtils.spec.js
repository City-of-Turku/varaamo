import moment from 'moment';

import { isDurationWithinLimits } from './reservationPopoverUtils';

describe('reservationPopoverUtils', () => {
  const begin = '2019-02-20T09:00:00';
  const end = '2019-02-20T10:30:00';
  const duration = moment.duration(moment(end).diff(moment(begin)));
  describe('isDurationWithinLimits', () => {
    test('return true when min and max are not defined', () => {
      expect(isDurationWithinLimits(duration, null, null)).toBe(true);
    });

    test('return true when duration is undefined', () => {
      expect(isDurationWithinLimits(null, null, null)).toBe(true);
    });

    describe('when minPeriod and maxPeriod are defined', () => {
      test('return true when duration is within limits', () => {
        expect(isDurationWithinLimits(duration, '01:30:00', '02:00:00')).toBe(true);
      });

      test('return false when duration is out of limits', () => {
        expect(isDurationWithinLimits(duration, '00:30:00', '01:00:00')).toBe(false);
        expect(isDurationWithinLimits(duration, '02:30:00', '03:00:00')).toBe(false);
      });
    });

    describe('when minPeriod is defined', () => {
      test('return true when duration is within limits', () => {
        expect(isDurationWithinLimits(duration, '01:30:00', null)).toBe(true);
      });

      test('return false when duration is out of limits', () => {
        expect(isDurationWithinLimits(duration, '02:30:00', null)).toBe(false);
      });
    });

    describe('when maxPeriod is defined', () => {
      test('return true when duration is within limits', () => {
        expect(isDurationWithinLimits(duration, null, '02:00:00')).toBe(true);
      });

      test('return false when duration is out of limits', () => {
        expect(isDurationWithinLimits(duration, null, '01:00:00')).toBe(false);
      });
    });
  });
});
