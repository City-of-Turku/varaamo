import moment from 'moment';

import types from 'constants/ActionTypes';
import {
  favoriteResource,
  unfavoriteResource,
  fetchResources,
  fetchResource,
  fetchFavoritedResources
} from 'actions/resourceActions';
import { buildAPIUrl } from 'utils/apiUtils';
import { createApiTest } from 'utils/testUtils';

describe('Actions: resourceActions', () => {
  describe('fetchFavoritedResources', () => {
    const time = moment('2019-01-10');
    const source = 'adminResourcesPage';
    const params = {
      end: time.endOf('day').toISOString(),
      is_favorite: true,
      start: time.startOf('day').toISOString(),
    };
    const paramsAll = {
      end: time.endOf('day').toISOString(),
      start: time.startOf('day').toISOString(),
    };

    const include = 'order_detail';

    test('when source = adminResourcesPage and userIsSuperUser = false', () => {
      const actual = fetchFavoritedResources(time, source);
      const expected = fetchResources({ ...params, include }, source);
      expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected));
    });

    test('when source = adminResourcesPage and userIsSuperUser = true', () => {
      const actual = fetchFavoritedResources(time, source, true);
      const expected = fetchResources({ ...paramsAll, include }, source);
      expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected));
    });

    test('when source != adminResourcesPage and userIsSuperUser = false', () => {
      const actual = fetchFavoritedResources(time, 'favoritesPage');
      const expected = fetchResources(params, 'favoritesPage');
      expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected));
    });

    test('when source != adminResourcesPage and userIsSuperUser = true', () => {
      const actual = fetchFavoritedResources(time, 'favoritesPage', true);
      const expected = fetchResources(params, 'favoritesPage');
      expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected));
    });
  });

  describe('fetchResource', () => {
    const params = {
      start: moment('2019-01-10').subtract(2, 'M').startOf('month').format(),
      end: moment('2019-01-10').add(2, 'M').endOf('month').format(),
    };
    const resourceId = '321';

    createApiTest({
      name: 'fetchResource',
      action: fetchResource,
      args: [
        resourceId,
        params
      ],
      tests: {
        method: 'GET',
        endpoint: buildAPIUrl(`resource/${resourceId}`, params),
        request: {
          type: types.API.RESOURCE_GET_REQUEST,
        },
        success: {
          type: types.API.RESOURCE_GET_SUCCESS,
        },
        error: {
          type: types.API.RESOURCE_GET_ERROR
        }
      }
    });
  });

  describe('fetchResources', () => {
    const param = {
      end: moment('2017-01-10').endOf('day').toISOString(),
      is_favorite: true,
      start: moment('2017-01-10').startOf('day').toISOString(),
    };
    const source = 'adminResourcesPage';
    const fetchParams = Object.assign({}, param, { pageSize: 500 });
    createApiTest({
      name: 'fetchResources',
      action: fetchResources,
      args: [
        param,
        source],
      tests: {
        method: 'GET',
        endpoint: buildAPIUrl('resource', fetchParams),
        request: {
          type: types.API.RESOURCES_GET_REQUEST,
        },
        success: {
          type: types.API.RESOURCES_GET_SUCCESS,
          extra: {
            tests: {
              'correct source': ({ meta }) => {
                expect(meta.source).toBe(source);
              }
            }
          }
        },
        error: {
          type: types.API.RESOURCES_GET_ERROR,
        }
      }
    });
  });
  describe('favoriteResource', () => {
    const resourceId = '123';

    createApiTest({
      name: 'favorite',
      action: favoriteResource,
      args: [resourceId],
      tests: {
        method: 'POST',
        endpoint: buildAPIUrl(`resource/${resourceId}/favorite`),
        request: {
          type: types.API.RESOURCE_FAVORITE_POST_REQUEST,
        },
        success: {
          type: types.API.RESOURCE_FAVORITE_POST_SUCCESS,
          extra: {
            tests: {
              'contains resource id in meta': ({ meta }) => {
                expect(meta.id).toBe(resourceId);
              },
            },
          },
        },
        error: {
          type: types.API.RESOURCE_FAVORITE_POST_ERROR,
        },
      },
    });
  });

  describe('unfavoriteResource', () => {
    const resourceId = '123';

    createApiTest({
      name: 'unfavorite',
      action: unfavoriteResource,
      args: [resourceId],
      tests: {
        method: 'POST',
        endpoint: buildAPIUrl(`resource/${resourceId}/unfavorite`),
        request: {
          type: types.API.RESOURCE_UNFAVORITE_POST_REQUEST,
        },
        success: {
          type: types.API.RESOURCE_UNFAVORITE_POST_SUCCESS,
          extra: {
            tests: {
              'contains resource id in meta': ({ meta }) => {
                expect(meta.id).toBe(resourceId);
              },
            },
          },
        },
        error: {
          type: types.API.RESOURCE_UNFAVORITE_POST_ERROR,
        },
      },
    });
  });
});
