import constants from 'constants/AppConstants';

import moment from 'moment';


import {
  onDateFilterChange, onFilterChange, onReset, hasFilters, getStatusOptions,
  getShowOnlyOptions, onFavoriteFilterChange
} from '../filterUtils';

describe('onDateFilterChange', () => {
  test('calls onSearchChange with correct params', () => {
    const start = new Date(2021, 5, 10);
    const end = new Date(2021, 5, 14);
    const filters = {};
    const onSearchChange = jest.fn();
    const expectedParams = {
      start: moment(start).startOf('day').toISOString(),
      end: moment(end).endOf('day').toISOString(),
    };
    onDateFilterChange(start, end, filters, onSearchChange);
    expect(onSearchChange.mock.calls.length).toBe(1);
    expect(onSearchChange.mock.calls[0][0]).toStrictEqual(expectedParams);
  });
});

describe('onFilterChange', () => {
  test('calls onSearchChange with correct params when filter name and value exist', () => {
    const filterName = 'test';
    const filterValue = 'abc';
    const filters = {};
    const onSearchChange = jest.fn();
    const expectedParams = {
      test: filterValue
    };

    onFilterChange(filterName, filterValue, filters, onSearchChange);
    expect(onSearchChange.mock.calls.length).toBe(1);
    expect(onSearchChange.mock.calls[0][0]).toStrictEqual(expectedParams);
  });

  test('calls onSearchChange with correct params when filter name or value is falsy', () => {
    const filterName = 'test';
    const filterValue = '';
    const filters = { test: '123' };
    const onSearchChange = jest.fn();
    const expectedParams = {};

    onFilterChange(filterName, filterValue, filters, onSearchChange);
    expect(onSearchChange.mock.calls.length).toBe(1);
    expect(onSearchChange.mock.calls[0][0]).toStrictEqual(expectedParams);
  });
});

describe('onFavoriteFilterChange', () => {
  const filters = {};
  const onSearchChange = jest.fn();
  afterEach(() => {
    onSearchChange.mockClear();
  });

  test('calls onSearchChange with correct params when given filterValue is truthy', () => {
    const filterValue = true;
    const expectedParams = {};
    onFavoriteFilterChange(filterValue, filters, onSearchChange);
    expect(onSearchChange.mock.calls.length).toBe(1);
    expect(onSearchChange.mock.calls[0][0]).toStrictEqual(expectedParams);
  });

  test('calls onSearchChange with correct params when given filterValue is falsy', () => {
    const filterValue = false;
    const expectedParams = { is_favorite_resource: 'no' };
    onFavoriteFilterChange(filterValue, filters, onSearchChange);
    expect(onSearchChange.mock.calls.length).toBe(1);
    expect(onSearchChange.mock.calls[0][0]).toStrictEqual(expectedParams);
  });
});

describe('onReset', () => {
  test('calls correct functions', () => {
    const onSearchChange = jest.fn();
    const onShowOnlyFiltersChange = jest.fn();
    onReset(onSearchChange, onShowOnlyFiltersChange);

    expect(onSearchChange.mock.calls.length).toBe(1);
    expect(onSearchChange.mock.calls[0][0]).toStrictEqual({ is_favorite_resource: 'no' });
    expect(onShowOnlyFiltersChange.mock.calls.length).toBe(1);
    expect(onShowOnlyFiltersChange.mock.calls[0][0]).toStrictEqual([]);
  });
});

describe('hasFilters', () => {
  test('returns true when filters is not empty', () => {
    const filters = { test: 'abc' };
    expect(hasFilters(filters)).toBe(true);
  });

  test('returns true when filters is empty and favorites is missing', () => {
    const filters = {};
    expect(hasFilters(filters)).toBe(true);
  });

  describe('when filters has only favorites filter', () => {
    const filters = { is_favorite_resource: 'no' };

    test('returns false when showOnlyFilters is also empty', () => {
      const showOnlyFilters = {};
      expect(hasFilters(filters, showOnlyFilters)).toBe(false);
    });

    test('returns true when showOnlyFilters is not empty', () => {
      const showOnlyFilters = { test: 'abc' };
      expect(hasFilters(filters, showOnlyFilters)).toBe(true);
    });
  });
});

describe('getStatusOptions', () => {
  test('returns correct array', () => {
    const t = key => key;
    const expectedResult = [
      { value: constants.RESERVATION_STATE.CONFIRMED, label: t('common.confirmed') },
      { value: constants.RESERVATION_STATE.CANCELLED, label: t('common.cancelled') },
      { value: constants.RESERVATION_STATE.DENIED, label: t('common.denied') },
      { value: constants.RESERVATION_STATE.READY_FOR_PAYMENT, label: t('common.waitingForPayment') },
      { value: constants.RESERVATION_STATE.REQUESTED, label: t('common.requested') },
      { value: constants.RESERVATION_STATE.WAITING_FOR_CASH_PAYMENT, label: t('common.waitingForCashPayment') },
    ];
    expect(getStatusOptions(t)).toStrictEqual(expectedResult);
  });
});

describe('getShowOnlyOptions', () => {
  test('returns correct array', () => {
    const t = key => key;
    const expectedResult = [
      {
        value:
        constants.RESERVATION_SHOWONLY_FILTERS.FAVORITE,
        label: t('ManageReservationsFilters.showOnly.favoriteButtonLabel'),
      },
      {
        value:
        constants.RESERVATION_SHOWONLY_FILTERS.CAN_MODIFY,
        label: t('ManageReservationsFilters.showOnly.canModifyButtonLabel'),
      },
    ];

    expect(getShowOnlyOptions(t)).toStrictEqual(expectedResult);
  });
});
