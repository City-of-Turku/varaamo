import constants from 'constants/AppConstants';

import omit from 'lodash/omit';
import pick from 'lodash/pick';
import moment from 'moment';
import queryString from 'query-string';

import { getDateStartAndEndTimes, getDateString } from 'utils/timeUtils';

function getFetchParamsFromFilters(filters) {
  const all = Object.assign(
    {},
    pickSupportedFilters(filters),
    getDateStartAndEndTimes(
      filters.date,
      filters.useTimeRange,
      filters.start,
      filters.end,
      filters.duration
    ),
    { purpose: filters.purpose === 'all' ? '' : filters.purpose },
    { page: filters.page || 1 }
  );

  return omit(all, 'date', 'duration', 'useTimeRange');
}

/**
 * Returns filter object values found in url search params
 * @param {object} location URL location object
 * @param {object} supportedFilters e.g. { date, start, end }. Can be given false/falsy
 * to ignore supported filters and to return all search params
 * @returns {object} filters as objects
 */
function getFiltersFromUrl(location, supportedFilters = constants.SUPPORTED_SEARCH_FILTERS) {
  const query = new URLSearchParams(location.search);
  const defaultDate = moment().format(constants.DATE_FORMAT);
  // const defaultMunicipality = getDefaultMunicipality();

  const filters = {
    // Give default date to populate start/end time as default when fetching resources,
    // Otherwise, reservations property under resource data will be
    // empty.
    date: defaultDate,
  };

  /*
  if (defaultMunicipality) {
    // Determine current version of Varaamo (Helsinki, Espoo, Vantaa)
    // and filter results to target that municipality by default.
    filters.municipality = defaultMunicipality;
  }
  */

  query.forEach((value, key) => {
    if (!supportedFilters || supportedFilters[key] !== undefined) {
      filters[key] = value;
    }
  });

  return filters;
}

/**
 * Converts filter object into url search params and returns it
 * @param {object} filters object containing filter objects
 * @returns {string} url query string
 */
function getSearchFromFilters(filters = {}) {
  const search = queryString.stringify(
    Object.assign({}, filters)
  );
  return search;
}

function getSearchPageUrl(filters = {}) {
  const query = queryString.stringify(
    Object.assign({}, filters, { date: getDateString(filters.date) })
  );

  return `/search?${query}`;
}

function pickSupportedFilters(filters) {
  return pick(filters, Object.keys(constants.SUPPORTED_SEARCH_FILTERS));
}

function textBoolean(value) {
  return value === 'true' || value === true;
}

export {
  getFetchParamsFromFilters,
  getFiltersFromUrl,
  getSearchFromFilters,
  getSearchPageUrl,
  pickSupportedFilters,
  textBoolean,
};
