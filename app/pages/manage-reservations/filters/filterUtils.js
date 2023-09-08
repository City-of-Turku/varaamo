
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import moment from 'moment';

import constants from 'constants/AppConstants';

export function onDateFilterChange(start, end, filters, onSearchChange) {
  // start and end must be parseable by moment e.g. Date objs or valid date strings
  let startFilter = start;
  let endFilter = end;

  if (start && !end) {
    endFilter = startFilter;
  }
  if (end && !start) {
    startFilter = endFilter;
  }

  startFilter = moment(startFilter);
  endFilter = moment(endFilter);

  // If user searches with end before start, add 1 day.
  if (startFilter.diff(endFilter) > 0) {
    endFilter = startFilter.add(1, 'days');
  }

  startFilter = startFilter.startOf('day').toISOString();
  endFilter = endFilter.endOf('day').toISOString();

  const newFilters = Object.assign({}, filters, { start: startFilter, end: endFilter });

  onSearchChange(omit(newFilters, 'page'));
}

export function onFilterChange(filterName, filterValue, filters, onSearchChange) {
  const newFilters = {
    ...omit(filters, filterName),
  };

  if (filterValue && !isEmpty(filterValue)) {
    newFilters[filterName] = filterValue;
  }

  onSearchChange(omit(newFilters, 'page'));
}

/**
 * Handles adding and removing favorite filter. When filter value is true
 * favorites filter is removed because the filter works reversely. When the filter
 * value is false, favorites filter is added with value "no".
 * @param {boolean} filterValue
 * @param {object} filters
 * @param {function} onSearchChange
 */
export function onFavoriteFilterChange(filterValue, filters, onSearchChange) {
  if (filterValue) {
    onFilterChange('is_favorite_resource', false, filters, onSearchChange);
  } else {
    onFilterChange('is_favorite_resource', 'no', filters, onSearchChange);
  }
}

export function onReset(onSearchChange, onShowOnlyFiltersChange) {
  // Reset filters by giving empty selections
  onShowOnlyFiltersChange([]);
  // favorites filter works reversely and expects negative value when not in use
  onSearchChange({ is_favorite_resource: 'no' });
}

export function hasFilters(filters, showOnlyFilters) {
  // favorites work in a reverse way i.e. when it's present it's not in use
  return !isEmpty(omit(filters, ['page', 'date', 'is_favorite_resource'])) || !isEmpty(showOnlyFilters)
    || !('is_favorite_resource' in filters);
}

export function getStatusOptions(t) {
  return [
    { value: constants.RESERVATION_STATE.CONFIRMED, label: t('common.confirmed') },
    { value: constants.RESERVATION_STATE.CANCELLED, label: t('common.cancelled') },
    { value: constants.RESERVATION_STATE.DENIED, label: t('common.denied') },
    { value: constants.RESERVATION_STATE.READY_FOR_PAYMENT, label: t('common.waitingForPayment') },
    { value: constants.RESERVATION_STATE.REQUESTED, label: t('common.requested') },
    { value: constants.RESERVATION_STATE.WAITING_FOR_CASH_PAYMENT, label: t('common.waitingForCashPayment') },
  ];
}

export function getShowOnlyOptions(t) {
  return [
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
}
