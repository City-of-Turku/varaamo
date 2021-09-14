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

  test('returns date', () => {
    const selected = getSelected({ 'ui.pages.adminResources': { date: '2017-02-01' } });
    expect(selected.date).toBe('2017-02-01');
  });

  test('returns current date by default', () => {
    const current = moment().format('YYYY-MM-DD');
    expect(getSelected().date).toBe(current);
  });

  test('returns an array of resource ids ordered by translated name', () => {
    const resource1 = {
      id: 1, name: { fi: 'Tatooine' }, type: { name: 'school' }, unit: 'unitID01'
    };
    const resource2 = {
      id: 2, name: { fi: 'Dantooine' }, type: { name: 'library' }, unit: 'unitID01'
    };
    const resource3 = {
      id: 3, name: { fi: 'Alderaan' }, type: { name: 'printer' }, unit: 'unitID01'
    };
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
    const resource1 = {
      id: 'resourceID01', name: { fi: 'Tatooine' }, type: { name: 'school' }, unit: 'unitID01'
    };
    const resource2 = {
      id: 'resourceID02', name: { fi: 'Dantooine' }, type: { name: 'library' }, unit: 'unitID02'
    };
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
    const resource1 = {
      id: 'resourceID01', name: { fi: 'Tatooine' }, type: { name: 'room' }, unit: 'unitID01'
    };
    const resource2 = {
      id: 'resourceID02', name: { fi: 'Dantooine' }, type: { name: 'space' }, unit: 'unitID02'
    };
    const resource3 = {
      id: 'resourceID03', name: { fi: 'Dagobah' }, type: { name: 'work' }, unit: 'unitID03'
    };
    const resource4 = {
      id: 'resourceID04', name: { fi: 'Hoth' }, type: { name: 'library' }, unit: 'unitID04'
    };
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
      const resource1 = {
        id: 'resourceID01', name: { fi: 'Tatooine' }, type: { name: 'school' }, unit: 'unitID01'
      };
      const resource2 = {
        id: 'resourceID02', name: { fi: 'Dantooine' }, type: { name: 'library' }, unit: 'unitID02'
      };
      const resource3 = {
        id: 'resourceID03', name: { fi: 'Alderaan' }, type: { name: 'printer' }, unit: 'unitID01'
      };
      const resource4 = {
        id: 'resourceID04', name: { fi: 'Dagobah' }, type: { name: 'printer' }, unit: 'unitID02'
      };

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
      const resource1 = {
        id: 'resourceID01', name: { fi: 'Tatooine' }, type: { name: 'school' }, unit: 'unitID01'
      };
      const resource2 = {
        id: 'resourceID02', name: { fi: 'Dantooine' }, type: { name: 'library' }, unit: 'unitID02'
      };
      const resource3 = {
        id: 'resourceID03', name: { fi: 'Alderaan' }, type: { name: 'printer' }, unit: 'unitID01'
      };
      const resource4 = {
        id: 'resourceID04', name: { fi: 'Dagobah' }, type: { name: 'printer' }, unit: 'unitID02'
      };
      const resource5 = {
        id: 'resourceID05', name: { fi: 'Hoth' }, type: { name: 'workspace' }, unit: 'unitID03'
      };

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
    const resource1 = {
      id: 'resourceID01', name: { fi: 'Tatooine' }, type: { name: 'school' }, unit: 'unitID01'
    };
    const resource2 = {
      id: 'resourceID02', name: { fi: 'Dantooine' }, type: { name: 'library' }, unit: 'unitID02'
    };

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
    const resource1 = {
      id: 1, name: { fi: 'Tatooine' }, type: { name: 'school' }, unit: 'unitID01'
    };
    const resource2 = {
      id: 2, name: { fi: 'Dantooine' }, type: { name: 'library' }, unit: 'unitID01'
    };
    const resource3 = {
      id: 3, name: { fi: 'Alderaan' }, type: { name: 'printer' }, unit: 'unitID01'
    };
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
    const resource1 = {
      id: 'resourceID01', name: { fi: 'Tatooine' }, type: { name: 'school' }, unit: 'unitID01'
    };
    const resource2 = {
      id: 'resourceID02', name: { fi: 'Dantooine' }, type: { name: 'library' }, unit: 'unitID02'
    };
    const resource3 = {
      id: 'resourceID03', name: { fi: 'Alderaan' }, type: { name: 'printer' }, unit: 'unitID01'
    };
    const resource4 = {
      id: 'resourceID04', name: { fi: 'Dagobah' }, type: { name: 'studio' }, unit: 'unitID01'
    };

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
      const resource1 = {
        id: 1, name: { fi: 'Tatooine' }, type: { name: 'school' }, unit: 'unitID01'
      };
      const resource2 = {
        id: 2, name: { fi: 'Dantooine' }, type: { name: 'library' }, unit: 'unitID01'
      };
      const resource3 = {
        id: 3, name: { fi: 'Alderaan' }, type: { name: 'printer' }, unit: 'unitID01'
      };
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
});
