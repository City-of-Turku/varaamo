import ActionTypes from 'constants/ActionTypes';

import { createSelector, createStructuredSelector } from 'reselect';
import first from 'lodash/first';
import isEmpty from 'lodash/isEmpty';
import orderBy from 'lodash/orderBy';
import queryString from 'query-string';

import {
  createIsStaffSelector,
  currentUserSelector,
  isAdminSelector,
  isLoggedInSelector,
  loginExpiresAtSelector,
  authUserAmrSelector,
} from 'state/selectors/authSelectors';
import { createResourceSelector, unitsSelector } from 'state/selectors/dataSelectors';
import dateSelector from 'state/selectors/dateSelector';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';
import { contrastSelector } from 'state/selectors/accessibilitySelectors';
import { currentLanguageSelector } from 'state/selectors/translationSelectors';
import { getAllowedCustomerGroups, getUniqueCustomerGroups } from './reservation-products/ReservationProductsUtils';
import { hasProducts } from '../../utils/reservationUtils';

const selectedSelector = state => orderBy(state.ui.reservations.selected, 'begin');
const createdSelector = (state) => {
  const toShow = orderBy(state.ui.reservations.toShow, 'begin');
  return !isEmpty(toShow) ? first(toShow) : null;
};
const editedSelector = (state) => {
  const toShowEdited = orderBy(state.ui.reservations.toShowEdited, 'begin');
  return !isEmpty(toShowEdited) ? first(toShowEdited) : null;
};
const toEditSelector = state => first(state.ui.reservations.toEdit);
const resourceIdSelector = (state, props) => {
  const query = props && props.location ? queryString.parse(props.location.search) : {};
  return query.resource;
};
const resourceSelector = createResourceSelector(resourceIdSelector);
const unitSelector = createSelector(
  resourceSelector,
  unitsSelector,
  (resource, units) => units[resource.unit] || {}
);

const uniqueCustomerGroupsSelector = createSelector(
  resourceSelector,
  authUserAmrSelector,
  (resource, loginMethod) => {
    if (hasProducts(resource)) {
      return getAllowedCustomerGroups(
        getUniqueCustomerGroups(resource), loginMethod
      );
    }
    return [];
  }
);

const reservationPageSelector = createStructuredSelector({
  contrast: contrastSelector,
  currentLanguage: currentLanguageSelector,
  date: dateSelector,
  isAdmin: isAdminSelector,
  isLoggedIn: isLoggedInSelector,
  isStaff: createIsStaffSelector(resourceSelector),
  isFetchingResource: requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  isMakingReservations: requestIsActiveSelectorFactory(ActionTypes.API.RESERVATION_POST_REQUEST),
  loginExpiresAt: loginExpiresAtSelector,
  selected: selectedSelector,
  state: state => state,
  resourceId: resourceIdSelector,
  resource: resourceSelector,
  reservationToEdit: toEditSelector,
  reservationCreated: createdSelector,
  reservationEdited: editedSelector,
  unit: unitSelector,
  uniqueCustomerGroups: uniqueCustomerGroupsSelector,
  user: currentUserSelector,
});

export default reservationPageSelector;
