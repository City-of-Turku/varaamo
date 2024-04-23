import moment from 'moment';

import {
  areDatesSameAsInitialDates,
  filterSelectedReservation,
  findFirstClosedDay,
  findFirstClosestReservation,
  findPrevFirstClosedDay,
  findPrevFirstClosestReservation,
  getClosedDays,
  getFirstBlockedDay,
  getHoursMinutesSeconds,
  getNotSelectableNotificationText,
  getNotificationText,
  getOvernightDatetime,
  getReservationUrl,
  getSelectedDuration,
  handleDateSelect,
  handleDisableDays,
  handleFormattingSelected,
  isDurationBelowMin,
  isOverMaxPeriod,
  isReservingAllowed,
  nextDayBookedModifier,
  nextDayClosedModifier,
  prevDayBookedModifier,
  prevDayClosedModifier,
  reservationsModifier,
  setDatesTime
} from '../overnightUtils';
import Reservation from '../../../utils/fixtures/Reservation';
import Resource from '../../../utils/fixtures/Resource';

describe('app/shared/overnight-calendar/overnightUtils', () => {
  describe('handleDateSelect', () => {
    test('returns undefined when value if falsy', () => {
      expect(handleDateSelect({ value: null })).toBeUndefined();
    });

    test('sets startDate when value is not set', () => {
      const setStartDate = jest.fn();
      const val = new Date();
      const overnightStartTime = '11:00:00';
      const expectedCall = setDatesTime(val, overnightStartTime).toDate();
      handleDateSelect({
        value: val, startDate: null, setStartDate, overnightStartTime
      });
      expect(setStartDate).toHaveBeenCalled();
      expect(setStartDate).toHaveBeenCalledWith(expectedCall);
    });

    test('sets startDate and endDate to null if start is selected and same as value', () => {
      const setStartDate = jest.fn();
      const setEndDate = jest.fn();
      const overnightStartTime = '11:00:00';
      const date = setDatesTime(new Date(), overnightStartTime).toDate();
      handleDateSelect({
        value: date, startDate: date, setStartDate, setEndDate, overnightStartTime
      });
      expect(setStartDate).toHaveBeenCalled();
      expect(setStartDate).toHaveBeenCalledWith(null);
      expect(setEndDate).toHaveBeenCalled();
      expect(setEndDate).toHaveBeenCalledWith(null);
    });

    test('sets endDate if startDate already set, value is not same as start and endDate not set', () => {
      const setStartDate = jest.fn();
      const setEndDate = jest.fn();
      const overnightStartTime = '11:00:00';
      const overnightEndTime = '13:00:00';
      const val = new Date();
      const start = new Date('2024-02-21');
      const expectedCall = setDatesTime(val, overnightEndTime).toDate();
      handleDateSelect({
        value: val,
        startDate: start,
        setStartDate,
        setEndDate,
        overnightStartTime,
        overnightEndTime
      });
      expect(setEndDate).toHaveBeenCalled();
      expect(setEndDate).toHaveBeenCalledWith(expectedCall);
    });

    test('sets startDate and endDate to null if start and end are selected and end is same as value', () => {
      const setStartDate = jest.fn();
      const setEndDate = jest.fn();
      const overnightStartTime = '11:00:00';
      const overnightEndTime = '13:00:00';
      const val = new Date();
      const start = new Date('2024-02-21');
      const end = setDatesTime(val, overnightEndTime).toDate();
      handleDateSelect({
        value: val,
        startDate: start,
        endDate: end,
        setStartDate,
        setEndDate,
        overnightStartTime,
        overnightEndTime
      });
      expect(setStartDate).toHaveBeenCalled();
      expect(setStartDate).toHaveBeenCalledWith(null);
      expect(setEndDate).toHaveBeenCalled();
      expect(setEndDate).toHaveBeenCalledWith(null);
    });
  });

  describe('handleDisableDays', () => {
    const now = moment('2024-04-20');
    const day = now.toDate();
    const reservable = true;
    const reservableAfter = '2024-04-19T00:00:00+03:00';
    const reservableBefore = '2024-04-29T00:00:00+03:00';
    const startDate = null;
    const openingHours = [
      { date: '2024-04-19', closes: null, opens: null },
      { date: '2024-04-20', closes: '2024-04-20T20:00:00+03:00', opens: '2024-04-20T06:00:00+03:00' },
      { date: '2024-04-21', closes: '2024-04-21T20:00:00+03:00', opens: '2024-04-21T06:00:00+03:00' },
      { date: '2024-04-22', closes: '2024-04-22T20:00:00+03:00', opens: '2024-04-22T06:00:00+03:00' },
      { date: '2024-04-23', closes: '2024-04-23T20:00:00+03:00', opens: '2024-04-23T06:00:00+03:00' },
      { date: '2024-04-24', closes: '2024-04-24T20:00:00+03:00', opens: '2024-04-24T06:00:00+03:00' },
      { date: '2024-04-25', closes: '2024-04-25T20:00:00+03:00', opens: '2024-04-25T06:00:00+03:00' },
      { date: '2024-04-26', closes: '2024-04-26T20:00:00+03:00', opens: '2024-04-26T06:00:00+03:00' },
      { date: '2024-04-27', closes: '2024-04-27T20:00:00+03:00', opens: '2024-04-27T06:00:00+03:00' },
      { date: '2024-04-28', closes: '2024-04-28T20:00:00+03:00', opens: '2024-04-28T06:00:00+03:00' },
      { date: '2024-04-29', closes: '2024-04-29T20:00:00+03:00', opens: '2024-04-29T06:00:00+03:00' },
      { date: '2024-04-30', closes: null, opens: null },
    ];
    const reservations = [
      Reservation.build({ begin: '2024-04-23T13:00:00+03:00', end: '2024-04-24T09:00:00+03:00' })
    ];
    const maxPeriod = '3 00:00:00';
    const overnightEndTime = '09:00:00';
    const overnightStartTime = '13:00:00';
    const hasAdminBypass = false;
    const params = {
      now,
      day,
      reservable,
      reservableAfter,
      reservableBefore,
      startDate,
      openingHours,
      reservations,
      maxPeriod,
      overnightEndTime,
      overnightStartTime,
      hasAdminBypass
    };

    test('returns false with correct params', () => {
      expect(handleDisableDays(params)).toBe(false);
    });

    describe('returns true when', () => {
      test('no admin bypass and not reservable', () => {
        expect(handleDisableDays(
          { ...params, hasAdminBypass: false, reservable: false }
        )).toBe(true);
      });

      test('now is after given day', () => {
        expect(handleDisableDays(
          {
            ...params,
            now: moment('2024-04-21')
          }
        )).toBe(true);
      });

      test('day is before reservable after limit', () => {
        expect(handleDisableDays(
          {
            ...params,
            reservableAfter: '2024-04-21T01:00:00+03:00'
          }
        )).toBe(true);
      });

      test('day is after reservable before limit', () => {
        expect(handleDisableDays(
          {
            ...params,
            day: moment('2024-04-29').toDate(),
            reservableBefore: '2024-04-28T01:00:00+03:00'
          }
        )).toBe(true);
      });

      test('day is before selected start date', () => {
        expect(handleDisableDays(
          {
            ...params,
            day: moment('2024-04-24').toDate(),
            startDate: moment('2024-04-26').toDate(),
          }
        )).toBe(true);
      });

      test('day has reservation', () => {
        expect(handleDisableDays(
          {
            ...params,
            day: moment('2024-04-23').toDate(),
          }
        )).toBe(true);
      });

      test('day is closed', () => {
        expect(handleDisableDays(
          {
            ...params,
            day: moment('2024-04-19').toDate(),
          }
        )).toBe(true);
      });

      test('day is over max reservation time', () => {
        expect(handleDisableDays(
          {
            ...params,
            day: moment('2024-04-29').toDate(),
            startDate: moment('2024-04-25').toDate(),
          }
        )).toBe(true);
      });

      test('day is after a reservation or closed day when startDate is selected', () => {
        expect(handleDisableDays(
          {
            ...params,
            maxPeriod: '10 00:00:00',
            day: moment('2024-04-25').toDate(),
            startDate: moment('2024-04-22').toDate(),
          }
        )).toBe(true);
      });
    });
  });

  describe('isOverMaxPeriod', () => {
    const overnightEndTime = '09:00:00';
    const overnightStartTime = '13:00:00';
    const startDate = moment('2024-04-20').toDate();
    const endDate = moment('2024-04-22').toDate();

    test('returns false when not over max period', () => {
      expect(isOverMaxPeriod(
        startDate, endDate, '10 00:00:00', overnightEndTime, overnightStartTime
      )).toBe(false);
    });

    test('returns true when over max period', () => {
      expect(isOverMaxPeriod(
        startDate, endDate, '1 10:00:00', overnightEndTime, overnightStartTime
      )).toBe(true);
    });
  });

  describe('getClosedDays', () => {
    test('returns closed days', () => {
      const openingHours = [
        { date: '2024-04-19', closes: null, opens: null },
        { date: '2024-04-20', closes: '2024-04-20T20:00:00+03:00', opens: '2024-04-20T06:00:00+03:00' },
        { date: '2024-04-21', closes: '2024-04-21T20:00:00+03:00', opens: '2024-04-21T06:00:00+03:00' },
        { date: '2024-04-22', closes: '2024-04-22T20:00:00+03:00', opens: '2024-04-22T06:00:00+03:00' },
        { date: '2024-04-23', closes: '2024-04-23T20:00:00+03:00', opens: '2024-04-23T06:00:00+03:00' },
        { date: '2024-04-24', closes: null, opens: null },
      ];
      expect(getClosedDays(openingHours)).toStrictEqual([openingHours[0], openingHours[5]]);
    });
  });

  describe('reservationsModifier', () => {
    const reservations = [
      Reservation.build({ begin: '2024-04-23T13:00:00+03:00', end: '2024-04-24T09:00:00+03:00' })
    ];
    test('returns true when day has reservation', () => {
      expect(reservationsModifier(
        moment('2024-04-23').toDate(), reservations)).toBe(true);
      expect(reservationsModifier(
        moment('2024-04-24').toDate(), reservations)).toBe(true);
    });

    test('returns false when day has no reservation', () => {
      expect(reservationsModifier(
        moment('2024-04-22').toDate(), reservations)).toBe(false);
      expect(reservationsModifier(
        moment('2024-04-25').toDate(), reservations)).toBe(false);
    });
  });

  describe('nextDayBookedModifier', () => {
    const reservations = [
      Reservation.build({ begin: '2024-04-23T13:00:00+03:00', end: '2024-04-24T09:00:00+03:00' })
    ];
    test('returns true when next day has reservation', () => {
      expect(nextDayBookedModifier(
        moment('2024-04-22').toDate(), reservations)).toBe(true);
    });

    test('returns false when next day has no reservation', () => {
      expect(nextDayBookedModifier(
        moment('2024-04-20').toDate(), reservations)).toBe(false);
      expect(nextDayBookedModifier(
        moment('2024-04-24').toDate(), reservations)).toBe(false);
    });
  });

  describe('prevDayBookedModifier', () => {
    const reservations = [
      Reservation.build({ begin: '2024-04-23T13:00:00+03:00', end: '2024-04-24T09:00:00+03:00' })
    ];
    test('returns true when previous day has reservation', () => {
      expect(prevDayBookedModifier(
        moment('2024-04-25').toDate(), reservations)).toBe(true);
    });

    test('returns false when previous day has no reservation', () => {
      expect(prevDayBookedModifier(
        moment('2024-04-21').toDate(), reservations)).toBe(false);
      expect(prevDayBookedModifier(
        moment('2024-04-23').toDate(), reservations)).toBe(false);
    });
  });

  describe('nextDayClosedModifier', () => {
    const openingHours = [
      { date: '2024-04-19', closes: null, opens: null },
      { date: '2024-04-20', closes: '2024-04-20T20:00:00+03:00', opens: '2024-04-20T06:00:00+03:00' },
      { date: '2024-04-21', closes: '2024-04-21T20:00:00+03:00', opens: '2024-04-21T06:00:00+03:00' },
      { date: '2024-04-22', closes: '2024-04-22T20:00:00+03:00', opens: '2024-04-22T06:00:00+03:00' },
      { date: '2024-04-23', closes: '2024-04-23T20:00:00+03:00', opens: '2024-04-23T06:00:00+03:00' },
      { date: '2024-04-24', closes: null, opens: null },
    ];
    test('returns true when next day is closed', () => {
      expect(nextDayClosedModifier(
        moment('2024-04-23').toDate(), openingHours)).toBe(true);
    });

    test('returns false when next day is not closed', () => {
      expect(nextDayClosedModifier(
        moment('2024-04-20').toDate(), openingHours)).toBe(false);
      expect(nextDayClosedModifier(
        moment('2024-04-24').toDate(), openingHours)).toBe(false);
    });
  });

  describe('prevDayClosedModifier', () => {
    const openingHours = [
      { date: '2024-04-19', closes: null, opens: null },
      { date: '2024-04-20', closes: '2024-04-20T20:00:00+03:00', opens: '2024-04-20T06:00:00+03:00' },
      { date: '2024-04-21', closes: '2024-04-21T20:00:00+03:00', opens: '2024-04-21T06:00:00+03:00' },
      { date: '2024-04-22', closes: '2024-04-22T20:00:00+03:00', opens: '2024-04-22T06:00:00+03:00' },
      { date: '2024-04-23', closes: '2024-04-23T20:00:00+03:00', opens: '2024-04-23T06:00:00+03:00' },
      { date: '2024-04-24', closes: null, opens: null },
    ];
    test('returns true when previous day is closed', () => {
      expect(prevDayClosedModifier(
        moment('2024-04-20').toDate(), openingHours)).toBe(true);
    });

    test('returns false when previous day is not closed', () => {
      expect(prevDayClosedModifier(
        moment('2024-04-21').toDate(), openingHours)).toBe(false);
      expect(prevDayClosedModifier(
        moment('2024-04-24').toDate(), openingHours)).toBe(false);
    });
  });

  describe('findFirstClosedDay', () => {
    test('returns first closed day', () => {
      const openingHours = [
        { date: '2024-04-22', closes: null, opens: null },
        { date: '2024-04-23', closes: null, opens: null },
        { date: '2024-04-24', closes: null, opens: null },
      ];
      expect(findFirstClosedDay(moment('2024-04-23').toDate(), openingHours))
        .toBe(openingHours[2].date);
    });
    test('returns null if no closed day', () => {
      const openingHours = [
        { date: '2024-04-22', closes: null, opens: null },
        { date: '2024-04-23', closes: null, opens: null },
        { date: '2024-04-24', closes: null, opens: null },
      ];
      expect(findFirstClosedDay(moment('2024-04-25').toDate(), openingHours))
        .toBe(null);
    });
  });

  describe('findPrevFirstClosedDay', () => {
    const openingHours = [
      { date: '2024-04-22', closes: null, opens: null },
      { date: '2024-04-23', closes: null, opens: null },
      { date: '2024-04-24', closes: null, opens: null },
    ];
    test('returns first closed day', () => {
      expect(findPrevFirstClosedDay(moment('2024-04-23').toDate(), openingHours))
        .toBe(openingHours[0].date);
      expect(findPrevFirstClosedDay(moment('2024-04-24').toDate(), openingHours))
        .toBe(openingHours[1].date);
    });
    test('returns null if no closed day', () => {
      expect(findPrevFirstClosedDay(moment('2024-04-22').toDate(), openingHours))
        .toBe(null);
    });
  });

  describe('findFirstClosestReservation', () => {
    const reservations = [
      Reservation.build({
        begin: '2024-04-23T13:00:00+03:00',
        end: '2024-04-24T09:00:00+03:00'
      }),
      Reservation.build({
        begin: '2024-04-25T13:00:00+03:00',
        end: '2024-04-27T09:00:00+03:00'
      })
    ];
    test('returns closest reservation', () => {
      expect(findFirstClosestReservation(moment('2024-04-20').toDate(), reservations))
        .toBe(reservations[0]);
      expect(findFirstClosestReservation(moment('2024-04-24').toDate(), reservations))
        .toBe(reservations[1]);
    });
    test('returns null if no closed day', () => {
      expect(findFirstClosestReservation(moment('2024-04-27').toDate(), reservations))
        .toBe(null);
    });
  });

  describe('findPrevFirstClosestReservation', () => {
    const reservations = [
      Reservation.build({
        begin: '2024-04-23T13:00:00+03:00',
        end: '2024-04-24T09:00:00+03:00'
      }),
      Reservation.build({
        begin: '2024-04-25T13:00:00+03:00',
        end: '2024-04-27T09:00:00+03:00'
      })
    ];
    test('returns closest reservation', () => {
      expect(findPrevFirstClosestReservation(moment('2024-04-25').toDate(), reservations))
        .toBe(reservations[0]);
      expect(findPrevFirstClosestReservation(moment('2024-04-29').toDate(), reservations))
        .toBe(reservations[1]);
    });
    test('returns null if no closed day', () => {
      expect(findPrevFirstClosestReservation(moment('2024-04-22').toDate(), reservations))
        .toBe(null);
    });
  });

  describe('getFirstBlockedDay', () => {
    const openingHours = [
      { date: '2024-04-22', closes: null, opens: null },
      { date: '2024-04-23', closes: null, opens: null },
      { date: '2024-04-24', closes: null, opens: null },
    ];

    const reservations = [
      Reservation.build({
        begin: '2024-04-23T13:00:00+03:00',
        end: '2024-04-24T09:00:00+03:00'
      }),
      Reservation.build({
        begin: '2024-04-25T13:00:00+03:00',
        end: '2024-04-27T09:00:00+03:00'
      })
    ];

    test('returns first blocked day', () => {
      expect(getFirstBlockedDay(moment('2024-04-20').toDate(), reservations, openingHours))
        .toBe(openingHours[0].date);
      expect(getFirstBlockedDay(moment('2024-04-24').toDate(), reservations, openingHours))
        .toBe(reservations[1].begin);
      expect(getFirstBlockedDay(moment('2024-04-20').toDate(), reservations, []))
        .toBe(reservations[0].begin);
      expect(getFirstBlockedDay(moment('2024-04-23').toDate(), [], openingHours))
        .toBe(openingHours[2].date);
    });

    test('returns null if no blocking day found', () => {
      expect(getFirstBlockedDay(moment('2024-04-28').toDate(), reservations, openingHours))
        .toBe(null);
    });
  });

  describe('setDatesTime', () => {
    test('sets time correctly to moment obj', () => {
      const date = moment('2024-04-23').toDate();
      const time = '10:30:00';
      const result = setDatesTime(date, time);
      expect(result).toEqual(moment(date).set({
        hour: 10, minute: 30, second: 0, millisecond: 0
      }));
    });
  });

  describe('getOvernightDatetime', () => {
    test('returns correct datetime string', () => {
      const date = moment('2024-04-23').toDate();
      const time = '10:30:00';
      const result = getOvernightDatetime(date, time);
      expect(result).toBe('23.4.2024 10:30');
    });
    test('returns empty string when date or time is missing', () => {
      expect(getOvernightDatetime(null, null)).toBe('');
      expect(getOvernightDatetime(null, '10:30:00')).toBe('');
      expect(getOvernightDatetime(moment('2024-04-23').toDate(), null)).toBe('');
    });
  });

  describe('getHoursMinutesSeconds', () => {
    test('returns correct obj', () => {
      expect(getHoursMinutesSeconds('10:30:00')).toStrictEqual(
        { hours: 10, minutes: 30, seconds: 0 });
      expect(getHoursMinutesSeconds('00:30:00')).toStrictEqual(
        { hours: 0, minutes: 30, seconds: 0 });
      expect(getHoursMinutesSeconds(undefined)).toStrictEqual(
        { hours: 0, minutes: 0, seconds: 0 });
    });
  });

  describe('handleFormattingSelected', () => {
    test('returns correct obj', () => {
      const startDate = moment('2024-04-23').toDate();
      const endDate = moment('2024-04-26').toDate();
      const startTime = '10:30:00';
      const endTime = '12:30:00';
      const resourceId = 'abc123';
      expect(handleFormattingSelected(
        startDate, endDate, startTime, endTime, resourceId))
        .toStrictEqual({
          begin: '2024-04-23T07:30:00.000Z',
          end: '2024-04-26T09:30:00.000Z',
          resource: resourceId
        });
    });
  });

  describe('getReservationUrl', () => {
    test('returns correct url string', () => {
      const reservation = Reservation.build({ id: 'res123' });
      expect(getReservationUrl(reservation, 'abc123'))
        .toBe('/reservation?id=res123&resource=abc123');
    });
  });

  describe('isReservingAllowed', () => {
    const params = {
      isLoggedIn: true,
      isStrongAuthSatisfied: true,
      isMaintenanceModeOn: false,
      resource: Resource.build(),
      hasAdminBypass: false
    };
    describe('returns false when', () => {
      test('maintenance mode is on', () => {
        expect(isReservingAllowed({ ...params, isMaintenanceModeOn: true }))
          .toBe(false);
      });
      test('resource is missing', () => {
        expect(isReservingAllowed({ ...params, resource: undefined }))
          .toBe(false);
      });
      test('resource is not reservable', () => {
        expect(isReservingAllowed(
          { ...params, resource: Resource.build({ reservable: false }) }))
          .toBe(false);
      });
      test('auth required and not logged in', () => {
        expect(isReservingAllowed(
          { ...params, isLoggedIn: false }))
          .toBe(false);
        expect(isReservingAllowed(
          { ...params, isStrongAuthSatisfied: false }))
          .toBe(false);
      });
    });
    describe('returns true when', () => {
      test('has admin bypass', () => {
        expect(isReservingAllowed({ ...params, hasAdminBypass: true }))
          .toBe(true);
      });
      test('auth not required and not logged in', () => {
        expect(isReservingAllowed(
          {
            ...params,
            resource: Resource.build({ authentication: 'unauthenticated' }),
            isLoggedIn: false,
            isStrongAuthSatisfied: false,
          }))
          .toBe(true);
      });
    });
  });

  describe('getNotificationText', () => {
    const params = {
      isLoggedIn: true,
      isStrongAuthSatisfied: true,
      isMaintenanceModeOn: false,
      resource: Resource.build(),
      t: str => str,
    };
    describe('returns correct text', () => {
      test('when maintenance mode is on', () => {
        expect(getNotificationText({ ...params, isMaintenanceModeOn: true }))
          .toBe('Notifications.cannotReserveDuringMaintenance');
      });
      test('when strong auth required', () => {
        expect(getNotificationText({ ...params, isStrongAuthSatisfied: false }))
          .toBe('Notifications.loginToReserveStrongAuth');
      });
      test('when login required', () => {
        expect(getNotificationText({ ...params, isLoggedIn: false }))
          .toBe('Notifications.loginToReserve');
      });
      test('default text when login ok and no maintenance mode', () => {
        expect(getNotificationText({ ...params }))
          .toBe('Notifications.noRightToReserve');
      });
    });
  });

  describe('getNotSelectableNotificationText', () => {
    const params = {
      isDateDisabled: false,
      booked: false,
      isNextBlocked: false,
      t: str => str,
    };
    describe('returns correct text', () => {
      test('when date not disabled, not booked and next is blocked', () => {
        expect(getNotSelectableNotificationText({ ...params, isNextBlocked: true }))
          .toBe('Notifications.overnight.notSelectableStart');
      });
      test('default text', () => {
        expect(getNotSelectableNotificationText({ ...params }))
          .toBe('Notifications.overnight.notSelectable');
      });
    });
  });

  describe('filterSelectedReservation', () => {
    test('returns correct reservations', () => {
      const reservations = [
        Reservation.build({ id: 'res1' }),
        Reservation.build({ id: 'res2' }),
        Reservation.build({ id: 'res3' }),
      ];
      expect(filterSelectedReservation('res2', reservations))
        .toStrictEqual([reservations[0], reservations[2]]);
      expect(filterSelectedReservation('res5', reservations))
        .toStrictEqual([reservations[0], reservations[1], reservations[2]]);
    });
  });

  describe('getSelectedDuration', () => {
    test('returns correct duration', () => {
      const startDate = moment('2024-04-23').toDate();
      const endDate = moment('2024-04-26').toDate();
      const overnightStartTime = '10:30:00';
      const overnightEndTime = '12:30:00';
      const expected = moment.duration(
        setDatesTime(endDate, overnightEndTime).diff(setDatesTime(startDate, overnightStartTime)));
      expect(getSelectedDuration(startDate, endDate, overnightStartTime, overnightEndTime))
        .toStrictEqual(expected);
    });
  });

  describe('isDurationBelowMin', () => {
    test('returns correct result', () => {
      expect(isDurationBelowMin(moment.duration(2, 'days'), '10:00:00')).toBe(false);
      expect(isDurationBelowMin(moment.duration(2, 'days'), '3 10:00:00')).toBe(true);
      expect(isDurationBelowMin(moment.duration(3, 'days'), '3 10:00:00')).toBe(true);
      expect(isDurationBelowMin(moment.duration(4, 'days'), '3 10:00:00')).toBe(false);
    });
  });

  describe('areDatesSameAsInitialDates', () => {
    const startDate = moment('2024-04-23').toDate();
    const endDate = moment('2024-04-26').toDate();
    const initialStart = moment('2024-04-23').toDate();
    const initialEnd = moment('2024-04-26').toDate();
    test('returns false when any of the params is missing', () => {
      expect(areDatesSameAsInitialDates(null, null, null, undefined))
        .toBe(false);
      expect(areDatesSameAsInitialDates(startDate, null, null, undefined))
        .toBe(false);
      expect(areDatesSameAsInitialDates(null, endDate, null, undefined))
        .toBe(false);
      expect(areDatesSameAsInitialDates(null, null, initialStart, undefined))
        .toBe(false);
      expect(areDatesSameAsInitialDates(startDate, endDate, null, initialEnd))
        .toBe(false);
    });

    test('returns true when all params are the same', () => {
      expect(areDatesSameAsInitialDates(startDate, endDate, initialStart, initialEnd))
        .toBe(true);
    });

    test('returns false when not all params are same', () => {
      expect(areDatesSameAsInitialDates(
        startDate, endDate, moment('2024-04-22').toDate(), initialEnd))
        .toBe(false);
      expect(areDatesSameAsInitialDates(
        startDate, endDate, initialStart, moment('2024-04-25').toDate()))
        .toBe(false);
    });
  });
});
