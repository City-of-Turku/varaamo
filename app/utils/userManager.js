import { createUserManager } from 'redux-oidc';
import { WebStorageStateStore } from 'oidc-client';

const baseUrl = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;

const userManagerConfig = {
  client_id: SETTINGS.CLIENT_ID,
  redirect_uri: `${baseUrl}/callback`,
  response_type: 'id_token token',
  scope: `openid profile ${SETTINGS.OPENID_AUDIENCE}`,
  authority: 'https://testitunnistamo.turku.fi',
  post_logout_redirect_uri: `${baseUrl}/logout/callback`,
  automaticSilentRenew: true,
  silent_redirect_uri: `${baseUrl}/silent-renew`,
  stateStore: new WebStorageStateStore({ store: localStorage }),
  userStore: new WebStorageStateStore({ store: localStorage })
};

const userManager = createUserManager(userManagerConfig);

export default userManager;
