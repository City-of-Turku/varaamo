import types from 'constants/ActionTypes';

import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import uniq from 'lodash/uniq';
import filter from 'lodash/filter';
import Immutable from 'seamless-immutable';


const initialState = Immutable({
  resourceIds: [],
});

function favoritesPageReducer(state = initialState, action) {
  switch (action.type) {
    case types.API.RESOURCES_GET_SUCCESS: {
      const meta = action.meta;
      if (meta && meta.source === 'favoritesPage') {
        return state.merge({
          resourceIds: map(action.payload.entities.resources, 'id')
        });
      }
      return state;
    }

    default: {
      return state;
    }
  }
}

export default favoritesPageReducer;
