import ActionTypes from 'constants/ActionTypes';

import { createSelector, createStructuredSelector } from 'reselect';

import { resourcesSelector } from 'state/selectors/dataSelectors';
import { getDateString } from 'utils/timeUtils';
import { isLargerFontSizeSelector } from 'state/selectors/accessibilitySelectors';
import { isLoggedInSelector } from 'state/selectors/authSelectors';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

const dateSelector = () => getDateString();
const resourcesLoadedSelector = state => !state.api.shouldFetch.resources;

const userFavoritesSelector = state => state.ui.pages.favorites.resourceIds;

const fontSizeSelector = state => state.ui.accessibility.fontSize;

const filteredResources = createSelector(
  resourcesSelector,
  userFavoritesSelector,
  (resources, resourceIds) => resourceIds.map(id => resources[id])
);


const favoritesPageSelector = createStructuredSelector({
  date: dateSelector,
  isLoggedIn: isLoggedInSelector,
  isFetchingResources: requestIsActiveSelectorFactory(ActionTypes.API.RESOURCES_GET_REQUEST),
  resources: filteredResources,
  resourcesLoaded: resourcesLoadedSelector,
  fontSize: fontSizeSelector,
  isLargerFontSize: isLargerFontSizeSelector,
});

export default favoritesPageSelector;
