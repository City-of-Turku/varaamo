import types from 'constants/ActionTypes';

import map from 'lodash/map';
import Immutable from 'seamless-immutable';

import Resource from 'utils/fixtures/Resource';
import reducer from './favoritesPageReducer';

describe('/state/reducers/ui/favoritesPageReducer', () => {
  const initialState = Immutable({
    resourceIds: []
  });

  const action = {
    type: types.API.RESOURCES_GET_SUCCESS,
    meta: {
      source: 'favoritesPage',
    },
    payload: {
      entities: {
        resources: [
          Immutable(Resource.build()),
          Immutable(Resource.build()),
          Immutable(Resource.build()),
        ]
      }
    }
  };

  const expectedState = {
    resourceIds: [
      action.payload.entities.resources[0].id,
      action.payload.entities.resources[1].id,
      action.payload.entities.resources[2].id,
    ]
  };

  test('initialState is correct', () => {
    const actual = reducer(undefined, { type: 'nothing' });
    expect(actual).toEqual(initialState);
  });

  test('maps resources.ids to resourceIds when action has correct values', () => {
    const actual = reducer(undefined, action);
    expect(actual).toEqual(expectedState);
  });

  test('return state if action doesnt have meta', () => {
    const actual = reducer(undefined, { type: types.API.RESOURCES_GET_SUCCESS });
    expect(actual).toEqual(initialState);
  });

  test('return state if action.meta.source isnt favoritesPage', () => {
    const actual = reducer(undefined, {
      type: types.API.RESOURCES_GET_SUCCESS,
      meta: { source: 'searchPage' },
      payload: {
        entities: {
          resources: [
            Immutable(Resource.build()),
            Immutable(Resource.build()),
            Immutable(Resource.build()),
          ]
        }
      }
    });
    expect(actual).toEqual(initialState);
  });

  test('return initialState on CLEAR_FAVORITES', () => {
    let actual = reducer(undefined, action);
    expect(actual).toEqual(expectedState);
    actual = reducer(expectedState, { type: types.UI.CLEAR_FAVORITES });
    expect(actual).toEqual(initialState);
  });

  test('returns state on default', () => {
    let actual = reducer(undefined, action);
    expect(actual).toEqual(expectedState);
    actual = reducer(expectedState, { type: 'thisIsWrong' });
    expect(actual).toEqual(expectedState);
  });
});
