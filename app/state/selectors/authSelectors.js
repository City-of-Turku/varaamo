import forIn from 'lodash/forIn';
import includes from 'lodash/includes';
import { createSelector } from 'reselect';

import { isStaffForResource, isAdminForResource, isManagerForResource } from 'utils/resourceUtils';

const authUserSelector = state => state.auth.user;
const usersSelector = state => state.data.users;
const isLoadingUserSelector = state => state.auth.isLoadingUser;

const currentUserSelector = createSelector(
  authUserSelector,
  usersSelector,
  (userId, users) => {
    if (userId) {
      return users[userId.profile.sub] || {};
    }
    return {};
  }
);

const isAdminSelector = createSelector(
  currentUserSelector,
  currentUser => Boolean(currentUser.isStaff)
);

const isSuperUserSelector = createSelector(
  currentUserSelector,
  currentUser => Boolean(currentUser.staffStatus && currentUser.staffStatus.isSuperuser)
);

const isManagerForSelector = createSelector(
  currentUserSelector,
  (currentUser) => {
    if (!currentUser.staffStatus || !currentUser.staffStatus.isManagerFor) {
      return [];
    }
    const units = currentUser.staffStatus.isManagerFor;
    return units;
  }
);

const hasStrongAuthSelector = createSelector(
  currentUserSelector,
  currentUser => Boolean(currentUser.isStrongAuth)
);

function isLoggedInSelector(state) {
  return Boolean(state.auth.user);
}

const loginExpiresAtSelector = createSelector(
  authUserSelector,
  (user) => {
    if (user) {
      return user.expires_at;
    }
    return null;
  }
);

const staffUnitsSelector = createSelector(
  currentUserSelector,
  (currentUser) => {
    if (!currentUser.staffPerms || !currentUser.staffPerms.unit) {
      return [];
    }
    const units = [];
    forIn(currentUser.staffPerms.unit, (value, key) => {
      if (includes(value, 'can_approve_reservation')) {
        units.push(key);
      }
    });
    return units;
  }
);

function createIsStaffSelector(resourceSelector) {
  return createSelector(
    resourceSelector,
    staffUnitsSelector,
    (resource, staffUnits) => includes(staffUnits, resource.unit) || isStaffForResource(resource)
  );
}

function createIsAdminForResourceSelector(resourceSelector) {
  return createSelector(
    resourceSelector,
    (resource) => isAdminForResource(resource)
  );
}

function createIsManagerForResourceSelector(resourceSelector) {
  return createSelector(
    resourceSelector,
    (resource) => isManagerForResource(resource)
  );
}

const authUserAmrSelector = createSelector(
  authUserSelector,
  (user) => {
    if (user && 'profile' in user && 'amr' in user.profile) {
      return user.profile.amr;
    }
    return '';
  }
);

export {
  authUserSelector,
  authUserAmrSelector,
  createIsStaffSelector,
  currentUserSelector,
  isAdminSelector,
  isSuperUserSelector,
  isLoadingUserSelector,
  isLoggedInSelector,
  loginExpiresAtSelector,
  staffUnitsSelector,
  isManagerForSelector,
  hasStrongAuthSelector,
  createIsAdminForResourceSelector,
  createIsManagerForResourceSelector,
};
