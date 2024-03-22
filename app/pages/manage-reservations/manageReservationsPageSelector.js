import { createSelector, createStructuredSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';
import { isAdminSelector } from 'state/selectors/authSelectors';
import { userFavouriteResourcesSelector, unitsSelector, resourcesSelector } from 'state/selectors/dataSelectors';
import { currentLanguageSelector } from 'state/selectors/translationSelectors';
import { fontSizeSelector } from '../../state/selectors/accessibilitySelectors';

const reservationsSelector = state => state.ui.pages.manageReservations.results;

const reservationsCountSelector = (state) => {
  if ('paginatedReservations' in state.data) {
    // wrapping object for count is named undefined
    return state.data.paginatedReservations.undefined.count;
  }
  return 0;
};

const unitsArraySelector = createSelector(
  unitsSelector,
  units => Object.values(units)
);

const manageReservationsPageSelector = createStructuredSelector({
  isAdmin: isAdminSelector,
  userFavoriteResources: userFavouriteResourcesSelector,
  locale: currentLanguageSelector,
  isFetchingUnits: requestIsActiveSelectorFactory(ActionTypes.API.UNITS_GET_REQUEST),
  isFetchingReservations: requestIsActiveSelectorFactory(ActionTypes.API.RESERVATIONS_GET_REQUEST),
  units: unitsArraySelector,
  reservations: reservationsSelector,
  reservationsTotalCount: reservationsCountSelector,
  resources: resourcesSelector,
  isFetchingResource: requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  fontSize: fontSizeSelector,
});

export default manageReservationsPageSelector;
