import Immutable from 'seamless-immutable';
import simple from 'simple-mock';
import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import { Link } from 'react-router-dom';

import { getMainImage } from 'utils/imageUtils';
import { getResourcePageUrlComponents } from 'utils/resourceUtils';
import ResourceAvailability from 'shared/resource-card/label';
import { shallowWithIntl } from 'utils/testUtils';
import FavoriteItem from './favoriteItem';
import Resource from 'utils/fixtures/Resource';

describe('/pages/favorites/favoriteItem', () => {
  const defaultProps = {
    resource: Immutable(Resource.build({
      images: [{ url: 'www.url.com', type: 'main', caption: 'captionText' }],
    })),
    currentLanguage: 'fi',
    date: '2019-10-10',
    actions: {
      unfavoriteResource: simple.stub(),
      favoriteResource: simple.stub(),
    },
    handleClick: () => null,
    isLarger: false,
    key: 1,
  };

  // eslint-disable-next-line max-len
  const { pathname, query } = getResourcePageUrlComponents(defaultProps.resource, defaultProps.date);

  const linkTo = {
    pathname,
    search: query ? `?${query}` : undefined,
    state: { fromSearchResults: false },
  };

  const imgObj = getMainImage(defaultProps.resource.images);

  function getItem(extraProps) {
    return shallowWithIntl(<FavoriteItem {...defaultProps} {...extraProps} />);
  }

  describe('the first wrapper Col', () => {
    function getCol(extraProps) {
      return getItem(extraProps);
    }

    test('render when normal fontsize', () => {
      const element = getCol().find(Col).first();
      expect(element).toHaveLength(1);
      expect(element.prop('lg')).toBe(3);
      expect(element.prop('md')).toBe(4);
      expect(element.prop('sm')).toBe(6);
      expect(element.prop('xs')).toBe(12);
    });

    test('render when larger fontsize', () => {
      const element = getCol({ isLarger: true }).find(Col).first();
      expect(element).toHaveLength(1);
      expect(element.prop('lg')).toBe(4);
    });
  });

  describe('main Col .favorite-container', () => {
    function getWrapper(extraProps) {
      return getItem({ extraProps }).find(Col).find('.favorite-container');
    }

    test('returns the main Col favorite-container', () => {
      const element = getWrapper();
      expect(element).toHaveLength(1);
      expect(element.prop('xs')).toBe(12);
    });

    describe('favorite-image-container', () => {
      function getImageContainer(extraProps) {
        return getWrapper({ extraProps }).find('.favorite-image-container');
      }
      test('contains image container Col', () => {
        const element = getImageContainer();
        expect(element).toHaveLength(1);
        expect(element.prop('className')).toBe('favorite-image-container');
        expect(element.prop('aria-hidden')).toBe('true');
        expect(element.prop('xs')).toBe(12);
      });

      test('contains Link', () => {
        const element = getImageContainer().find(Link);
        expect(element).toHaveLength(1);
        expect(element.prop('aria-hidden')).toBe('true');
        expect(element.prop('onClick')).toBe(defaultProps.handleClick);
        expect(element.prop('tabIndex')).toBe('-1');
        expect(element.prop('to')).toEqual(linkTo);
      });

      test('contains img inside the Link', () => {
        const element = getImageContainer().find(Link).find('img');
        expect(element).toHaveLength(1);
        expect(element.prop('alt')).toBe(imgObj.caption);
        expect(element.prop('className')).toBe('favorite-image');
        expect(element.prop('src')).toBe(imgObj.url);
      });
    });

    describe('favorite-content', () => {
      function getContentContainer(extraProps) {
        return getWrapper(extraProps).find('.favorite-content');
      }

      test('returns Col favorite-content', () => {
        const element = getContentContainer();
        expect(element).toHaveLength(1);
        expect(element.prop('xs')).toBe(12);
      });

      describe('favorite-title', () => {
        test('contains favorite-title', () => {
          const element = getContentContainer().find('.favorite-title');
          expect(element).toHaveLength(1);
          expect(element.prop('xs')).toBe(12);
        });

        test('contains Link', () => {
          const element = getContentContainer().find(Link);
          expect(element).toHaveLength(1);
          expect(element.prop('onClick')).toBe(defaultProps.handleClick);
          expect(element.prop('to')).toEqual(linkTo);
        });

        test('contains h2', () => {
          const element = getContentContainer().find('h2');
          expect(element).toHaveLength(1);
          expect(element.text()).toBeDefined();
        });
      });

      describe('favorite-availability', () => {
        test('returns favorite-availability', () => {
          const element = getContentContainer().find('.favorite-availability');
          expect(element).toHaveLength(1);
          expect(element.prop('className')).toBe('favorite-availability');
          expect(element.prop('xs')).toBe(12);
        });

        test('contains ResourceAvailability component', () => {
          const component = getContentContainer().find(ResourceAvailability);
          expect(component).toHaveLength(1);
          expect(component.prop('date')).toBe(defaultProps.date);
          expect(component.prop('resource')).toBe(defaultProps.resource);
        });

        describe('contains button', () => {
          function getButton(extraProps) {
            return getItem(extraProps).find('button');
          }

          test('with correct props when isFavorite true', () => {
            const resource = Resource.build({
              isFavorite: true
            });
            const element = getButton({ resource });

            expect(element).toHaveLength(1);
            expect(element.prop('onClick')).toBeTruthy();
            expect(element.prop('title')).toBe('ResourceCard.infoTitle.removeFavorite');
            expect(element.prop('type')).toBe('button');
          });

          test('contains img with correct props when isFavorite is true', () => {
            const resource = Resource.build({ isFavorite: true });
            const image = getItem({ resource }).find('.app-ResourceCard__info-cell__icon');
            expect(image.length).toBe(1);
            expect(image.prop('alt')).toBe('');
            expect(image.prop('src')).toBeDefined();
          });

          test('with correct props when isFavorite false', () => {
            const resource = Resource.build({
              isFavorite: false
            });
            const element = getButton({ resource });

            expect(element).toHaveLength(1);
            expect(element.prop('onClick')).toBeTruthy();
            expect(element.prop('title')).toBe('ResourceCard.infoTitle.addFavorite');
            expect(element.prop('type')).toBe('button');
          });

          test('contains img with correct props when isFavorite is false', () => {
            const resource = Resource.build({ isFavorite: false });
            const image = getItem({ resource }).find('.app-ResourceCard__info-cell__icon');
            expect(image.length).toBe(1);
            expect(image.prop('alt')).toBe('');
            expect(image.prop('src')).toBeDefined();
          });
        });
      });

      describe('favorite-description', () => {
        test('returns Col favorite-description', () => {
          const element = getContentContainer().find('.favorite-description');
          expect(element).toHaveLength(1);
          expect(element.prop('className')).toBe('favorite-description');
          expect(element.prop('xs')).toBe(12);
        });
      });
    });
  });
});
