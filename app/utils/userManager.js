import { createUserManager } from 'redux-oidc';
import { WebStorageStateStore } from 'oidc-client';

const baseUrl = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;

function safeSetting(key) {
  // eslint-disable-next-line no-underscore-dangle
  const fromWindow = typeof window !== 'undefined' && window.__SETTINGS__ && window.__SETTINGS__[key];
  if (typeof fromWindow === 'string') return fromWindow;
  const fromPlugin = typeof SETTINGS !== 'undefined' && SETTINGS && SETTINGS[key];
  return typeof fromPlugin === 'string' ? fromPlugin : '';
}

const userManagerConfig = {
  client_id: safeSetting('CLIENT_ID'),
  redirect_uri: `${baseUrl}/callback`,
  response_type: 'id_token token',
  scope: `openid profile ${safeSetting('OPENID_AUDIENCE')}`,
  authority: safeSetting('OPENID_AUTHORITY'),
  post_logout_redirect_uri: `${baseUrl}/logout/callback`,
  automaticSilentRenew: true,
  silent_redirect_uri: `${baseUrl}/silent-renew`,
  stateStore: new WebStorageStateStore({ store: localStorage }),
  userStore: new WebStorageStateStore({ store: localStorage })
};

const userManager = createUserManager(userManagerConfig);

export default userManager;
