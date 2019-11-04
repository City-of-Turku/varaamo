import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { intlReducer } from 'react-intl-redux';
import { reducer as oidcReducer } from 'redux-oidc';

import apiReducers from './reducers/api';
import dataReducer from './reducers/dataReducer';
import notificationsReducer from './reducers/notificationsReducer';
import uiReducers from './reducers/ui';
import recurringReservations from './recurringReservations';

export default combineReducers({
  api: apiReducers,
  auth: oidcReducer,
  data: dataReducer,
  form: formReducer,
  intl: intlReducer,
  notifications: notificationsReducer,
  recurringReservations: recurringReservations.reducer,
  ui: uiReducers,
});
