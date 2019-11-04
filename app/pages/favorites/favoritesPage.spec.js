import React from 'react';
import Loader from 'react-loader';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import PageWrapper from 'pages/PageWrapper';
import { shallowWithIntl } from 'utils/testUtils';
import Resource from 'utils/fixtures/Resource';
import FavoriteItem from './favoriteItem';
import { UnconnectedFavoritesPage as FavoritesPage } from './favoritesPage';

describe('/pages/favorites/favoritesPage', () => {
  const history = {
    replace: () => {}
  };
  const defaultProps = {
    actions: {
      fetchFavoritedResources: simple.stub(),
      fetchUnits: simple.stub(),
      clearFavorites: simple.stub(),
    },
    date: '2019-10-31',
    fontSize: '__font-size-large',
    isLargerFontSize: false,
    isFetchingResources: false,
    resources: [],
    resourcesLoaded: true,
    location: {
      pathname: '/path/name',
      search: '?search',
      state: {
        scrollTop: 0,
      }
    },
    history,
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<FavoritesPage {...defaultProps} {...extraProps} />);
  }

  describe('component methods', () => {
    const fetchFavoritedResources = simple.mock();
    const fetchUnits = simple.mock();
    const clearFavorites = simple.mock();
    const historyMock = simple.mock(history, 'replace');

    beforeEach(() => {
      fetchFavoritedResources.reset();
      fetchUnits.reset();
      clearFavorites.reset();
    });

    const location = {
      pathname: '/path/name',
      search: '?search',
      state: {
        scrollTop: 0,
      }
    };
    const prop = {
      actions: { fetchFavoritedResources, fetchUnits, clearFavorites },
      location,
    };

    test('componentDidMount calls fetchFavoritedResources', () => {
      const wrapper = getWrapper(prop);
      wrapper.instance().componentDidMount();
      expect(fetchFavoritedResources.callCount).toBe(1);
    });

    test('componentDidMount calls fetchUnits', () => {
      const wrapper = getWrapper(prop);
      wrapper.instance().componentDidMount();
      expect(fetchUnits.callCount).toBe(1);
    });

    test('componentWillUnmount calls clearFavorites', () => {
      const wrapper = getWrapper(prop);
      wrapper.instance().componentWillUnmount();
      expect(clearFavorites.callCount).toBe(1);
    });

    test('handleLinkClick', () => {
      const wrapper = getWrapper(prop);
      wrapper.instance().handleLinkClick();
      expect(historyMock.callCount).toBe(1);
      expect(historyMock.lastCall.args).toEqual([location]);
    });

    test('fetchResources', () => {
      const wrapper = getWrapper(prop);
      wrapper.instance().fetchResources();
      expect(fetchFavoritedResources.callCount).toBe(1);
      expect(fetchUnits.callCount).toBe(1);
    });
  });

  describe('render', () => {
    test('returns PageWrapper component', () => {
      const element = getWrapper().find(PageWrapper);
      expect(element).toHaveLength(1);
      expect(element.prop('title')).toBe('Navbar.userFavorites');
    });

    describe('Loader component', () => {
      test('returns false when isFetchingResources = true', () => {
        const element = getWrapper({ isFetchingResources: true }).find(Loader);
        expect(element).toHaveLength(1);
        expect(element.prop('loaded')).toBe(false);
      });

      test('returns true when isFetchingResources = false', () => {
        const element = getWrapper({ isFetchingResources: false }).find(Loader);
        expect(element).toHaveLength(1);
        expect(element.prop('loaded')).toBe(true);
      });
      test('returns true when resources.length > 0 and fetching is false', () => {
        const element = getWrapper({ resources: [Immutable(Resource.build())] }).find(Loader);
        expect(element).toHaveLength(1);
        expect(element.prop('loaded')).toBe(true);
      });
      test('returns false when resources.length is 0 and fetching is true', () => {
        const element = getWrapper({ isFetchingResources: true }).find(Loader);
        expect(element).toHaveLength(1);
        expect(element.prop('loaded')).toBe(false);
      });
    });

    test('returns correct h1 when resourcesLoaded', () => {
      const element = getWrapper().find('h1');
      expect(element).toHaveLength(1);
      expect(element.text()).toBe('Navbar.userFavorites');
    });

    test('returns correct h1 when !resourcesLoaded', () => {
      const element = getWrapper({ resourcesLoaded: false }).find('h1');
      expect(element).toHaveLength(1);
      expect(element.text()).toBe('Notifications.errorMessage');
    });

    describe('favorites-list', () => {
      test('favorite-row className when isBiggestFontSize', () => {
        const element = getWrapper().find('.favorite-row__large');
        expect(element).toHaveLength(1);
        expect(element.prop('className')).toBe('favorite-row__large');
      });

      test('favorite-row className when !isBiggestFontSize', () => {
        const element = getWrapper({ fontSize: '__font-size-small' }).find('.favorite-row');
        expect(element).toHaveLength(1);
        expect(element.prop('className')).toBe('favorite-row');
      });
    });

    describe('FavoriteItem', () => {
      const resources = [
        Immutable(Resource.build()),
        Immutable(Resource.build()),
        Immutable(Resource.build()),
        Immutable(Resource.build()),
      ];
      let wrapper;
      beforeAll(() => {
        wrapper = getWrapper({ resources });
      });

      beforeEach(() => {

      });

      test('renders all objects in resources', () => {
        const elements = wrapper.find(FavoriteItem);
        expect(elements).toHaveLength(4);
      });

      test('renders correct resource to first FavoriteItem', () => {
        const elements = wrapper.find(FavoriteItem);
        const instance = wrapper.instance();
        expect(elements.first().prop('actions')).toBe(defaultProps.actions);
        expect(elements.first().prop('date')).toBe(defaultProps.date);
        expect(elements.first().prop('handleClick')).toBe(instance.handleLinkClick);
        expect(elements.first().prop('isLarger')).toBe(defaultProps.isLargerFontSize);
        expect(elements.first().prop('resource')).toBe(resources[0]);
      });

      test('renders correct resource to second FavoriteItem', () => {
        const elements = wrapper.find(FavoriteItem);
        expect(elements.at(1).prop('resource')).toBe(resources[1]);
      });
      test('renders correct resource to second FavoriteItem', () => {
        const elements = wrapper.find(FavoriteItem);
        expect(elements.at(2).prop('resource')).toBe(resources[2]);
      });
      test('renders correct resource to second FavoriteItem', () => {
        const elements = wrapper.find(FavoriteItem);
        expect(elements.at(3).prop('resource')).toBe(resources[3]);
      });
    });
  });
});
