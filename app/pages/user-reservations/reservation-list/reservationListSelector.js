import ActionTypes from 'constants/ActionTypes';

import { filter, orderBy, values } from 'lodash';
import { createSelector, createStructuredSelector } from 'reselect';

import { isAdminSelector, staffUnitsSelector } from 'state/selectors/authSelectors';
import { resourcesSelector, unitsSelector } from 'state/selectors/dataSelectors';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

const ownReservationsSelector = state => filter(
  state.data.reservations, reservation => reservation.isOwn
);

const sortedReservationsSelector = createSelector(
  ownReservationsSelector,
  reservations => orderBy(values(reservations), ['begin'], ['asc'])
);

const reservationListSelector = createStructuredSelector({
  isAdmin: isAdminSelector,
  isFetchingReservations: requestIsActiveSelectorFactory(ActionTypes.API.RESERVATIONS_GET_REQUEST),
  reservations: sortedReservationsSelector,
  resources: resourcesSelector,
  staffUnits: staffUnitsSelector,
  units: unitsSelector,
});

export default reservationListSelector;
