import queryString from 'query-string';

import {
  getFetchParamsFromFilters,
  pickSupportedFilters,
  getFiltersFromUrl,
  getSearchFromFilters,
} from 'utils/searchUtils';
import { getDateStartAndEndTimes } from 'utils/timeUtils';

describe('Utils: searchUtils', () => {
  describe('getFetchParamsFromFilters', () => {
    const filters = {
      date: '2015-10-10',
      purpose: 'some-purpose',
      search: 'search-query',
      unsupported: 'filter',
    };

    test('changes date to end and start', () => {
      const params = getFetchParamsFromFilters(filters);
      const { start, end } = getDateStartAndEndTimes(filters.date);

      expect(params.start).toBe(start);
      expect(params.end).toBe(end);
    });

    test('does not return date', () => {
      const params = getFetchParamsFromFilters(filters);
      expect(params.date).toBeFalsy();
    });

    test('returns only supported filters beside end and start', () => {
      const params = getFetchParamsFromFilters(filters);
      expect(params.purpose).toBe(filters.purpose);
      expect(params.search).toBe(filters.search);
      expect(params.unsupported).toBeFalsy();
    });

    test('returns purpose as empty string if filters.purpose is "all"', () => {
      const params = getFetchParamsFromFilters({ purpose: 'all' });
      expect(params.purpose).toBe('');
    });
  });

  describe('pickSupportedFilters', () => {
    test('returns only supported filters', () => {
      const filters = {
        purpose: 'some-purpose',
        search: 'search-query',
        unsupported: 'invalid',
      };
      const expected = {
        purpose: 'some-purpose',
        search: 'search-query',
      };

      expect(pickSupportedFilters(filters)).toEqual(expected);
    });
  });

  describe('getFiltersFromUrl', () => {
    const location = { search: '?date=2021-05-25&state=confirmed&test=123' };

    test('returns correct filters when supported filters is not given', () => {
      expect(getFiltersFromUrl(location)).toStrictEqual({ date: '2021-05-25' });
    });

    test('returns correct filters when supported filters is given', () => {
      const supportedFilters = { date: '', state: '' };
      expect(getFiltersFromUrl(location, supportedFilters)).toStrictEqual({
        date: '2021-05-25',
        state: 'confirmed'
      });
    });

    test('returns correct filters when supported filters is set to false', () => {
      const supportedFilters = false;
      expect(getFiltersFromUrl(location, supportedFilters)).toStrictEqual({
        date: '2021-05-25',
        state: 'confirmed',
        test: '123',
      });
    });
  });

  describe('getSearchFromFilters', () => {
    test('returns correct query string when filters is not given', () => {
      expect(getSearchFromFilters()).toBe('');
    });

    test('returns correct query string when filters is given', () => {
      const filters = { test: 123, foo: 'bar' };
      const expected = queryString.stringify(
        Object.assign({}, filters)
      );
      expect(getSearchFromFilters(filters)).toBe(expected);
    });
  });
});
