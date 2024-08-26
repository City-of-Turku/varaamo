
import MockDate from 'mockdate';
import moment from 'moment';
import queryString from 'query-string';
import simple from 'simple-mock';

import constants from 'constants/AppConstants';
import Resource from '../fixtures/Resource';
import {
  hasMaxReservations,
  isOpenNow,
  getAvailabilityDataForNow,
  getAvailabilityDataForWholeDay,
  getHumanizedPeriod,
  getMaxPeriodText,
  getOpeningHours,
  getOpenReservations,
  getResourceCustomerGroupName,
  getResourcePageUrl,
  getTermsAndConditions,
  getPaymentTermsAndConditions,
  getPrice,
  reservingIsRestricted,
  getResourcePageUrlComponents,
  getMinPeriodText,
  getEquipment,
  isStaffForResource,
  isStrongAuthSatisfied,
  isAdminForResource,
  isManagerForResource,
  rearrangeResources,
  isBelow24Hours,
  showMinPeriod
} from 'utils/resourceUtils';
import { getPrettifiedPeriodUnits } from '../timeUtils';
import Product from '../fixtures/Product';
import CustomerGroup from '../fixtures/CustomerGroup';
import ProductCustomerGroup from '../fixtures/ProductCustomerGroup';

describe('Utils: resourceUtils', () => {
  describe('hasMaxReservations', () => {
    const maxReservationsPerUser = 1;
    const now = '2015-10-10T06:00:00+03:00';
    describe('if has more own open reservations than maxReservationsPerUser', () => {
      const reservations = [
        {
          end: '2015-10-10T07:00:00+03:00',
          isOwn: true,
        },
        {
          end: '2015-10-10T08:00:00+03:00',
          isOwn: false,
        },
      ];
      const resource = {
        maxReservationsPerUser,
        reservations,
      };
      beforeEach(() => {
        MockDate.set(now);
      });

      afterEach(() => {
        MockDate.reset();
      });

      test('returns true', () => {
        expect(hasMaxReservations(resource)).toBe(true);
      });
    });
    describe('if has more own passed reservations than maxReservationsPerUser', () => {
      const reservations = [
        {
          end: '2015-10-10T05:00:00+03:00',
          isOwn: true,
        },
        {
          end: '2015-10-10T08:00:00+03:00',
          isOwn: false,
        },
      ];
      const resource = {
        maxReservationsPerUser,
        reservations,
      };
      beforeEach(() => {
        MockDate.set(now);
      });

      afterEach(() => {
        MockDate.reset();
      });

      test('returns false', () => {
        expect(hasMaxReservations(resource)).toBe(false);
      });
    });
  });
  describe('isOpenNow', () => {
    describe('if openingHours data is missing', () => {
      const openingHours = {
        opens: null,
        closes: null,
      };
      const now = '2015-10-10T06:00:00+03:00';
      const resource = { openingHours: [openingHours] };

      beforeEach(() => {
        MockDate.set(now);
      });

      afterEach(() => {
        MockDate.reset();
      });

      test('returns false', () => {
        expect(isOpenNow(resource)).toBe(false);
      });
    });

    describe('if current time is before openingHours.opens', () => {
      const openingHours = {
        opens: '2015-10-10T12:00:00+03:00',
        closes: '2015-10-10T18:00:00+03:00',
        date: '2015-10-10',
      };
      const now = '2015-10-10T06:00:00+03:00';
      const resource = { openingHours: [openingHours] };

      beforeEach(() => {
        MockDate.set(now);
      });

      afterEach(() => {
        MockDate.reset();
      });

      test('returns false', () => {
        expect(isOpenNow(resource)).toBe(false);
      });
    });

    describe('if current time is between openingHours', () => {
      const openingHours = {
        opens: '2015-10-10T12:00:00+03:00',
        closes: '2015-10-10T18:00:00+03:00',
        date: '2015-10-10',
      };
      const now = '2015-10-10T14:00:00+03:00';
      const resource = { openingHours: [openingHours] };

      beforeEach(() => {
        MockDate.set(now);
      });

      afterEach(() => {
        MockDate.reset();
      });

      test('returns true', () => {
        expect(isOpenNow(resource)).toBe(true);
      });
    });

    describe('if current time is after openingHours.closes', () => {
      const openingHours = {
        opens: '2015-10-10T12:00:00+03:00',
        closes: '2015-10-10T18:00:00+03:00',
        date: '2015-10-10',
      };
      const now = '2015-10-10T23:00:00+03:00';
      const resource = { openingHours: [openingHours] };

      beforeEach(() => {
        MockDate.set(now);
      });

      afterEach(() => {
        MockDate.reset();
      });

      test('returns false', () => {
        expect(isOpenNow(resource)).toBe(false);
      });
    });
  });

  describe('getAvailabilityDataForNow', () => {
    function getResource(openingHours = {}, reservations = []) {
      return { openingHours: [openingHours], reservations };
    }

    describe('if openingHours are missing', () => {
      test('returns correct data', () => {
        const openingHours = {};
        const resource = getResource(openingHours);
        const availabilityData = getAvailabilityDataForNow(resource);
        const expected = { status: 'closed', bsStyle: 'danger' };

        expect(availabilityData).toEqual(expected);
      });
    });

    describe('if current time is before opening time', () => {
      beforeEach(() => {
        MockDate.set('2015-10-10T10:00:00+03:00');
      });

      afterEach(() => {
        MockDate.reset();
      });

      describe('if there are no reservations when the resource opens', () => {
        test('returns the time when the resource opens', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
            date: '2015-10-10',
          };
          const reservations = [];
          const resource = getResource(openingHours, reservations);
          const availabilityData = getAvailabilityDataForNow(resource);
          const expectedTime = moment(openingHours.opens).format(constants.TIME_FORMAT);
          const expected = {
            status: 'availableAt',
            bsStyle: 'danger',
            values: { time: expectedTime },
          };

          expect(availabilityData).toEqual(expected);
        });
      });

      describe('if there are reservations when the resource opens', () => {
        test('returns the first available time', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
            date: '2015-10-10',
          };
          const reservations = [
            {
              begin: '2015-10-10T12:00:00+03:00',
              end: '2015-10-10T14:00:00+03:00',
            },
            {
              begin: '2015-10-10T16:00:00+03:00',
              end: '2015-10-10T16:30:00+03:00',
            },
          ];
          const resource = getResource(openingHours, reservations);
          const availabilityData = getAvailabilityDataForNow(resource);
          const expectedTime = moment(reservations[0].end).format(constants.TIME_FORMAT);
          const expected = {
            status: 'availableAt',
            bsStyle: 'danger',
            values: { time: expectedTime },
          };

          expect(availabilityData).toEqual(expected);
        });

        test('works with cancelled and denied reservations', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
            date: '2015-10-10',
          };
          const reservations = [
            {
              begin: '2015-10-10T12:00:00+03:00',
              end: '2015-10-10T14:00:00+03:00',
              state: 'cancelled',
            },
            {
              begin: '2015-10-10T12:00:00+03:00',
              end: '2015-10-10T14:00:00+03:00',
              state: 'denied',
            },
          ];
          const resource = getResource(openingHours, reservations);
          const availabilityData = getAvailabilityDataForNow(resource);
          const expectedTime = moment(openingHours.opens).format(constants.TIME_FORMAT);
          const expected = {
            status: 'availableAt',
            bsStyle: 'danger',
            values: { time: expectedTime },
          };

          expect(availabilityData).toEqual(expected);
        });
      });
    });

    describe('if current time is between opening hours', () => {
      beforeEach(() => {
        MockDate.set('2015-10-10T15:00:00+03:00');
      });

      afterEach(() => {
        MockDate.reset();
      });

      describe('if there is no ongoing reservation', () => {
        test('returns data telling the resource is available', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
            date: '2015-10-10',
          };
          const resource = getResource(openingHours, []);
          const availabilityData = getAvailabilityDataForNow(resource);
          const expected = { status: 'available', bsStyle: 'success' };

          expect(availabilityData).toEqual(expected);
        });
      });

      describe('if there is an ongoing reservation', () => {
        test('returns the next available time', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
            date: '2015-10-10',
          };
          const reservations = [
            {
              begin: '2015-10-10T14:00:00+03:00',
              end: '2015-10-10T16:00:00+03:00',
            },
          ];
          const resource = getResource(openingHours, reservations);
          const availabilityData = getAvailabilityDataForNow(resource);
          const expectedTime = moment(reservations[0].end).format(constants.TIME_FORMAT);
          const expected = {
            status: 'availableAt',
            bsStyle: 'danger',
            values: { time: expectedTime },
          };

          expect(availabilityData).toEqual(expected);
        });

        test('works with cancelled and denied reservations', () => {
          const openingHours = {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
            date: '2015-10-10',
          };
          const reservations = [
            {
              begin: '2015-10-10T14:00:00+03:00',
              end: '2015-10-10T16:00:00+03:00',
              state: 'cancelled',
            },
            {
              begin: '2015-10-10T14:00:00+03:00',
              end: '2015-10-10T16:00:00+03:00',
              state: 'denied',
            },
          ];
          const resource = getResource(openingHours, reservations);
          const availabilityData = getAvailabilityDataForNow(resource);
          const expected = { status: 'available', bsStyle: 'success' };
          expect(availabilityData).toEqual(expected);
        });
      });
    });

    describe('if current time is after openingHours.closes', () => {
      beforeEach(() => {
        MockDate.set('2015-10-10T22:00:00+03:00');
      });

      afterEach(() => {
        MockDate.reset();
      });

      test('returns correct availability data', () => {
        const openingHours = {
          opens: '2015-10-10T12:00:00+03:00',
          closes: '2015-10-10T18:00:00+03:00',
          date: '2015-10-10',
        };
        const resource = getResource(openingHours, []);
        const availabilityData = getAvailabilityDataForNow(resource);
        const expected = { status: 'closed', bsStyle: 'danger' };

        expect(availabilityData).toEqual(expected);
      });
    });
  });

  describe('getAvailabilityDataForWholeDay', () => {
    function getResource(openingHours = [], reservations = []) {
      return { openingHours, reservations };
    }

    describe('if openingHours are missing', () => {
      test('returns correct data', () => {
        const openingHours = {};
        const resource = getResource([openingHours]);
        const availabilityData = getAvailabilityDataForWholeDay(resource);
        const expected = { status: 'closed', bsStyle: 'danger' };

        expect(availabilityData).toEqual(expected);
      });
    });

    describe('if reserving is limited in a future date', () => {
      test('returns correct data', () => {
        const openingHours = [
          {
            opens: '2016-12-12T12:00:00+03:00',
            closes: '2016-12-12T18:00:00+03:00',
            date: '2016-12-12',
          },
        ];
        const date = '2016-12-12';
        const resource = { openingHours, reservableBefore: '2016-10-10' };
        const availabilityData = getAvailabilityDataForWholeDay(resource, date);
        const expected = { status: 'reservingRestricted', bsStyle: 'danger' };

        expect(availabilityData).toEqual(expected);
      });
    });

    describe('if there are no reservations', () => {
      test('returns the time between opening hours', () => {
        const openingHours = [
          {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
            date: '2015-10-10',
          },
        ];
        const reservations = [];
        const resource = getResource(openingHours, reservations);
        const availabilityData = getAvailabilityDataForWholeDay(resource);
        const expected = {
          status: 'availableTime',
          bsStyle: 'success',
          values: { hours: 6 },
        };

        expect(availabilityData).toEqual(expected);
      });
    });

    describe('if there are reservations', () => {
      test('returns the time between opening hours minus reservations', () => {
        const openingHours = [
          {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
            date: '2015-10-10',
          },
        ];
        const reservations = [
          {
            begin: '2015-10-10T13:00:00+03:00',
            end: '2015-10-10T14:00:00+03:00',
          },
          {
            begin: '2015-10-10T16:00:00+03:00',
            end: '2015-10-10T16:30:00+03:00',
          },
        ];
        const resource = getResource(openingHours, reservations);
        const availabilityData = getAvailabilityDataForWholeDay(resource);
        const expected = {
          status: 'availableTime',
          bsStyle: 'success',
          values: { hours: 4.5 },
        };

        expect(availabilityData).toEqual(expected);
      });

      test('does not minus cancelled reservations from available time', () => {
        const openingHours = [
          {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
            date: '2015-10-10',
          },
        ];
        const reservations = [
          {
            begin: '2015-10-10T13:00:00+03:00',
            end: '2015-10-10T14:00:00+03:00',
            state: 'cancelled',
          },
        ];
        const resource = getResource(openingHours, reservations);
        const availabilityData = getAvailabilityDataForWholeDay(resource);
        const expected = {
          status: 'availableTime',
          bsStyle: 'success',
          values: { hours: 6 },
        };

        expect(availabilityData).toEqual(expected);
      });

      test('does not minus denied reservations from available time', () => {
        const openingHours = [
          {
            opens: '2015-10-10T12:00:00+03:00',
            closes: '2015-10-10T18:00:00+03:00',
            date: '2015-10-10',
          },
        ];
        const reservations = [
          {
            begin: '2015-10-10T13:00:00+03:00',
            end: '2015-10-10T14:00:00+03:00',
            state: 'denied',
          },
        ];
        const resource = getResource(openingHours, reservations);
        const availabilityData = getAvailabilityDataForWholeDay(resource);
        const expected = {
          status: 'availableTime',
          bsStyle: 'success',
          values: { hours: 6 },
        };

        expect(availabilityData).toEqual(expected);
      });

      describe('if the whole day is reserved', () => {
        test('returns correct data', () => {
          const openingHours = [
            {
              opens: '2015-10-10T12:00:00+03:00',
              closes: '2015-10-10T18:00:00+03:00',
              date: '2015-10-10',
            },
          ];
          const reservations = [
            {
              begin: '2015-10-10T12:00:00+03:00',
              end: '2015-10-10T18:00:00+03:00',
            },
          ];
          const resource = getResource(openingHours, reservations);
          const availabilityData = getAvailabilityDataForWholeDay(resource);
          const expected = { status: 'reserved', bsStyle: 'danger' };

          expect(availabilityData).toEqual(expected);
        });
      });

      describe('if selected day is not today', () => {
        test('returns the time between opening hours minus reservations', () => {
          const openingHours = [
            {
              opens: '2015-10-10T12:00:00+03:00',
              closes: '2015-10-10T18:00:00+03:00',
              date: '2015-10-10',
            },
            {
              opens: '2015-10-11T12:00:00+03:00',
              closes: '2015-10-11T18:00:00+03:00',
              date: '2015-10-11',
            },
            {
              opens: '2015-10-12T12:00:00+03:00',
              closes: '2015-10-12T18:00:00+03:00',
              date: '2015-10-12',
            },
          ];
          const reservations = [
            {
              begin: '2015-10-10T13:00:00+03:00',
              end: '2015-10-10T14:00:00+03:00',
            },
            {
              begin: '2015-10-11T13:00:00+03:00',
              end: '2015-10-11T14:00:00+03:00',
            },
            {
              begin: '2015-10-11T16:00:00+03:00',
              end: '2015-10-11T16:30:00+03:00',
            },
            {
              begin: '2015-10-12T13:00:00+03:00',
              end: '2015-10-12T14:00:00+03:00',
            },
          ];
          const resource = getResource(openingHours, reservations);
          const availabilityData = getAvailabilityDataForWholeDay(resource, '2015-10-11');
          const expected = {
            status: 'availableTime',
            bsStyle: 'success',
            values: { hours: 4.5 },
          };

          expect(availabilityData).toEqual(expected);
        });
      });
    });
  });

  describe('getEquipment', () => {
    const equipment = [
      {
        name: 'equipment 1',
      },
      {
        name: 'equipment 2',
      },
      {
        name: 'equipment 3',
      },
    ];
    const resource = {
      equipment
    };

    const expectedResult = ['equipment 1', 'equipment 2', 'equipment 3'];
    test('returns an array of equipment names', () => {
      const resourceEquipment = getEquipment(resource);
      expect(resourceEquipment).toEqual(expectedResult);
    });

    test('returns an array of correct length', () => {
      const resourceEquipment = getEquipment(resource);
      expect(resourceEquipment).toHaveLength(3);
    });
  });

  describe('getHumanizedPeriod', () => {
    test('returns an empty string if period is undefined', () => {
      const period = undefined;
      const periodString = getHumanizedPeriod(period);

      expect(periodString).toBe('');
    });

    test('returns an empty string if period is null', () => {
      const period = null;
      const periodString = getHumanizedPeriod(period);

      expect(periodString).toBe('');
    });

    test('returns a correct period string if proper period is given', () => {
      const period = '04:00:00';
      const periodString = getHumanizedPeriod(period);

      expect(periodString).toBe('4 h');
    });
  });

  describe('getMaxPeriodText', () => {
    test('returns max period as days', () => {
      const t = simple.stub().returnWith('days');
      const resource = { maxPeriod: '24:00:00' };
      const result = getMaxPeriodText(t, resource);

      expect(t.callCount).toBe(1);
      expect(t.lastCall.args[0]).toEqual('ResourceHeader.maxPeriodDays');
      expect(t.lastCall.args[1]).toEqual({ days: 1 });
      expect(result).toBe('days');
    });

    test('returns correct time string when period is less than 1 day ', () => {
      const t = value => value;
      const resource = { maxPeriod: '02:00:00' };
      const expectedResult = getPrettifiedPeriodUnits(resource.maxPeriod);
      expect(getMaxPeriodText(t, resource)).toBe(expectedResult);
    });
  });

  describe('getMinPeriodText', () => {
    test('returns min period as days', () => {
      const t = simple.stub().returnWith('days');
      const resource = { minPeriod: '24:00:00' };
      const result = getMinPeriodText(t, resource);

      expect(t.callCount).toBe(1);
      expect(t.lastCall.args[0]).toEqual('ResourceHeader.minPeriodDays');
      expect(t.lastCall.args[1]).toEqual({ days: 1 });
      expect(result).toBe('days');
    });

    test('returns correct time string when period is less than 1 day ', () => {
      const t = value => value;
      const resource = { maxPeriod: '02:40:00' };
      const expectedResult = getPrettifiedPeriodUnits(resource.maxPeriod);
      expect(getMaxPeriodText(t, resource)).toBe(expectedResult);
    });
  });

  describe('getOpeningHours', () => {
    test('returns an empty object if given resource is undefined', () => {
      const resource = undefined;

      expect(getOpeningHours(resource)).toEqual({});
    });

    test('returns an empty object if given resource is empty', () => {
      const resource = {};

      expect(getOpeningHours(resource)).toEqual({});
    });

    test('returns an empty object if resource.openingHours is empty', () => {
      const resource = { openingHours: [] };

      expect(getOpeningHours(resource)).toEqual({});
    });

    test(
      'returns closes and opens from the first openingHours object if not date passed',
      () => {
        const resource = {
          openingHours: [
            { closes: 'first-closes', opens: 'first-opens', date: 'date' },
            { closes: 'second-closes', opens: 'second-opens', date: 'date' },
          ],
        };
        const expected = { closes: 'first-closes', opens: 'first-opens' };

        expect(getOpeningHours(resource)).toEqual(expected);
      }
    );

    test(
      'returns closes and opens from the right date openingHours object',
      () => {
        const resource = {
          openingHours: [
            { closes: 'first-closes', opens: 'first-opens', date: 'date1' },
            { closes: 'second-closes', opens: 'second-opens', date: 'date2' },
            { closes: 'third-closes', opens: 'third-opens', date: 'date3' },
          ],
        };
        const expected = { closes: 'second-closes', opens: 'second-opens' };

        expect(getOpeningHours(resource, 'date2')).toEqual(expected);
      }
    );
  });

  describe('getOpenReservations', () => {
    test('returns resource reservations', () => {
      const resource = { reservations: [{ foo: 'bar' }] };

      expect(getOpenReservations(resource)).toEqual(resource.reservations);
    });

    test('does not return cancelled reservations', () => {
      const reservations = [
        { id: 1, state: 'cancelled' },
        { id: 2, state: 'confirmed' },
        { id: 3, state: 'cancelled' },
        { id: 4, state: 'something' },
      ];
      const resource = { reservations };
      const expected = [{ id: 2, state: 'confirmed' }, { id: 4, state: 'something' }];

      expect(getOpenReservations(resource)).toEqual(expected);
    });

    test('does not return denied reservations', () => {
      const reservations = [
        { id: 1, state: 'denied' },
        { id: 2, state: 'confirmed' },
        { id: 3, state: 'denied' },
        { id: 4, state: 'something' },
      ];
      const resource = { reservations };
      const expected = [{ id: 2, state: 'confirmed' }, { id: 4, state: 'something' }];

      expect(getOpenReservations(resource)).toEqual(expected);
    });
  });

  describe('getResourceCustomerGroupName', () => {
    const resource = Resource.build();
    describe('when resource or customer group id is not defined', () => {
      test('returns undefined', () => {
        const customerGroupId = '';
        const result = getResourceCustomerGroupName(resource, customerGroupId);
        expect(result).toBe(undefined);
      });
    });

    describe('when resource and customer group id are defined', () => {
      const customerGroupId = 'test-id';
      test('returns undefined when customer group is not found in products', () => {
        const result = getResourceCustomerGroupName(resource, customerGroupId);
        expect(result).toBe(undefined);
      });

      test('returns correct name when customer group is found in products', () => {
        const cgA = CustomerGroup.build();
        const cgB = CustomerGroup.build({ id: customerGroupId });
        const pcgA = ProductCustomerGroup.build({ customerGroup: cgA });
        const pcgB = ProductCustomerGroup.build({ customerGroup: cgB });
        const productA = Product.build({ productCustomerGroups: [pcgA] });
        const productB = Product.build({ productCustomerGroups: [pcgA, pcgB] });
        const resourceA = Resource.build({ products: [productA, productB] });
        const result = getResourceCustomerGroupName(resourceA, customerGroupId);
        expect(result).toBe(cgB.name);
      });
    });
  });

  describe('getResourcePageUrl', () => {
    test('returns an empty string if resource is undefined', () => {
      const resource = undefined;
      const resourcePageUrl = getResourcePageUrl(resource);

      expect(resourcePageUrl).toBe('');
    });

    test('returns an empty string if resource does not have id', () => {
      const resource = {};
      const resourcePageUrl = getResourcePageUrl(resource);

      expect(resourcePageUrl).toBe('');
    });

    test('returns correct url if date is not given', () => {
      const resource = { id: 'some-id' };
      const resourcePageUrl = getResourcePageUrl(resource);
      const expected = `/resources/${resource.id}`;

      expect(resourcePageUrl).toBe(expected);
    });

    test('returns correct url if date is given', () => {
      const resource = { id: 'some-id' };
      const date = '2015-10-10';
      const resourcePageUrl = getResourcePageUrl(resource, date);
      const expected = `/resources/${resource.id}?date=2015-10-10`;

      expect(resourcePageUrl).toBe(expected);
    });

    test('returns correct url if date is given in datetime format', () => {
      const resource = { id: 'some-id' };
      const date = '2015-10-10T08:00:00+03:00';
      const resourcePageUrl = getResourcePageUrl(resource, date);
      const expected = `/resources/${resource.id}?date=2015-10-10`;

      expect(resourcePageUrl).toBe(expected);
    });

    test('returns correct url if date and time are given', () => {
      const resource = { id: 'some-id' };
      const date = '2015-10-10';
      const time = '2015-10-10T08:00:00+03:00';
      const resourcePageUrl = getResourcePageUrl(resource, date, time);
      const expected = `/resources/${resource.id}?${queryString.stringify({ date, time })}`;

      expect(resourcePageUrl).toBe(expected);
    });
  });

  describe('getResourcePageUrlComponents', () => {
    test('returns an empty pathname and query if resource is undefined', () => {
      const resource = undefined;
      const resourcePageUrlComponents = getResourcePageUrlComponents(resource);

      expect(resourcePageUrlComponents.pathname).toBe('');
      expect(resourcePageUrlComponents.query).toBe('');
    });

    test('returns an empty string if resource does not have id', () => {
      const resource = {};
      const resourcePageUrlComponents = getResourcePageUrlComponents(resource);

      expect(resourcePageUrlComponents.pathname).toBe('');
      expect(resourcePageUrlComponents.query).toBe('');
    });

    test('returns correct url if date is not given', () => {
      const resource = { id: 'some-id' };
      const resourcePageUrlComponents = getResourcePageUrlComponents(resource);
      const expected = `/resources/${resource.id}`;

      expect(resourcePageUrlComponents.pathname).toBe(expected);
      expect(resourcePageUrlComponents.query).toBe('');
    });

    test('returns correct url if date is given', () => {
      const resource = { id: 'some-id' };
      const date = '2015-10-10';
      const resourcePageUrlComponents = getResourcePageUrlComponents(resource, date);
      const expectedPathname = `/resources/${resource.id}`;
      const expectedQuery = 'date=2015-10-10';

      expect(resourcePageUrlComponents.pathname).toBe(expectedPathname);
      expect(resourcePageUrlComponents.query).toBe(expectedQuery);
    });

    test('returns correct url if date is given in datetime format', () => {
      const resource = { id: 'some-id' };
      const date = '2015-10-10T08:00:00+03:00';
      const resourcePageUrlComponents = getResourcePageUrlComponents(resource, date);
      const expectedPathname = `/resources/${resource.id}`;
      const expectedQuery = 'date=2015-10-10';

      expect(resourcePageUrlComponents.pathname).toBe(expectedPathname);
      expect(resourcePageUrlComponents.query).toBe(expectedQuery);
    });

    test('returns correct url if date and time are given', () => {
      const resource = { id: 'some-id' };
      const date = '2015-10-10';
      const time = '2015-10-10T08:00:00+03:00';
      const resourcePageUrlComponents = getResourcePageUrlComponents(resource, date, time);
      const expectedPathname = `/resources/${resource.id}`;
      const expectedQuery = queryString.stringify({ date, time });

      expect(resourcePageUrlComponents.pathname).toBe(expectedPathname);
      expect(resourcePageUrlComponents.query).toBe(expectedQuery);
    });
  });

  describe('getTermsAndConditions', () => {
    describe('when both specific and generic terms are specified', () => {
      const genericTerms = 'generic terms';
      const specificTerms = 'specific terms';

      test('returns specific and generic terms separated by blank lines', () => {
        const resource = { genericTerms, specificTerms };
        const expected = `${specificTerms}\n\n${genericTerms}`;
        expect(getTermsAndConditions(resource)).toBe(expected);
      });
    });

    describe('when only specific terms is specified', () => {
      const specificTerms = 'specific terms';

      describe('returns only specific terms', () => {
        test('when generic terms is falsy', () => {
          const genericTerms = null;
          const resource = { genericTerms, specificTerms };
          expect(getTermsAndConditions(resource)).toBe(specificTerms);
        });

        test('when generic terms is empty obj', () => {
          const genericTerms = {};
          const resource = { genericTerms, specificTerms };
          expect(getTermsAndConditions(resource)).toBe(specificTerms);
        });
      });
    });

    describe('when only generic terms is specified', () => {
      const genericTerms = 'generic terms';
      const specificTerms = null;

      test('returns only generic terms', () => {
        const resource = { genericTerms, specificTerms };
        expect(getTermsAndConditions(resource)).toBe(genericTerms);
      });
    });

    describe('when neither specific or generic terms is specified', () => {
      const specificTerms = null;

      describe('returns an empty string', () => {
        test('when generic terms is falsy', () => {
          const genericTerms = '';
          const resource = { genericTerms, specificTerms };
          expect(getTermsAndConditions(resource)).toBe('');
        });

        test('when generic terms is empty obj', () => {
          const genericTerms = {};
          const resource = { genericTerms, specificTerms };
          expect(getTermsAndConditions(resource)).toBe('');
        });
      });
    });
  });

  describe('getPaymentTermsAndConditions', () => {
    test('returns resource.paymentTerms if it exists', () => {
      const resource = { paymentTerms: 'this is the payment terms' };
      expect(getPaymentTermsAndConditions(resource)).toBe(resource.paymentTerms);
    });

    describe('returns empty string', () => {
      test('when given resource doesnt have payment terms', () => {
        const resource = { };
        expect(getPaymentTermsAndConditions(resource)).toBe('');
      });

      test('when given resource has payment terms as empty obj', () => {
        const resource = { paymentTerms: {} };
        expect(getPaymentTermsAndConditions(resource)).toBe('');
      });
    });
  });

  describe('getPrice', () => {
    const t = message => message;

    test('returns correct text if max and min price are empty', () => {
      const resource = { maxPrice: '', minPrice: '' };
      expect(getPrice(t, resource)).toBe('ResourceIcons.free');
    });

    test('returns correct text if max and min price are 0', () => {
      const resource = { maxPrice: 0, minPrice: 0 };
      expect(getPrice(t, resource)).toBe('ResourceIcons.free');
    });

    test('returns correct text if max and min price are defined and not same', () => {
      const resource = { maxPrice: 10, minPrice: 5 };
      expect(getPrice(t, resource)).toBe('5 - 10 €');
    });

    test('returns correct text when min is 0 and max is over 0', () => {
      const resource = { maxPrice: 10, minPrice: 0 };
      expect(getPrice(t, resource)).toBe('0 - 10 €');
    });

    test('returns correct text if max and min price are defined and same', () => {
      const resource = { maxPrice: 5, minPrice: 5 };
      expect(getPrice(t, resource)).toBe('5 €');
    });

    test('returns correct text if only one price is defined', () => {
      const resource = { maxPrice: 5, minPrice: '' };
      expect(getPrice(t, resource)).toBe('5 €');
    });

    test('returns correct text if priceType is hourly', () => {
      const resource = { maxPrice: 5, minPrice: '', priceType: 'hourly' };
      expect(getPrice(t, resource)).toBe('5 €/common.unit.time.hour');
    });

    test('returns correct text if priceType is daily', () => {
      const resource = { maxPrice: 5, minPrice: '', priceType: 'daily' };
      expect(getPrice(t, resource)).toBe('5 €/common.unit.time.day');
    });

    test('returns correct text if priceType is weekly', () => {
      const resource = { maxPrice: 5, minPrice: '', priceType: 'weekly' };
      expect(getPrice(t, resource)).toBe('5 €/common.unit.time.week');
    });

    test('returns correct text if priceType is fixed', () => {
      const resource = { maxPrice: 5, minPrice: '', priceType: 'fixed' };
      expect(getPrice(t, resource)).toBe('5 €');
    });
  });

  describe('reservingIsRestricted', () => {
    describe('when no date is given', () => {
      const date = null;
      const resource = {};

      test('returns false', () => {
        const isLimited = reservingIsRestricted(resource, date);
        expect(isLimited).toBe(false);
      });
    });

    describe('when resource does not have reservableBefore limit', () => {
      const date = '2016-10-10';

      test('returns false if user is an admin', () => {
        const resource = { userPermissions: { isAdmin: true } };
        const isLimited = reservingIsRestricted(resource, date);
        expect(isLimited).toBe(false);
      });

      test('returns false if user is a regular user', () => {
        const resource = { userPermissions: { isAdmin: false } };
        const isLimited = reservingIsRestricted(resource, date);
        expect(isLimited).toBe(false);
      });
    });

    describe('when resource has reservableBefore limit and its after given date', () => {
      const reservableBefore = '2016-12-12';
      const date = '2016-10-10';

      test('returns false if user is an admin', () => {
        const resource = { userPermissions: { isAdmin: true }, reservableBefore };
        const isLimited = reservingIsRestricted(resource, date);
        expect(isLimited).toBe(false);
      });

      test('returns false if user is a regular user', () => {
        const resource = { userPermissions: { isAdmin: false }, reservableBefore };
        const isLimited = reservingIsRestricted(resource, date);
        expect(isLimited).toBe(false);
      });
    });

    describe('when resource has reservableBefore limit and its before given date', () => {
      const reservableBefore = '2016-09-09';
      const date = '2016-10-10';

      test('returns false if user is an admin', () => {
        const resource = { userPermissions: { isAdmin: true }, reservableBefore };
        const isLimited = reservingIsRestricted(resource, date);
        expect(isLimited).toBe(false);
      });

      test('returns true if user is a regular user', () => {
        const resource = { userPermissions: { isAdmin: false }, reservableBefore };
        const isLimited = reservingIsRestricted(resource, date);
        expect(isLimited).toBe(true);
      });
    });
  });

  describe('isStaffForResource', () => {
    describe('returns false', () => {
      test('when given resource doesnt contain userPermissions', () => {
        const resource = Resource.build({ userPermissions: null });
        expect(isStaffForResource(resource)).toBe(false);
      });

      test('when none of the userPermissions admin, manager or viewer permission is true', () => {
        const resource = Resource.build({
          userPermissions: { isAdmin: false, isManager: false, isViewer: false }
        });
        expect(isStaffForResource(resource)).toBe(false);
      });
    });

    describe('returns true', () => {
      test('when any of the userPermissions admin, manager or viewer permission is true', () => {
        const resourceA = Resource.build({
          userPermissions: { isAdmin: true, isManager: false, isViewer: false }
        });
        const resourceB = Resource.build({
          userPermissions: { isAdmin: false, isManager: true, isViewer: false }
        });
        const resourceC = Resource.build({
          userPermissions: { isAdmin: false, isManager: false, isViewer: true }
        });
        const resourceD = Resource.build({
          userPermissions: { isAdmin: true, isManager: true, isViewer: true }
        });
        expect(isStaffForResource(resourceA)).toBe(true);
        expect(isStaffForResource(resourceB)).toBe(true);
        expect(isStaffForResource(resourceC)).toBe(true);
        expect(isStaffForResource(resourceD)).toBe(true);
      });
    });
  });

  describe('isAdminForResource', () => {
    test('returns true when userPermissions is admin is true', () => {
      const resource = Resource.build({ userPermissions: { isAdmin: true } });
      expect(isAdminForResource(resource)).toBe(true);
    });

    test('returns false when userPermissions is admin is false', () => {
      const resource = Resource.build({ userPermissions: { isAdmin: false } });
      expect(isAdminForResource(resource)).toBe(false);
    });
  });

  describe('isManagerForResource', () => {
    test('returns true when userPermissions is admin is true', () => {
      const resource = Resource.build({ userPermissions: { isManager: true } });
      expect(isManagerForResource(resource)).toBe(true);
    });

    test('returns false when userPermissions is admin is false', () => {
      const resource = Resource.build({ userPermissions: { isManager: false } });
      expect(isManagerForResource(resource)).toBe(false);
    });
  });

  describe('isStrongAuthSatisfied', () => {
    describe('when resource requires strong auth', () => {
      const resource = Resource.build({ authentication: 'strong' });
      test('returns true when strong auth status is true', () => {
        const hasStrongAuth = true;
        expect(isStrongAuthSatisfied(resource, hasStrongAuth)).toBe(true);
      });

      test('returns false when strong auth status is false', () => {
        const hasStrongAuth = false;
        expect(isStrongAuthSatisfied(resource, hasStrongAuth)).toBe(false);
      });
    });

    describe('when resource doesnt require strong auth', () => {
      const resource = Resource.build({ authentication: 'none' });
      test('returns true when strong auth status is true', () => {
        const hasStrongAuth = true;
        expect(isStrongAuthSatisfied(resource, hasStrongAuth)).toBe(true);
      });

      test('returns true when strong auth status is false', () => {
        const hasStrongAuth = false;
        expect(isStrongAuthSatisfied(resource, hasStrongAuth)).toBe(true);
      });
    });
  });

  describe('rearrangeResources', () => {
    test('returns correct order', () => {
      const resources = ['id1', 'id2', 'id3'];
      const resourceOrder = ['id3', 'id2', 'id1'];
      expect(rearrangeResources(resources, resourceOrder))
        .toEqual(resourceOrder);
      expect(rearrangeResources(resources, ['id3', 'id2']))
        .toEqual(resourceOrder);
      expect(rearrangeResources(resources, ['id3',]))
        .toEqual(['id3', 'id1', 'id2']);
      expect(rearrangeResources(resources, ['id5',]))
        .toEqual(['id1', 'id2', 'id3']);
      expect(rearrangeResources(resources, ['id5', 'id2']))
        .toEqual(['id2', 'id1', 'id3']);
      expect(rearrangeResources(resources, []))
        .toEqual(['id1', 'id2', 'id3']);
    });
  });

  describe('isBelow24Hours', () => {
    test('returns true when given date is below 24 hours', () => {
      expect(isBelow24Hours('01:00:00')).toBe(true);
      expect(isBelow24Hours('00:00:00')).toBe(true);
      expect(isBelow24Hours('00:30:00')).toBe(true);
      expect(isBelow24Hours('23:00:00')).toBe(true);
      expect(isBelow24Hours('1 00:00:00')).toBe(false);
      expect(isBelow24Hours('1 01:00:00')).toBe(false);
      expect(isBelow24Hours(undefined)).toBe(false);
    });
  });

  describe('showMinPeriod', () => {
    test('returns correct result', () => {
      expect(showMinPeriod('01:00:00', false)).toBe(true);
      expect(showMinPeriod('00:30:00', false)).toBe(true);
      expect(showMinPeriod('1 00:30:00', false)).toBe(true);
      expect(showMinPeriod(undefined, false)).toBe(false);
      expect(showMinPeriod('01:00:00', true)).toBe(false);
      expect(showMinPeriod('00:30:00', true)).toBe(false);
      expect(showMinPeriod('1 00:30:00', true)).toBe(true);
      expect(showMinPeriod(undefined, true)).toBe(false);
      expect(showMinPeriod(undefined, undefined)).toBe(false);
    });
  });
});
