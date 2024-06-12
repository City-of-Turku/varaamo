import moment from 'moment';

import { getState } from 'utils/testUtils';
import adminResourcesPageSelector from './adminResourcesPageSelector';

describe('pages/admin-resources/adminResourcesPageSelector', () => {
  function getSelected(extraState) {
    const state = getState(getUser(extraState));
    return adminResourcesPageSelector(state);
  }

  function getSuperSelected(extraState) {
    const state = getState(getSuperUser(extraState));
    return adminResourcesPageSelector(state);
  }

  function getUser(extra) {
    return {
      'auth.user.profile': {
        sub: '2019token'
      },
      'data.users.2019token': {
        staffStatus: {
          isStaff: true,
          isSuperuser: false,
          isManagerFor: ['unitID01']
        }
      },
      ...extra
    };
  }
  function getSuperUser(extra) {
    return {
      'auth.user.profile': {
        sub: '2019token'
      },
      'data.users.2019token': {
        staffStatus: {
          isStaff: true,
          isSuperuser: true,
        }
      },
      ...extra
    };
  }

  const resourceGenerator = (id, name, type, unit, canMakeReservationsForCustomer = false) => (
    {
      id,
      name: { fi: name },
      type: { name: type },
      unit,
      userPermissions: { canMakeReservationsForCustomer }
    }
  );

  test('returns isAdmin', () => {
    expect(getSelected().isAdmin).toBeDefined();
  });

  test('returns isSuperUser', () => {
    expect(getSelected().isSuperUser).toBeDefined();
  });

  test('returns isFetchingResources', () => {
    expect(getSelected().isFetchingResources).toBeDefined();
  });

  test('returns resources', () => {
    expect(getSelected().resources).toBeDefined();
  });

  test('returns selectedResourceTypes', () => {
    expect(getSelected().selectedResourceTypes).toBeDefined();
  });

  test('returns resourceTypes', () => {
    expect(getSelected().resourceTypes).toBeDefined();
  });

  test('returns externalResources', () => {
    expect(getSelected().externalResources).toBeDefined();
  });

  test('returns date', () => {
    const selected = getSelected({ 'ui.pages.adminResources': { date: '2017-02-01' } });
    expect(selected.date).toBe('2017-02-01');
  });

  test('returns current date by default', () => {
    const current = moment().format('YYYY-MM-DD');
    expect(getSelected().date).toBe(current);
  });

  test('returns an array of resource ids ordered by translated name', () => {
    const resource1 = resourceGenerator(1, 'Tatooine', 'school', 'unitID01');
    const resource2 = resourceGenerator(2, 'Dantooine', 'library', 'unitID01');
    const resource3 = resourceGenerator(3, 'Alderaan', 'printer', 'unitID01');
    const extraState = {
      'data.resources': {
        [resource1.id]: resource1,
        [resource2.id]: resource2,
        [resource3.id]: resource3,
      },
      'intl.locale': 'fi',
      'ui.pages.adminResources.resourceIds': [resource1.id, resource3.id],
    };
    const expected = [3, 1];
    const selected = getSelected(extraState);
    expect(selected.resources).toEqual(expected);
  });

  test('returns an empty array if user doesnt have manager rights for anything', () => {
    const resource1 = resourceGenerator('resourceID01', 'Tatooine', 'school', 'unitID01');
    const resource2 = resourceGenerator('resourceID02', 'Dantooine', 'library', 'unitID02');
    const extraState = {
      'data.users.2019token.staffStatus': {},
      'data.resources': {
        [resource1.id]: resource1,
        [resource2.id]: resource2,
      },
      'intl.locale': 'fi',
      'ui.pages.adminResources.resourceIds': [resource1.id],
    };
    const selected = getSelected(extraState);
    expect(selected.resources).toStrictEqual([]);
  });

  test('return an array of all resources from all units if the user isSuperUser', () => {
    const resource1 = resourceGenerator('resourceID01', 'Tatooine', 'room', 'unitID01');
    const resource2 = resourceGenerator('resourceID02', 'Dantooine', 'space', 'unitID02');
    const resource3 = resourceGenerator('resourceID03', 'Dagobah', 'work', 'unitID03');
    const resource4 = resourceGenerator('resourceID04', 'Hoth', 'library', 'unitID04');
    const extraState = {
      'data.resources': {
        [resource1.id]: resource1,
        [resource2.id]: resource2,
        [resource3.id]: resource3,
        [resource4.id]: resource4,
      },
      'data.units': {
        unitID01: {},
        unitID02: {},
        unitID03: {},
        unitID04: {},
      },
      'intl.locale': 'fi',
      'ui.pages.adminResources.resourceIds': [],
    };
    const selected = getSuperSelected(extraState);
    const expected = [resource3.id, resource2.id, resource4.id, resource1.id];
    expect(selected.resources).toEqual(expected);
  });

  test(
    'returns array of resource ids consisting of resources that are in a unit where user is a unit manager',
    () => {
      const resource1 = resourceGenerator('resourceID01', 'Tatooine', 'school', 'unitID01');
      const resource2 = resourceGenerator('resourceID02', 'Dantooine', 'library', 'unitID02');
      const resource3 = resourceGenerator('resourceID03', 'Alderaan', 'printer', 'unitID01');
      const resource4 = resourceGenerator('resourceID04', 'Dagobah', 'printer', 'unitID02');

      const extraState = {
        'data.resources': {
          [resource1.id]: resource1,
          [resource2.id]: resource2,
          [resource3.id]: resource3,
          [resource4.id]: resource4,
        },
        'ui.pages.adminResources.resourceIds': [resource1.id, resource2.id, resource3.id, resource4.id],
      };
      const selected = getSelected(extraState);
      const expected = [resource3.id, resource1.id];
      expect(selected.resources).toEqual(expected);
    }
  );

  test(
    'returns array of resource ids consisting of resources that are in various units when user is a unit group admin',
    () => {
      const resource1 = resourceGenerator('resourceID01', 'Tatooine', 'school', 'unitID01');
      const resource2 = resourceGenerator('resourceID02', 'Dantooine', 'library', 'unitID02');
      const resource3 = resourceGenerator('resourceID03', 'Alderaan', 'printer', 'unitID01');
      const resource4 = resourceGenerator('resourceID04', 'Dagobah', 'printer', 'unitID02');
      const resource5 = resourceGenerator('resourceID05', 'Hoth', 'workspace', 'unitID03');

      const extraState = {
        'data.resources': {
          [resource1.id]: resource1,
          [resource2.id]: resource2,
          [resource3.id]: resource3,
          [resource4.id]: resource4,
          [resource5.id]: resource5,
        },
        'ui.pages.adminResources.resourceIds': [resource1.id, resource2.id, resource3.id, resource4.id, resource5.id],
        'data.users.2019token.staffStatus.isManagerFor': ['unitID01', 'unitID02']
      };
      const selected = getSelected(extraState);
      const expected = [resource3.id, resource4.id, resource2.id, resource1.id];
      expect(selected.resources).toEqual(expected);
    }
  );

  test('returns only resources which are found with ids in admin resources id array', () => {
    const resource1 = resourceGenerator('resourceID01', 'Tatooine', 'school', 'unitID01');
    const resource2 = resourceGenerator('resourceID02', 'Dantooine', 'library', 'unitID02');

    const extraState = {
      'data.resources': {
        [resource1.id]: resource1,
        [resource2.id]: resource2,
      },
      'ui.pages.adminResources.resourceIds': [resource1.id, resource2.id, 'test-id-cannot-find'],
      'data.users.2019token.staffStatus.isManagerFor': ['unitID01', 'unitID02']
    };

    const selected = getSelected(extraState);
    const expected = [resource2.id, resource1.id];
    expect(selected.resources).toEqual(expected);
  });

  test('returns an array of resourceTypes', () => {
    const resource1 = resourceGenerator(1, 'Tatooine', 'school', 'unitID01');
    const resource2 = resourceGenerator(2, 'Dantooine', 'library', 'unitID01');
    const resource3 = resourceGenerator(3, 'Alderaan', 'printer', 'unitID01');
    const extraState = {
      'data.resources': {
        [resource1.id]: resource1,
        [resource2.id]: resource2,
        [resource3.id]: resource3,
      },
      'ui.pages.adminResources.resourceIds': [resource1.id, resource3.id],
    };
    const expected = ['school', 'printer'];
    const selected = getSelected(extraState);
    expect(selected.resourceTypes).toEqual(expected);
  });

  test('returns an array of resourceTypes according to user staff permissions', () => {
    const resource1 = resourceGenerator('resourceID01', 'Tatooine', 'school', 'unitID01');
    const resource2 = resourceGenerator('resourceID02', 'Dantooine', 'library', 'unitID02');
    const resource3 = resourceGenerator('resourceID03', 'Alderaan', 'printer', 'unitID01');
    const resource4 = resourceGenerator('resourceID04', 'Dagobah', 'studio', 'unitID01');

    const extraState = {
      'data.resources': {
        [resource1.id]: resource1,
        [resource2.id]: resource2,
        [resource3.id]: resource3,
        [resource4.id]: resource4,
      },
      'ui.pages.adminResources.resourceIds': [resource1.id, resource2.id, resource3.id, resource4.id],
    };

    const selected = getSelected(extraState);
    const expected = ['school', 'printer', 'studio'];
    expect(selected.resourceTypes).toEqual(expected);
  });

  test(
    'returns an array of selectedResourceTypes and filtered resourceIds',
    () => {
      const resource1 = resourceGenerator(1, 'Tatooine', 'school', 'unitID01');
      const resource2 = resourceGenerator(2, 'Dantooine', 'library', 'unitID01');
      const resource3 = resourceGenerator(3, 'Alderaan', 'printer', 'unitID01');
      const extraState = {
        'data.resources': {
          [resource1.id]: resource1,
          [resource2.id]: resource2,
          [resource3.id]: resource3,
        },
        'ui.pages.adminResources.selectedResourceTypes': ['school'],
        'ui.pages.adminResources.resourceIds': [resource1.id, resource3.id],
      };
      const selected = getSelected(extraState);
      expect(selected.selectedResourceTypes).toEqual(['school']);
      expect(selected.resources).toEqual([1]);
    }
  );
  test('externalResources is an array consisting of external resources', () => {
    // resources that the user can create reservations for even if they aren't staff for that unit.
    const resource1 = resourceGenerator(1, 'Room 1', 'work', 'unit01', false);
    const resource2 = resourceGenerator(2, 'Room 2', 'work', 'unit01', false);
    const resource3 = resourceGenerator(3, 'Room 3', 'work', 'unit01', false);
    const resource4 = resourceGenerator(4, 'IT Help 1', 'guidance', 'unit33', true);
    const resource5 = resourceGenerator(5, 'IT Help 2', 'guidance', 'unit33', true);

    const extraState = {
      'data.resources': {
        [resource1.id]: resource1,
        [resource2.id]: resource2,
        [resource3.id]: resource3,
        [resource4.id]: resource4,
        [resource5.id]: resource5
      },
      'intl.locale': 'fi',
      'ui.pages.adminResources.resourceIds': [resource1.id, resource2.id, resource3.id, resource4.id, resource5.id],
      'data.users.2019token.staffStatus.isManagerFor': ['unit01']
    };
    // should only contain resources that the user doesn't have any 'staff' rights to.
    const expected = [
      { id: resource4.id, name: resource4.name.fi }, { id: resource5.id, name: resource5.name.fi }
    ];
    const selected = getSelected(extraState);
    expect(selected.externalResources).toEqual(expected);
  });

  test('returns fontSize', () => {
    expect(getSelected().fontSize).toBeDefined();
  });
});
