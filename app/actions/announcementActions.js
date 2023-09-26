import { createAction } from 'redux-actions';

import types from 'constants/ActionTypes';

export const setMaintenanceMode = createAction(types.UI.SET_MAINTENANCE_MODE);
