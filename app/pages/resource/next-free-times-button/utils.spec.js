import moment from 'moment';

import Resource from '../../../utils/fixtures/Resource';
import {
  createFoundNotification,
  createNotFoundNotification,
  fetchResource,
  filterByReservableAfterBefore,
  formatToDateObject,
  getAllDatesOfWeek,
  getFutureOpeningHrs, getNextFreeTimes, getStartingDate, hasFreeTimesDesktop, hasFreeTimesMobile
} from './utils';

describe('next free times utils', () => {
  describe('getNextFreeTimes', () => {
    const resource = Resource.build({
      openingHours: [],
      reservations: [],
      minPeriod: '00:30:00',
      slotSize: '00:30:00',
      cooldown: '00:00:00',
    });

    test('returns empty string when fetched resource is falsy', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(null),
      });
      const selectedDate = '2040-01-01';
      const result = await getNextFreeTimes(selectedDate, resource);
      expect(result).toBe('');
    });

    test('returns empty string when date with free time is not found', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(resource),
      });
      const selectedDate = '2040-01-01';
      const result = await getNextFreeTimes(selectedDate, resource);
      expect(result).toBe('');
    });

    test('returns date when date with free times is found', async () => {
      const openingHours = [
        { date: '2050-01-02', opens: '2050-01-02T08:00:00+02:00', closes: '2050-01-02T18:00:00+02:00' },
      ];
      const testResource = { ...resource, openingHours };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(testResource),
      });
      const selectedDate = '2050-01-01';
      const result = await getNextFreeTimes(selectedDate, testResource);
      expect(result).toBe('2050-01-02');
    });
  });

  describe('getStartingDate', () => {
    test('returns the maximum date when reservableAfter is provided', () => {
      const selectedDate = '2050-01-01';
      const reservableAfter = '2050-02-01';
      const result = getStartingDate(selectedDate, reservableAfter);
      expect(result).toBe('2050-02-01');
    });

    test('returns the maximum date when reservableAfter is not provided', () => {
      const selectedDate = '2050-01-01';
      const result = getStartingDate(selectedDate);
      expect(result).toBe('2050-01-01');
    });

    test('returns the current date when selectedDate is in the past', () => {
      const selectedDate = '2022-01-01';
      const result = getStartingDate(selectedDate);
      const today = new Date().toISOString().split('T')[0];
      expect(result).toBe(today);
    });

    test('returns the same date when selectedDate and reservableAfter are the same', () => {
      const selectedDate = '2050-01-01';
      const reservableAfter = '2050-01-01';
      const result = getStartingDate(selectedDate, reservableAfter);
      expect(result).toBe('2050-01-01');
    });
  });

  describe('getFutureOpeningHrs', () => {
    const openingHrs = [
      { date: '2023-12-01', opens: '08:00', closes: '17:00' },
      { date: '2023-12-02', opens: '09:00', closes: '18:00' },
      { date: '2023-12-03', opens: '10:00', closes: '19:00' },
      { date: '2023-12-04', opens: null, closes: null },
    ];

    describe('returns correct date when', () => {
      test('reservableBefore is not given', () => {
        const result = getFutureOpeningHrs(openingHrs, '2023-12-02', null);
        expect(result.length).toBe(2);
        expect(result[0]).toBe(openingHrs[1]);
        expect(result[1]).toBe(openingHrs[2]);
      });

      test('reservableBefore is given', () => {
        const result = getFutureOpeningHrs(openingHrs, '2023-12-02', '2023-12-05');
        expect(result.length).toBe(2);
        expect(result[0]).toBe(openingHrs[1]);
        expect(result[1]).toBe(openingHrs[2]);
      });

      test('no opening hours after starting date', () => {
        const result = getFutureOpeningHrs(openingHrs, '2023-12-04', null);
        expect(result.length).toBe(0);
      });

      test('no opening hours before reservableBefore', () => {
        const result = getFutureOpeningHrs(openingHrs, '2023-12-02', '2023-12-02');
        expect(result.length).toBe(0);
      });

      test('all opening hours within range', () => {
        const result = getFutureOpeningHrs(openingHrs, '2023-11-30', '2023-12-05');
        expect(result.length).toBe(3);
        expect(result[0]).toBe(openingHrs[0]);
        expect(result[1]).toBe(openingHrs[1]);
        expect(result[2]).toBe(openingHrs[2]);
      });

      test('starting date and reservableBefore are same', () => {
        const result = getFutureOpeningHrs(openingHrs, '2023-12-01', '2023-12-01');
        expect(result.length).toBe(0);
      });
    });
  });

  describe('hasFreeTimesMobile', () => {
    const resource = Resource.build({
      openingHours: [
        { date: '2050-01-03', opens: null, closes: null },
        { date: '2050-01-04', opens: null, closes: null },
        { date: '2050-01-05', opens: null, closes: null },
        { date: '2050-01-06', opens: '2050-01-06T08:00:00+02:00', closes: '2050-01-06T18:00:00+02:00' },
        { date: '2050-01-07', opens: '2050-01-07T08:00:00+02:00', closes: '2050-01-07T18:00:00+02:00' },
        { date: '2050-01-08', opens: '2050-01-08T08:00:00+02:00', closes: '2050-01-08T18:00:00+02:00' },
        { date: '2050-01-09', opens: null, closes: null },
        { date: '2050-01-10', opens: null, closes: null },
      ],
      reservations: [],
      minPeriod: '00:30:00',
      slotSize: '00:30:00',
      cooldown: '00:00:00',

    });

    test('returns false when selected date is not in opening hours', () => {
      expect(hasFreeTimesMobile(resource, '2050-01-01')).toBe(false);
      expect(hasFreeTimesMobile(resource, '2050-01-15')).toBe(false);
    });

    test('returns false when no free times are found', () => {
      expect(hasFreeTimesMobile(resource, '2050-01-03')).toBe(false);
      expect(hasFreeTimesMobile(resource, '2050-01-09')).toBe(false);
    });

    test('returns true when free times are found', () => {
      expect(hasFreeTimesMobile(resource, '2050-01-04')).toBe(true);
      expect(hasFreeTimesMobile(resource, '2050-01-06')).toBe(true);
      expect(hasFreeTimesMobile(resource, '2050-01-08')).toBe(true);
    });
  });

  describe('hasFreeTimesDesktop', () => {
    const resource = Resource.build({
      openingHours: [],
      reservations: [],
      minPeriod: '00:30:00',
      slotSize: '00:30:00',
      cooldown: '00:00:00',
    });

    // create date range -7...dateMoment...+7
    const createOpeningHrs = (dateMoment, isClosed = false) => {
      const startDate = dateMoment.clone().subtract(7, 'days');
      const openingHours = [];
      for (let i = 0; i < 14; i += 1) {
        const nextDate = startDate.clone().add(i, 'days').format('YYYY-MM-DD');
        const opens = isClosed ? null : moment(`${nextDate}T01:00:00+02:00`).format();
        const closes = isClosed ? null : moment(`${nextDate}T23:00:00+02:00`).format();
        openingHours.push({ date: nextDate, opens, closes });
      }
      return openingHours;
    };

    test('returns false when selected date week is entirely in the past', () => {
      const lastWeek = moment().subtract(7, 'days');
      const testResource = { ...resource, openingHours: createOpeningHrs(lastWeek) };
      expect(hasFreeTimesDesktop(testResource, lastWeek.format('YYYY-MM-DD'))).toBe(false);
    });

    test('returns false when no free times are found', () => {
      const today = moment();
      const testResource = { ...resource, openingHours: createOpeningHrs(today, true) };
      expect(hasFreeTimesDesktop(testResource, today.format('YYYY-MM-DD'))).toBe(false);
    });

    test('returns true when free times are found', () => {
      const today = moment();
      const testResource = { ...resource, openingHours: createOpeningHrs(today) };
      expect(hasFreeTimesDesktop(testResource, today.format('YYYY-MM-DD'))).toBe(true);
    });
  });

  describe('getAllDatesOfWeek', () => {
    test('returns 7 days of week', () => {
      const today = moment().format('YYYY-MM-DD');
      const result = getAllDatesOfWeek(today);
      expect(result.length).toBe(7);
    });
  });

  describe('fetchResource', () => {
    const resource = Resource.build({
      openingHours: [],
      reservations: [],
      minPeriod: '00:30:00',
      slotSize: '00:30:00',
      cooldown: '00:00:00',
    });

    test('returns correct resource when response is ok', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(resource),
      });
      const selectedDate = '2040-01-01';
      const result = await fetchResource(resource.id, selectedDate);
      expect(result).toStrictEqual(resource);
    });

    test('returns null when response is not ok', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue(resource),
      });
      const selectedDate = '2040-01-01';
      const result = await fetchResource(resource.id, selectedDate);
      expect(result).toBe(null);
    });
  });

  describe('createNotFoundNotification', () => {
    const t = (text) => text;
    const mockAddNotification = jest.fn();

    test('creates a notification with the correct message and type', () => {
      createNotFoundNotification(mockAddNotification, t);
      expect(mockAddNotification).toHaveBeenCalledWith({
        message: 'ResourceFreeTime.notificationNotFound',
        type: 'info',
        timeOut: 10000,
      });
    });
  });

  describe('createFoundNotification', () => {
    const t = (text) => text;
    const mockAddNotification = jest.fn();
    const date = '2026-01-01';

    test('creates a notification with the correct message and type', () => {
      createFoundNotification(mockAddNotification, t, date);
      expect(mockAddNotification).toHaveBeenCalledWith({
        message: `${t('ResourceFreeTime.notificationFound torstai 1.1')}`,
        type: 'info',
        timeOut: 10000,
      });
    });
  });

  describe('formatToDateObject', () => {
    test('formats a valid date string to a Date object', () => {
      const dateString = '2026-01-01';
      const result = formatToDateObject(dateString);
      expect(result).toEqual(new Date(dateString));
    });
  });

  describe('filterByReservableAfterBefore', () => {
    const openingHours = [
      { date: '2050-01-03', opens: null, closes: null },
      { date: '2050-01-04', opens: null, closes: null },
      { date: '2050-01-05', opens: null, closes: null },
      { date: '2050-01-06', opens: '2050-01-06T08:00:00+02:00', closes: '2050-01-06T18:00:00+02:00' },
      { date: '2050-01-07', opens: '2050-01-07T08:00:00+02:00', closes: '2050-01-07T18:00:00+02:00' },
      { date: '2050-01-08', opens: '2050-01-08T08:00:00+02:00', closes: '2050-01-08T18:00:00+02:00' },
      { date: '2050-01-09', opens: null, closes: null },
      { date: '2050-01-10', opens: null, closes: null },
    ];

    test('returns same opening hours as given when reservable after and before are not given', () => {
      expect(filterByReservableAfterBefore(openingHours, null, undefined)).toBe(openingHours);
    });

    test('filters out dates without open time', () => {
      const reservableAfter = '2050-01-01T08:00:00+02:00';
      const expected = [openingHours[3], openingHours[4], openingHours[5]];
      expect(filterByReservableAfterBefore(
        openingHours, reservableAfter, undefined)).toStrictEqual(expected);
    });

    test('returns correct opening hours with after and before limiters', () => {
      const reservableAfter = '2050-01-06T08:00:00+02:00';
      const reservableBefore = '2050-01-08T00:00:00+02:00';
      const expected = [openingHours[3], openingHours[4]];
      expect(filterByReservableAfterBefore(
        openingHours, reservableAfter, reservableBefore)).toStrictEqual(expected);
    });
  });
});
