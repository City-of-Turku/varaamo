import forIn from 'lodash/forIn';
import includes from 'lodash/includes';
import { createSelector } from 'reselect';

const authUserSelector = state => state.auth.user;
const usersSelector = state => state.data.users;

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

function isLoggedInSelector(state) {
  return Boolean(state.auth.user);
}

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
    (resource, staffUnits) => includes(staffUnits, resource.unit)
  );
}

export {
  createIsStaffSelector,
  currentUserSelector,
  isAdminSelector,
  isLoggedInSelector,
  staffUnitsSelector,
};
