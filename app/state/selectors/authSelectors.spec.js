import User from 'utils/fixtures/User';
import { getState } from 'utils/testUtils';
import {
  authUserSelector,
  currentUserSelector,
  isAdminSelector,
  isLoadingUserSelector,
  isLoggedInSelector,
  staffUnitsSelector,
} from './authSelectors';

describe('state/selectors/authSelectors', () => {
  describe('authUserSelector', () => {
    test('returns user', () => {
      const user = { profile: {} };
      const state = getState({ auth: { user } });
      expect(authUserSelector(state)).toEqual(user);
    });
  });

  describe('currentUserSelector', () => {
    function getSelected(extraState) {
      const state = getState(extraState);
      return currentUserSelector(state);
    }

    test('returns user corresponding to the auth.userId', () => {
      const user = User.build();
      const selected = getSelected({
        auth: {
          user: {
            profile: {
              sub: user.id
            },
          },
        },
        'data.users': { [user.id]: user },
      });
      expect(selected).toEqual(user);
    });

    test('returns an empty object if logged in user data does not exist', () => {
      const selected = getSelected({
        auth: {
          user: {
            profile: {
              sub: 'u-999'
            },
          },
        },
      });
      expect(selected).toEqual({});
    });

    test('returns an empty object if user is not logged in', () => {
      const user = User.build();
      const selected = getSelected({
        auth: { user: null },
        'data.users': { [user.id]: user },
      });
      expect(selected).toEqual({});
    });
  });

  describe('isAdminSelector', () => {
    function getSelected(user = {}) {
      const state = getState({
        auth: {
          user: {
            profile: {
              sub: user.id
            }
          }
        },
        'data.users': { [user.id]: user },
      });
      return isAdminSelector(state);
    }

    test('returns false if user is not logged in', () => {
      const user = {};
      expect(getSelected(user)).toBe(false);
    });

    test('returns false if user.isStaff is false', () => {
      const user = { id: 'u-1', isStaff: false };
      expect(getSelected(user)).toBe(false);
    });

    test('returns true if user.isStaff is true', () => {
      const user = { id: 'u-1', isStaff: true };
      expect(getSelected(user)).toBe(true);
    });
  });

  describe('isLoadingUserSelector', () => {
    test('returns bool isLoadingUser', () => {
      const isLoadingUser = true;
      const state = getState({ auth: { isLoadingUser } });
      expect(isLoadingUserSelector(state)).toEqual(isLoadingUser);
    });
  });

  describe('isLoggedInSelector', () => {
    function getSelected({ user }) {
      const state = getState({ auth: { user } });
      return isLoggedInSelector(state);
    }

    test('returns true if user is defined', () => {
      expect(getSelected({ user: {} })).toBe(true);
    });
  });

  describe('staffUnitsSelector', () => {
    function getSelected(user) {
      const state = {
        auth: {
          user: {
            profile: {
              sub: user.id
            },
          },
        },
        data: {
          users: { [user.id]: user },
        },
      };
      return staffUnitsSelector(state);
    }

    test(
      'returns unit ids where user has can_approve_reservation permission',
      () => {
        const user = User.build({
          staffPerms: {
            unit: {
              'unit-1': ['can_approve_reservation'],
              'unit-2': ['can_approve_reservation'],
            },
          },
        });
        const selected = getSelected(user);
        const expected = ['unit-1', 'unit-2'];

        expect(selected).toEqual(expected);
      }
    );

    test(
      'does not return unit ids where user does not have can_approve_reservation permission',
      () => {
        const user = User.build({
          staffPerms: {
            unit: {
              'unit-1': ['can_approve_something_else'],
              'unit-2': ['can_approve_reservation'],
              'unit-3': [],
            },
          },
        });
        const selected = getSelected(user);
        const expected = ['unit-2'];

        expect(selected).toEqual(expected);
      }
    );

    test('returns an empty array if user has no staff permissions', () => {
      const user = User.build();
      const selected = getSelected(user);

      expect(selected).toEqual([]);
    });

    test(
      'returns an empty array if user has no staff permissions for units',
      () => {
        const user = User.build({
          staffPerms: {
            unit: {},
          },
        });
        const selected = getSelected(user);

        expect(selected).toEqual([]);
      }
    );
  });
});
