
import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import {
  changeAdminResourcesPageDate,
  selectAdminResourceType,
  unselectAdminResourceType,
} from 'actions/uiActions';
import Resource from 'utils/fixtures/Resource';
import adminResourcesPageReducer from './adminResourcesPageReducer';

describe('state/reducers/ui/adminResourcesPageReducer', () => {
  describe('initial state', () => {
    const initialState = adminResourcesPageReducer(undefined, {});

    test('resourceIds is an empty array', () => {
      expect(initialState.resourceIds).toEqual([]);
    });

    test('date is undefined', () => {
      expect(initialState.date).toBeUndefined();
    });

    test('resourceMinPeriod is an empty obj', () => {
      expect(initialState.resourceMinPeriod).toEqual({});
    });

    test('resourceMaxPeriod is an empty obj', () => {
      expect(initialState.resourceMaxPeriod).toEqual({});
    });
  });

  describe('handling actions', () => {
    describe('UI.CHANGE_ADMIN_RESOURCES_PAGE_DATE', () => {
      test('updates date from payload', () => {
        const date = '2017-01-20';
        const state = adminResourcesPageReducer(undefined, changeAdminResourcesPageDate(date));
        expect(state.date).toBe(date);
      });

      test('sets date to undefined if set to null', () => {
        const state = adminResourcesPageReducer(undefined, changeAdminResourcesPageDate(null));
        expect(state.date).toBeUndefined();
      });
    });

    describe('UI.FILTER_ADMIN_RESOURCE_TYPE', () => {
      test('updates filtered types from payload', () => {
        const resourceType = 'new type';
        const state = adminResourcesPageReducer(undefined, selectAdminResourceType(resourceType));
        expect(state.selectedResourceTypes).toEqual([resourceType]);
      });

      test('does not duplicate types in array', () => {
        const resourceType = 'new type';
        const initialState = Immutable({
          selectedResourceTypes: [resourceType],
        });
        const state = adminResourcesPageReducer(
          initialState,
          selectAdminResourceType(resourceType)
        );
        expect(state.selectedResourceTypes).toEqual([resourceType]);
      });
    });

    describe('UI.UNFILTER_ADMIN_RESOURCE_TYPE', () => {
      test('removes resource type from payload', () => {
        const resourceType = 'type';
        const removedResourceType = 'old type';
        const initialState = Immutable({
          selectedResourceTypes: [removedResourceType, resourceType],
        });
        const state = adminResourcesPageReducer(
          initialState,
          unselectAdminResourceType(removedResourceType)
        );
        expect(state.selectedResourceTypes).toEqual([resourceType]);
      });
    });

    describe('API.RESOURCES_GET_SUCCESS', () => {
      const getResourceSuccess = createAction(
        types.API.RESOURCES_GET_SUCCESS,
        payload => payload,
        (payload, meta) => meta
      );
      const resourcesList = [
        Resource.build(),
        Resource.build(),
        Resource.build(),
      ];

      const resources = {
        [resourcesList[0].id]: {
          id: resourcesList[0].id,
          maxPeriod: '10:00:00',
          minPeriod: '01:00:00',
        },
        [resourcesList[1].id]: {
          id: resourcesList[1].id,
          maxPeriod: '06:00:00',
          minPeriod: '02:00:00',
        },
        [resourcesList[2].id]: {
          id: resourcesList[2].id,
          maxPeriod: '12:00:00',
          minPeriod: '03:00:00',
        },

      };

      describe('with correct meta source', () => {
        let action;

        beforeAll(() => {
          action = getResourceSuccess(
            {
              entities: { resources },
            },
            { source: 'adminResourcesPage' }
          );
        });

        test('adds maxPeriod from action', () => {
          const initialState = Immutable({
            resourceMaxPeriod: {}
          });
          const nextState = adminResourcesPageReducer(initialState, action);
          expect(nextState.resourceMaxPeriod).toEqual({
            [resourcesList[0].id]: '10:00:00',
            [resourcesList[1].id]: '06:00:00',
            [resourcesList[2].id]: '12:00:00',
          });
        });

        test('adds minPeriod from action', () => {
          const initialState = Immutable({
            resourceMinPeriod: {}
          });
          const nextState = adminResourcesPageReducer(initialState, action);
          expect(nextState.resourceMinPeriod).toEqual({
            [resourcesList[0].id]: '01:00:00',
            [resourcesList[1].id]: '02:00:00',
            [resourcesList[2].id]: '03:00:00',
          });
        });

        test('adds resources ids from action', () => {
          const initialState = Immutable({
            resourceIds: [],
            resourceMaxPeriod: {}
          });
          const nextState = adminResourcesPageReducer(initialState, action);
          expect(nextState.resourceIds).toEqual([
            resourcesList[0].id,
            resourcesList[1].id,
            resourcesList[2].id,
          ]);
        });

        test('overrides resources ids from action', () => {
          const initialState = Immutable({
            resourceIds: ['1', '2', '3'],
          });
          const nextState = adminResourcesPageReducer(initialState, action);
          expect(nextState.resourceIds).toEqual([
            resourcesList[0].id,
            resourcesList[1].id,
            resourcesList[2].id,
          ]);
        });
      });
      describe('with incorrect meta source', () => {
        let action;

        beforeAll(() => {
          action = getResourceSuccess({
            entities: {
              resources: { resources },
            },
          });
        });

        test(
          'does not add resources ids to state if meta source is not adminResourcesPage',
          () => {
            const initialState = Immutable({
              resourceIds: [],
            });
            const nextState = adminResourcesPageReducer(initialState, action);

            expect(nextState.resourceIds).toEqual([]);
          }
        );
      });

      describe('which are not public', () => {
        const publicResource = Resource.build();
        const nonPublicResource = Resource.build({ public: false });

        let action;
        beforeAll(() => {
          action = getResourceSuccess(
            {
              entities: {
                resources: {
                  [publicResource.id]: publicResource,
                  [nonPublicResource.id]: nonPublicResource,
                },
              },
            },
            { source: 'adminResourcesPage' }
          );
        });

        test('adds resources ids to state', () => {
          const initialState = Immutable({
            resourceIds: [],
          });
          const nextState = adminResourcesPageReducer(initialState, action);

          expect(nextState.resourceIds).toEqual([publicResource.id, nonPublicResource.id]);
        });
      });
    });
  });
});
