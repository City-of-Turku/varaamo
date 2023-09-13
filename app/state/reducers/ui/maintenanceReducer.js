import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';

const initialState = Immutable({
  isMaintenanceModeOn: false,
});

function maintenanceReducer(state = initialState, action) {
  switch (action.type) {
    case types.UI.SET_MAINTENANCE_MODE: {
      return state.merge({
        isMaintenanceModeOn: action.payload
      });
    }

    default: {
      return state;
    }
  }
}

export default maintenanceReducer;
