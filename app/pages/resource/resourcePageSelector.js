import ActionTypes from 'constants/ActionTypes';

import { createSelector, createStructuredSelector } from 'reselect';

import { isAdminSelector, isLoggedInSelector } from 'state/selectors/authSelectors';
import { createResourceSelector, unitsSelector } from 'state/selectors/dataSelectors';
import { contrastSelector } from 'state/selectors/accessibilitySelectors';
import { currentLanguageSelector } from 'state/selectors/translationSelectors';
import dateSelector from 'state/selectors/dateSelector';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

const contrastOptionsSelector = state => contrastSelector(state);
const resourceIdSelector = (state, props) => props.match && props.match.params.id;
const resourceSelector = createResourceSelector(resourceIdSelector);
const showMapSelector = state => state.ui.resourceMap.showMap;
const unitSelector = createSelector(
  resourceSelector,
  unitsSelector,
  (resource, units) => units[resource.unit] || {}
);

function calendarLinkSelector(state, props) {
  // Selects calendar link related to the resource, so it can be used to render link information.
  return state.resourceOutlookLinks
    && props.match
    && state.resourceOutlookLinks[props.match.params.id];
}

function canCreateCalendarLinkSelector(state) {
  return state.resourceOutlookLinks
    && state.resourceOutlookLinks.canCreate === true;
}

const resourcePageSelector = createStructuredSelector({
  date: dateSelector,
  id: resourceIdSelector,
  isAdmin: isAdminSelector,
  isFetchingResource: requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  isLoggedIn: isLoggedInSelector,
  resource: resourceSelector,
  showMap: showMapSelector,
  unit: unitSelector,
  contrast: contrastOptionsSelector,
  currentLanguage: currentLanguageSelector,
  calendarLink: calendarLinkSelector,
  canCreateCalendarLink: canCreateCalendarLinkSelector,
});

export default resourcePageSelector;
