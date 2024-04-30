import mockDate from 'mockdate';
import moment from 'moment';

import utils from './utils';
import constants from '../../../../constants/AppConstants';

describe('shared/availability-view/utils', () => {
  describe('getTimeSlotWidth', () => {
    const slotWidth = 30;
    const slotMargin = 0;

    test('returns one slot width with no arguments', () => {
      const actual = utils.getTimeSlotWidth();
      expect(actual).toBe(slotWidth - slotMargin);
    });

    test('returns one slot width for 30 min span', () => {
      const actual = utils.getTimeSlotWidth({
        startTime: moment('2016-01-01T12:00:00Z'),
        endTime: moment('2016-01-01T12:30:00Z'),
      });
      expect(actual).toBe(slotWidth - slotMargin);
    });

    test('returns two slot width for 1 hour span', () => {
      const actual = utils.getTimeSlotWidth({
        startTime: moment('2016-01-01T12:00:00Z'),
        endTime: moment('2016-01-01T13:00:00Z'),
      });
      expect(actual).toBe((slotWidth * 2) - slotMargin);
    });

    test('returns twenty slot width for 10 hour span', () => {
      const actual = utils.getTimeSlotWidth({
        startTime: moment('2016-01-01T12:00:00Z'),
        endTime: moment('2016-01-01T22:00:00Z'),
      });
      expect(actual).toBe((slotWidth * 20) - slotMargin);
    });
  });

  describe('addSelectionData', () => {
    // canIgnoreOpeningHours is true when user has staff rights to resource.
    const userPermissions = {
      canIgnoreOpeningHours: true,
    };
    const items = [
      {
        data: {
          begin: '2016-01-01T11:00:00Z',
          end: '2016-01-01T11:30:00Z',
          isSelectable: false,
        },
        type: 'reservation-slot',
      },
      {
        data: {
          begin: '2016-01-01T11:30:00Z',
          end: '2016-01-01T12:00:00Z',
          isSelectable: false,
        },
        type: 'reservation-slot',
      },
      {
        data: {
          begin: '2016-01-01T12:00:00Z',
          end: '2016-01-01T12:30:00Z',
          isSelectable: false,
        },
        type: 'reservation',
      },
      {
        data: {
          begin: '2016-01-01T12:30:00Z',
          end: '2016-01-01T13:00:00Z',
          isSelectable: false,
        },
        type: 'reservation-slot',
      },
      {
        data: {
          begin: '2016-01-01T13:00:00Z',
          end: '2016-01-01T13:30:00Z',
          isSelectable: false,
        },
        type: 'reservation-slot',
      },
    ];

    function getItems(slot1, slot2, slot3, slot4) {
      return [
        { ...items[0], data: { ...items[0].data, isSelectable: slot1 } },
        { ...items[1], data: { ...items[1].data, isSelectable: slot2 } },
        items[2],
        { ...items[3], data: { ...items[3].data, isSelectable: slot3 } },
        { ...items[4], data: { ...items[4].data, isSelectable: slot4 } },
      ];
    }

    beforeEach(() => {
      mockDate.set('2015-12-01T10:00:00Z');
    });

    afterAll(() => {
      mockDate.reset();
    });

    test('marks all selectable if no selection', () => {
      const expected = getItems(true, true, true, true);
      const actual = utils.addSelectionData(null, { id: 'r1', userPermissions, }, items);
      expect(actual).toEqual(expected);
    });

    test('marks all not selectable if selection in another resource', () => {
      const expected = getItems(false, false, false, false);
      const selection = { begin: '2016-01-01T11:30:00Z', resourceId: 'r2' };
      const actual = utils.addSelectionData(selection, { id: 'r1', userPermissions, }, items);
      expect(actual).toEqual(expected);
    });

    test('marks selectable if selection in this resource', () => {
      const expected = getItems(false, false, false, true);
      const selection = { begin: '2016-01-01T13:00:00Z', resourceId: 'r1' };
      const actual = utils.addSelectionData(selection, { id: 'r1', userPermissions, }, items);
      expect(actual).toEqual(expected);
    });

    test('only marks selectable until next reservation', () => {
      const expected = getItems(true, true, false, false);
      const selection = { begin: '2016-01-01T11:00:00Z', resourceId: 'r1' };
      const actual = utils.addSelectionData(selection, { id: 'r1', userPermissions, }, items);
      expect(actual).toEqual(expected);
    });

    test('marks not selectable if in the past', () => {
      mockDate.set('2016-02-01T10:00:00Z');
      const expected = getItems(false, false, false, false);
      const actual = utils.addSelectionData(null, { id: 'r1', userPermissions, }, items);
      expect(actual).toEqual(expected);
    });

    test('returns items as is when resource overnightReservations is true', () => {
      const expected = getItems(false, false, false, false);
      const resource = {
        id: 'r1',
        userPermissions,
        overnightReservations: true,
      };
      const actual = utils.addSelectionData(null, resource, items);
      expect(actual).toEqual(expected);
    });

    test('marks not selectable if outside available hours', () => {
      const expected = getItems(false, true, false, true);
      const resource = {
        id: 'r1',
        userPermissions,
        openingHours: [
          { opens: '2016-01-01T11:30:00Z', closes: '2016-01-01T12:30:00Z' },
          { opens: '2016-01-01T13:00:00Z', closes: '2016-01-01T13:30:00Z' },
        ],
      };
      const actual = utils.addSelectionData(null, resource, items);
      expect(actual).toEqual(expected);
    });

    describe('selectable depending on if user can ignore opening hours', () => {
      const generateItem = (day = '02', start = '10:00', end = '10:30', selectable = false) => ({
        data: {
          begin: `2016-01-${day}T${start}:00Z`,
          end: `2016-01-${day}T${end}:00Z`,
          isSelectable: selectable,
        },
        type: 'reservation-slot',
      });
      const times = [
        ['10:00', '11:00'],
        ['11:00', '12:00'],
        ['12:00', '13:00'],
        ['13:00', '14:00'],
        ['14:00', '15:00'],
        ['15:00', '16:00'],
        ['16:00', '17:00'],
        ['17:00', '18:00'],
      ];
      const generatedItems = times.map(time => generateItem('02', time[0], time[1]));
      const resource = {
        id: 'r1',
        reservableAfter: '2016-01-03T10:00:00Z',
        userPermissions,
        openingHours: [
          { opens: '2016-01-02T10:00:00Z', closes: '2016-01-02T18:00:00Z' },
        ],
      };
      test('marks not selectable if user cant ignore hours and time is before reservableAfter', () => {
        mockDate.set('2016-01-01T08:00:00Z');
        const newPerms = {
          userPermissions: {
            canIgnoreOpeningHours: false,
          },
        };
        const actual = utils.addSelectionData(null, { ...resource, ...newPerms }, generatedItems);
        const nothingIsSelectable = actual.every(item => !item.data.isSelectable);
        expect(nothingIsSelectable).toBe(true);
      });

      test('marks selectable if user can ignore hours and time is before reservableAfter', () => {
        mockDate.set('2016-01-01T08:00:00Z');
        const actual = utils.addSelectionData(null, resource, generatedItems);
        const everythingIsSelectable = actual.every(item => item.data.isSelectable);
        expect(everythingIsSelectable).toBe(true);
      });
    });
  });

  describe('getTimelineItems', () => {
    const timeRestrictions = { cooldown: '00:00:00', minPeriod: '00:30:00', maxPeriod: '01:00:00' };
    const hasStaffRights = true;
    test('returns reservation slots if reservations is undefined', () => {
      const actual = utils.getTimelineItems(moment('2016-01-01T00:00:00Z'), undefined, '1', timeRestrictions, hasStaffRights);
      expect(actual).toHaveLength(48);
      actual.forEach(item => expect(item.type).toBe('reservation-slot'));
    });

    test('returns reservation slots if reservations is empty', () => {
      const actual = utils.getTimelineItems(moment('2016-01-01T00:00:00Z'), [], '1', timeRestrictions, hasStaffRights);
      expect(actual).toHaveLength(48);
      actual.forEach(item => expect(item.type).toBe('reservation-slot'));
    });

    test('returns one reservation if entire day is a reservation', () => {
      const reservation = { id: 11, begin: '2016-01-01T00:00:00', end: '2016-01-02T00:00:00' };
      const actual = utils.getTimelineItems(moment('2016-01-01T00:00:00'), [reservation], '1', timeRestrictions, hasStaffRights);
      expect(actual).toHaveLength(1);
      expect(actual[0]).toEqual({
        key: '0',
        type: 'reservation',
        data: reservation,
      });
    });

    test('returns reservations and slots', () => {
      const reservations = [
        { id: 11, begin: '2016-01-01T02:00:00', end: '2016-01-01T10:00:00' },
        { id: 12, begin: '2016-01-01T12:30:00', end: '2016-01-01T20:00:00' },
        { id: 13, begin: '2016-01-01T20:00:00', end: '2016-01-01T20:30:00' },
      ];
      const actual = utils.getTimelineItems(moment('2016-01-01T00:00:00'), reservations, '1', timeRestrictions, hasStaffRights);
      const expected = [
        {
          key: '0',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T00:00:00').format(),
            end: moment('2016-01-01T00:30:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: true,
            isWithinCooldown: false,
            minPeriod: timeRestrictions.minPeriod,
            maxPeriod: timeRestrictions.maxPeriod,
          },
        },
        {
          key: '1',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T00:30:00').format(),
            end: moment('2016-01-01T01:00:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: true,
            isWithinCooldown: false,
            minPeriod: timeRestrictions.minPeriod,
            maxPeriod: timeRestrictions.maxPeriod,
          },
        },
        {
          key: '2',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T01:00:00').format(),
            end: moment('2016-01-01T01:30:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: true,
            isWithinCooldown: false,
            minPeriod: timeRestrictions.minPeriod,
            maxPeriod: timeRestrictions.maxPeriod,
          },
        },
        {
          key: '3',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T01:30:00').format(),
            end: moment('2016-01-01T02:00:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: true,
            isWithinCooldown: false,
            minPeriod: timeRestrictions.minPeriod,
            maxPeriod: timeRestrictions.maxPeriod,
          },
        },
        { key: '4', type: 'reservation', data: reservations[0] },
        {
          key: '5',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T10:00:00').format(),
            end: moment('2016-01-01T10:30:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: true,
            isWithinCooldown: false,
            minPeriod: timeRestrictions.minPeriod,
            maxPeriod: timeRestrictions.maxPeriod,
          },
        },
        {
          key: '6',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T10:30:00').format(),
            end: moment('2016-01-01T11:00:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: true,
            isWithinCooldown: false,
            minPeriod: timeRestrictions.minPeriod,
            maxPeriod: timeRestrictions.maxPeriod,
          },
        },
        {
          key: '7',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T11:00:00').format(),
            end: moment('2016-01-01T11:30:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: true,
            isWithinCooldown: false,
            minPeriod: timeRestrictions.minPeriod,
            maxPeriod: timeRestrictions.maxPeriod,
          },
        },
        {
          key: '8',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T11:30:00').format(),
            end: moment('2016-01-01T12:00:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: true,
            isWithinCooldown: false,
            minPeriod: timeRestrictions.minPeriod,
            maxPeriod: timeRestrictions.maxPeriod,
          },
        },
        {
          key: '9',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T12:00:00').format(),
            end: moment('2016-01-01T12:30:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: true,
            isWithinCooldown: false,
            minPeriod: timeRestrictions.minPeriod,
            maxPeriod: timeRestrictions.maxPeriod,
          },
        },
        { key: '10', type: 'reservation', data: reservations[1] },
        { key: '11', type: 'reservation', data: reservations[2] },
        {
          key: '12',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T20:30:00').format(),
            end: moment('2016-01-01T21:00:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: true,
            isWithinCooldown: false,
            minPeriod: timeRestrictions.minPeriod,
            maxPeriod: timeRestrictions.maxPeriod,
          },
        },
        {
          key: '13',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T21:00:00').format(),
            end: moment('2016-01-01T21:30:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: true,
            isWithinCooldown: false,
            minPeriod: timeRestrictions.minPeriod,
            maxPeriod: timeRestrictions.maxPeriod,
          },
        },
        {
          key: '14',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T21:30:00').format(),
            end: moment('2016-01-01T22:00:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: true,
            isWithinCooldown: false,
            minPeriod: timeRestrictions.minPeriod,
            maxPeriod: timeRestrictions.maxPeriod,
          },
        },
        {
          key: '15',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T22:00:00').format(),
            end: moment('2016-01-01T22:30:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: true,
            isWithinCooldown: false,
            minPeriod: timeRestrictions.minPeriod,
            maxPeriod: timeRestrictions.maxPeriod,
          },
        },
        {
          key: '16',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T22:30:00').format(),
            end: moment('2016-01-01T23:00:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: true,
            isWithinCooldown: false,
            minPeriod: timeRestrictions.minPeriod,
            maxPeriod: timeRestrictions.maxPeriod,
          },
        },
        {
          key: '17',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T23:00:00').format(),
            end: moment('2016-01-01T23:30:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: true,
            isWithinCooldown: false,
            minPeriod: timeRestrictions.minPeriod,
            maxPeriod: timeRestrictions.maxPeriod,
          },
        },
        {
          key: '18',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T23:30:00').format(),
            end: moment('2016-01-02T00:00:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: true,
            isWithinCooldown: false,
            minPeriod: timeRestrictions.minPeriod,
            maxPeriod: timeRestrictions.maxPeriod,
          },
        },
      ];
      expect(actual).toEqual(expected);
    });

    test('returns only slots when overnightReservations is true', () => {
      const reservations = [
        { id: 11, begin: '2016-01-01T02:00:00', end: '2016-01-01T10:00:00' },
        { id: 12, begin: '2016-01-01T12:30:00', end: '2016-01-01T20:00:00' },
        { id: 13, begin: '2016-01-01T20:00:00', end: '2016-01-01T20:30:00' },
      ];
      const timeRestrictions2 = {
        cooldown: '01:00:00',
        minPeriod: '00:30:00',
        maxPeriod: '01:00:00',
        overnightReservations: true,
      };
      const items = utils.getTimelineItems(
        moment('2016-01-01T00:00:00'), reservations, '1', timeRestrictions2, hasStaffRights);
      items.forEach(item => {
        expect(item.type).toBe('reservation-slot');
      });
    });

    test.each([true, false])('returns slots and reservations correctly when there is cooldown and hasStaffRights is %p', hasRights => {
      const timeRestrictions2 = { cooldown: '01:00:00', minPeriod: '00:30:00', maxPeriod: '01:00:00' };
      const reservations = [
        {
          id: 10, begin: '2016-01-01T01:30:00', end: '2016-01-01T02:00:00', type: constants.RESERVATION_TYPE.BLOCKED_VALUE
        },
        { id: 11, begin: '2016-01-01T02:00:00', end: '2016-01-01T10:00:00' },
        { id: 12, begin: '2016-01-01T12:30:00', end: '2016-01-01T20:00:00' },
        { id: 13, begin: '2016-01-01T20:00:00', end: '2016-01-01T20:30:00' },
      ];
      const actual = utils.getTimelineItems(moment('2016-01-01T00:00:00'), reservations, '1', timeRestrictions2, hasRights);
      const expected = [
        {
          key: '0',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T00:00:00').format(),
            end: moment('2016-01-01T00:30:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: hasRights,
            isWithinCooldown: false,
            minPeriod: timeRestrictions2.minPeriod,
            maxPeriod: timeRestrictions2.maxPeriod,
          },
        },
        {
          key: '1',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T00:30:00').format(),
            end: moment('2016-01-01T01:00:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: hasRights,
            isWithinCooldown: false,
            minPeriod: timeRestrictions2.minPeriod,
            maxPeriod: timeRestrictions2.maxPeriod,
          },
        },
        {
          key: '2',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T01:00:00').format(),
            end: moment('2016-01-01T01:30:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: hasRights,
            isWithinCooldown: !hasRights,
            minPeriod: timeRestrictions2.minPeriod,
            maxPeriod: timeRestrictions2.maxPeriod,
          },
        },
        {
          key: '3',
          type: 'reservation',
          data: reservations[0],
        },
        { key: '4', type: 'reservation', data: reservations[1] },
        {
          key: '5',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T10:00:00').format(),
            end: moment('2016-01-01T10:30:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: hasRights,
            isWithinCooldown: !hasRights,
            minPeriod: timeRestrictions2.minPeriod,
            maxPeriod: timeRestrictions2.maxPeriod,
          },
        },
        {
          key: '6',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T10:30:00').format(),
            end: moment('2016-01-01T11:00:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: hasRights,
            isWithinCooldown: !hasRights,
            minPeriod: timeRestrictions2.minPeriod,
            maxPeriod: timeRestrictions2.maxPeriod,
          },
        },
        {
          key: '7',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T11:00:00').format(),
            end: moment('2016-01-01T11:30:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: hasRights,
            isWithinCooldown: false,
            minPeriod: timeRestrictions2.minPeriod,
            maxPeriod: timeRestrictions2.maxPeriod,
          },
        },
        {
          key: '8',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T11:30:00').format(),
            end: moment('2016-01-01T12:00:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: hasRights,
            isWithinCooldown: !hasRights,
            minPeriod: timeRestrictions2.minPeriod,
            maxPeriod: timeRestrictions2.maxPeriod,
          },
        },
        {
          key: '9',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T12:00:00').format(),
            end: moment('2016-01-01T12:30:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: hasRights,
            isWithinCooldown: !hasRights,
            minPeriod: timeRestrictions2.minPeriod,
            maxPeriod: timeRestrictions2.maxPeriod,
          },
        },
        { key: '10', type: 'reservation', data: reservations[2] },
        { key: '11', type: 'reservation', data: reservations[3] },
        {
          key: '12',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T20:30:00').format(),
            end: moment('2016-01-01T21:00:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: hasRights,
            isWithinCooldown: !hasRights,
            minPeriod: timeRestrictions2.minPeriod,
            maxPeriod: timeRestrictions2.maxPeriod,
          },
        },
        {
          key: '13',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T21:00:00').format(),
            end: moment('2016-01-01T21:30:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: hasRights,
            isWithinCooldown: !hasRights,
            minPeriod: timeRestrictions2.minPeriod,
            maxPeriod: timeRestrictions2.maxPeriod,
          },
        },
        {
          key: '14',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T21:30:00').format(),
            end: moment('2016-01-01T22:00:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: hasRights,
            isWithinCooldown: false,
            minPeriod: timeRestrictions2.minPeriod,
            maxPeriod: timeRestrictions2.maxPeriod,
          },
        },
        {
          key: '15',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T22:00:00').format(),
            end: moment('2016-01-01T22:30:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: hasRights,
            isWithinCooldown: false,
            minPeriod: timeRestrictions2.minPeriod,
            maxPeriod: timeRestrictions2.maxPeriod,
          },
        },
        {
          key: '16',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T22:30:00').format(),
            end: moment('2016-01-01T23:00:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: hasRights,
            isWithinCooldown: false,
            minPeriod: timeRestrictions2.minPeriod,
            maxPeriod: timeRestrictions2.maxPeriod,
          },
        },
        {
          key: '17',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T23:00:00').format(),
            end: moment('2016-01-01T23:30:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: hasRights,
            isWithinCooldown: false,
            minPeriod: timeRestrictions2.minPeriod,
            maxPeriod: timeRestrictions2.maxPeriod,
          },
        },
        {
          key: '18',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T23:30:00').format(),
            end: moment('2016-01-02T00:00:00').format(),
            resourceId: '1',
            isSelectable: false,
            hasStaffRights: hasRights,
            isWithinCooldown: false,
            minPeriod: timeRestrictions2.minPeriod,
            maxPeriod: timeRestrictions2.maxPeriod,
          },
        },
      ];
      expect(actual).toEqual(expected);
    });
  });
});
