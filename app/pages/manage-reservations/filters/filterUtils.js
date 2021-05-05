import constants from 'constants/AppConstants';

import { isEmpty, omit } from 'lodash';
import moment from 'moment';

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

export function onReset(onSearchChange, onShowOnlyFiltersChange) {
  onShowOnlyFiltersChange();
  // Reset show only filters by giving empty selection
  onSearchChange({});
}

export function hasFilters(filters, showOnlyFilters) {
  return !isEmpty(omit(filters, 'page')) || !isEmpty(showOnlyFilters);
}

export function getStatusOptions(t) {
  return [
    { value: constants.RESERVATION_STATE.CONFIRMED, label: t('common.confirmed') },
    { value: constants.RESERVATION_STATE.CANCELLED, label: t('common.cancelled') },
    { value: constants.RESERVATION_STATE.DENIED, label: t('common.denied') },
    { value: constants.RESERVATION_STATE.REQUESTED, label: t('common.requested') },
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
