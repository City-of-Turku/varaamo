import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import APP from '../../../constants/AppConstants';


const initialState = Immutable({
  isHighContrast: false,
  fontSize: APP.FONT_SIZES.SMALL
});

function toggleContrast(state) {
  return { ...state, isHighContrast: !state.isHighContrast };
}

function changeFontSize(state, data) {
  return { ...state, fontSize: data };
}

function accessibilityReducer(state = initialState, action) {
  switch (action.type) {
    case types.UI.CHANGE_CONTRAST: {
      return toggleContrast(state);
    }
    case types.UI.CHANGE_FONTSIZE: {
      return changeFontSize(state, action.payload);
    }
    default: {
      return state;
    }
  }
}

export default accessibilityReducer;
