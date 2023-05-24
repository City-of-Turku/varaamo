import 'react-app-polyfill/ie11';
import { browserName } from 'react-device-detect';
import 'location-origin';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-intl-redux';
import { OidcProvider, processSilentRenew } from 'redux-oidc';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore } from 'redux';
import Immutable from 'seamless-immutable';

import '../app/assets/styles/main.scss';
import '../app/assets/styles/customization/espoo/customization.scss';
import '../app/assets/styles/customization/vantaa/customization.scss';
// eslint-disable-next-line import/no-unresolved
import '@city-assets/sass/main.scss';
import { initI18n } from '../app/i18n';
import configureStore from '../app/store/configureStore';
import rootReducer from '../app/state/rootReducer';
import getRoutes from './routes';
import BrowserWarning from '../app/pages/browser-warning';
import userManager from 'utils/userManager';

const initialStoreState = createStore(rootReducer, {}).getState();
const initialServerState = window.INITIAL_STATE;
const initialIntlState = initI18n();
const finalState = Immutable(initialStoreState).merge([initialServerState, initialIntlState], {
  deep: true,
});
const store = configureStore(finalState);

if (window.Cypress) {
  window.store = store;
}

const isIEBrowser = browserName === 'IE';

if (window.location.pathname === '/silent-renew') {
  processSilentRenew();
} else {
  // TODO: Support IE11 in the future.
  render(
    isIEBrowser ? <BrowserWarning />
      : (
        <Provider store={store}>
          <OidcProvider store={store} userManager={userManager}>
            <Router>{getRoutes()}</Router>
          </OidcProvider>
        </Provider>
      ),
    document.getElementById('root')
  );
}
