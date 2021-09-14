import ActionTypes from 'constants/ActionTypes';

import includes from 'lodash/includes';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import moment from 'moment';
import { createSelector, createStructuredSelector } from 'reselect';

import {
  isSuperUserSelector,
  isAdminSelector,
  isLoggedInSelector,
  isManagerForSelector,
} from 'state/selectors/authSelectors';
import { resourcesSelector, unitsSelector } from 'state/selectors/dataSelectors';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

const dateSelector = state => state.ui.pages.adminResources.date || moment().format('YYYY-MM-DD');
const resourceIdsSelector = state => state.ui.pages.adminResources.resourceIds;
const selectedResourceTypesSelector = state => state.ui.pages.adminResources.selectedResourceTypes;

/**
 * if staffStatus.isManagerFor:[] is undefined then an empty string [''] is returned.
 * if staffStatus.isSuperuser is true then returns all unit keys
 * @returns array of unit keys as strings
 */
const currentUserPermissionsSelector = createSelector(
  unitsSelector,
  isSuperUserSelector,
  isManagerForSelector,
  (units, isSuperUser, isManager) => {
    if (isSuperUser) return Object.keys(units);
    return isManager;
  }
);

/**
 * if staffStatus.isSuperuser then returns all resources,
 * else returns resources where resource.id is in favorites
 */
const adminResourcesSelectors = createSelector(
  resourceIdsSelector,
  resourcesSelector,
  isSuperUserSelector,
  (resourceIds, resources, isSuperUser) => {
    if (isSuperUser) return Object.values(resources);
    // filter undefined i.e. not found resources from results array
    return resourceIds.map(id => resources[id]).filter(resource => !!resource);
  }
);

/**
 * returns resources if resource.unit is in currentUserPermissions[]
 */
const adminResourcesSelector = createSelector(
  adminResourcesSelectors,
  currentUserPermissionsSelector,
  (resources, currentUserPermissions) => resources.filter(
    resource => includes(currentUserPermissions, resource.unit)
  )
);

// when all resource ids are found in resources data, resources are in sync
const areResourcesInSyncSelector = createSelector(
  resourceIdsSelector,
  resourcesSelector,
  (resourceIds, resources) => resourceIds.every(id => !!resources[id])
);

const adminResourceTypesSelector = createSelector(
  adminResourcesSelector,
  resources => uniq(resources.map(resource => resource.type.name))
);

const filteredAdminResourceSelector = createSelector(
  adminResourcesSelector,
  selectedResourceTypesSelector,
  currentUserPermissionsSelector,
  (resources, selectedResourceTypes, currentUserPermissions) => resources.filter(
    resource => (selectedResourceTypes.length === 0
    || includes(selectedResourceTypes, resource.type.name))
    && includes(currentUserPermissions, resource.unit)
  )
);

const filteredAdminResourcesIdsSelector = createSelector(
  filteredAdminResourceSelector,
  resources => sortBy(resources, 'name').map(res => res.id),
);

const adminResourcesPageSelector = createStructuredSelector({
  areResourcesInSync: areResourcesInSyncSelector,
  date: dateSelector,
  selectedResourceTypes: selectedResourceTypesSelector,
  isAdmin: isAdminSelector,
  isSuperUser: isSuperUserSelector,
  isLoggedin: isLoggedInSelector,
  isFetchingResources: requestIsActiveSelectorFactory(ActionTypes.API.RESOURCES_GET_REQUEST),
  resources: filteredAdminResourcesIdsSelector,
  resourceTypes: adminResourceTypesSelector,
});

export default adminResourcesPageSelector;
