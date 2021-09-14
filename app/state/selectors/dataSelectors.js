import { createSelector } from 'reselect';

import { createTranslatedSelector } from 'state/selectors/translationSelectors';
import { currentUserSelector, hasStrongAuthSelector } from './authSelectors';
import { isStrongAuthSatisfied } from 'utils/resourceUtils';

const purposesSelector = createTranslatedSelector(state => state.data.purposes);
const reservationsSelector = state => state.data.reservations;
const resourcesSelector = createTranslatedSelector(state => state.data.resources);
const unitsSelector = createTranslatedSelector(state => state.data.units);

function createResourceSelector(idSelector) {
  return createSelector(
    resourcesSelector,
    idSelector,
    (resources, id) => resources[id] || {}
  );
}

const userFavouriteResourcesSelector = createSelector(
  currentUserSelector, userData => userData && userData.favoriteResources,
);
function createStrongAuthSatisfiedSelector(resourceSelector) {
  return createSelector(
    resourceSelector,
    hasStrongAuthSelector,
    (resource, hasStrongAuth) => isStrongAuthSatisfied(resource, hasStrongAuth)
  );
}

export {
  createResourceSelector,
  purposesSelector,
  reservationsSelector,
  resourcesSelector,
  unitsSelector,
  userFavouriteResourcesSelector,
  createStrongAuthSatisfiedSelector,
};
