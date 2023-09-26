
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import reducer from './maintenanceReducer';

describe('/state/reducers/ui/maintenanceReducer', () => {
  const initialState = Immutable({
    isMaintenanceModeOn: false
  });

  const action = {
    type: types.UI.SET_MAINTENANCE_MODE,
    payload: true
  };

  const expectedState = { isMaintenanceModeOn: true };

  test('initialState is correct', () => {
    const actual = reducer(undefined, { type: 'nothing' });
    expect(actual).toEqual(initialState);
  });

  test('returns correct state on SET_MAINTENANCE_MODE', () => {
    const actual = reducer(undefined, action);
    expect(actual).toEqual(expectedState);
  });

  test('returns correct state if no matching action type is given', () => {
    const actual = reducer(undefined, { type: types.API.RESOURCES_GET_SUCCESS });
    expect(actual).toEqual(initialState);
  });
});
