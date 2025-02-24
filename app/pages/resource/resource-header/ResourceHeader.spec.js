import React from 'react';
import { FormattedNumber } from 'react-intl';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import FavoriteButton from 'shared/favorite-button';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import { shallowWithIntl } from 'utils/testUtils';
import ResourceHeader from './ResourceHeader';
import { getMaxPeriodText } from 'utils/resourceUtils';

describe('pages/resource/resource-header/ResourceHeader', () => {
  const unit = Unit.build({ name: 'Test Unit' });
  const resource = Resource.build({ unit: Unit.id, maxPeriod: '01:00:00' });
  const defaultProps = {
    onBackClick: () => null,
    onMapClick: () => null,
    isLoggedIn: false,
    resource: Immutable(resource),
    showBackButton: true,
    showMap: false,
    unit: Immutable(unit),
    showOutlookCalendarLinkButton: false,
  };

  function getWrapper(props) {
    return shallowWithIntl(<ResourceHeader {...defaultProps} {...props} />);
  }

  describe('render', () => {
    describe('Back button', () => {
      test('renders when enabled', () => {
        const backButton = getWrapper({ showBackButton: true }).find(
          '.app-ResourceHeader__back-button'
        );

        expect(backButton).toHaveLength(1);
        expect(backButton.prop('onClick')).toBe(defaultProps.onBackClick);
      });

      test('does not render when not enabled', () => {
        const backButton = getWrapper({ showBackButton: false }).find(
          '.app-ResourceHeader__back-button'
        );

        expect(backButton).toHaveLength(0);
      });
    });

    test('renders title button', () => {
      const h1 = getWrapper().find('h1');

      expect(h1).toHaveLength(1);
      expect(h1.text()).toBe(resource.name);
    });

    describe('Type info', () => {
      test('renders type image with correct props', () => {
        const infos = getWrapper().find('.app-ResourceHeader__info');
        const images = infos.find('img');

        expect(images).toHaveLength(5);

        expect(images.at(0).prop('alt')).toBe('ResourceHeader.purpose');
      });
    });

    describe('Capacity info', () => {
      test('renders type image with correct props', () => {
        const infos = getWrapper().find('.app-ResourceHeader__info');
        const images = infos.find('img');

        expect(images).toHaveLength(5);

        expect(images.at(1).prop('alt')).toBe('ResourceHeader.capacity');
      });
    });

    describe('Max time info', () => {
      const t = value => value;

      describe('when max time exists', () => {
        const resourceA = Resource.build({ maxPeriod: '01:30:00' });
        const timeInfo = getWrapper({ resource: resourceA }).find('#resource-header-max-period');
        test('renders type image with correct props', () => {
          const image = timeInfo.find('img');
          expect(image.prop('alt')).toBe('ResourceHeader.maxTime');
        });

        test('renders type span text', () => {
          const span = timeInfo.find('.app-ResourceHeader__info-label');
          expect(span.text()).toBe(`Max ${getMaxPeriodText(t, resourceA)}`);
        });
      });

      test('is not rendered when max time does not exist', () => {
        const resourceA = Resource.build({ maxPeriod: '' });
        const resourceB = Resource.build({ maxPeriod: '00:00:00' });
        const timeInfoA = getWrapper({ resource: resourceA }).find('#resource-header-max-period');
        const timeInfoB = getWrapper({ resource: resourceB }).find('#resource-header-max-period');
        expect(timeInfoA).toHaveLength(0);
        expect(timeInfoB).toHaveLength(0);
      });
    });

    describe('Price info', () => {
      test('renders type image with correct props', () => {
        const infos = getWrapper().find('.app-ResourceHeader__info');
        const images = infos.find('img');

        expect(images).toHaveLength(5);

        expect(images.at(3).prop('alt')).toBe('ResourceHeader.price');
      });
    });


    describe('Unit info', () => {
      function createProps(resourceProps) {
        return {
          resource: Immutable(Resource.build({ maxPeriod: '01:00:00', ...resourceProps })),
        };
      }

      test('renders unit image with correct props when distance is used', () => {
        const props = createProps({ distance: 11500 });

        const infos = getWrapper(props).find('.app-ResourceHeader__info');
        const images = infos.find('img');

        expect(images).toHaveLength(5);

        expect(images.at(4).prop('alt')).toBe('ResourceHeader.distanceAndPremise');
      });

      test('renders unit image with correct props when distance is not used', () => {
        const infos = getWrapper().find('.app-ResourceHeader__info');
        const images = infos.find('img');

        expect(images).toHaveLength(5);

        expect(images.at(4).prop('alt')).toBe('ResourceHeader.premise');
      });


      test('renders unit name with distance', () => {
        const { name } = defaultProps.unit;
        const props = createProps({ distance: 11500 });

        const info = getWrapper(props).find('#app-ResourceHeader__info--unit-name');
        expect(info).toHaveLength(1);
        expect(info.text()).toContain(` km, ${name}`);

        const number = info.find(FormattedNumber);
        expect(number.prop('value')).toBe(12);
      });

      test('renders unit name with distance < 10', () => {
        const { name } = defaultProps.unit;
        const props = createProps({ distance: 1412 });

        const info = getWrapper(props).find('#app-ResourceHeader__info--unit-name');
        expect(info).toHaveLength(1);
        expect(info.text()).toContain(` km, ${name}`);

        const number = info.find(FormattedNumber);
        expect(number.prop('value')).toBe(1.4);
      });

      test('does not render distance if resource has no distance', () => {
        const { name } = defaultProps.unit;
        const props = createProps({});
        const expected = name;
        const info = getWrapper(props).find('#app-ResourceHeader__info--unit-name');

        expect(info).toHaveLength(1);
        expect(info.text()).toBe(expected);
      });
    });

    test('renders toggleMap button with correct props when showMap false', () => {
      const toggleMapButton = getWrapper().find('.app-ResourceHeader__map-button');
      const img = toggleMapButton.find('img');
      const span = toggleMapButton.find('span');

      expect(toggleMapButton).toHaveLength(1);
      expect(toggleMapButton.prop('onClick')).toBe(defaultProps.onMapClick);
      expect(img).toHaveLength(1);
      expect(img.prop('alt')).toBe('');
      expect(span).toHaveLength(1);
      expect(span.text()).toBe('ResourceHeader.mapButton');
    });

    test('renders toggleMap button with correct props when showMap true', () => {
      const toggleMapButton = getWrapper({ showMap: true }).find('.app-ResourceHeader__map-button');
      const img = toggleMapButton.find('img');
      const span = toggleMapButton.find('span');

      expect(toggleMapButton).toHaveLength(1);
      expect(toggleMapButton.prop('onClick')).toBe(defaultProps.onMapClick);
      expect(img.prop('alt')).toBe('');
      expect(span).toHaveLength(1);
      expect(span.text()).toBe('ResourceHeader.resourceButton');
    });

    describe('FavoriteButton', () => {
      test('is not rendered if user is not admin', () => {
        const favoriteButton = getWrapper({ isLoggedIn: false }).find(FavoriteButton);

        expect(favoriteButton.length).toBe(0);
      });

      test('is rendered with correct props if user is admin', () => {
        const favoriteButton = getWrapper({ isLoggedIn: true }).find(FavoriteButton);

        expect(favoriteButton.length).toBe(1);
        expect(favoriteButton.prop('resource')).toEqual(defaultProps.resource);
      });
    });

    describe('Calendar button', () => {
      test('should not be present if switched off', () => {
        // Arrange
        const component = getWrapper({
          showOutlookCalendarLinkButton: false,
        });
        // Act
        const linkCreateButton = component.find('.app-ResourceHeader__calendar-link-create-button');
        const linkRemoveButton = component.find('.app-ResourceHeader__calendar-link-remove-button');
        // Assert
        expect(linkCreateButton.length).toBe(0);
        expect(linkRemoveButton.length).toBe(0);
      });

      test('should create calendar if link does not exist', () => {
        // Arrange
        const createFuncMock = simple.mock();
        const component = getWrapper({
          showOutlookCalendarLinkButton: true,
          outlookLinkExists: false,
          onOutlookCalendarLinkCreateClick: createFuncMock,
        });
        // Act
        const linkButton = component.find('.calendar-link-button');
        // Assert
        expect(linkButton.length).not.toBe(0);
        linkButton.prop('onClick')();
        expect(createFuncMock.callCount).toBe(1);
      });

      test('should remove calendar if link does not exist', () => {
        // Arrange
        const removeFuncMock = simple.mock();
        const component = getWrapper({
          showOutlookCalendarLinkButton: true,
          outlookLinkExists: true,
          onOutlookCalendarLinkRemoveClick: removeFuncMock,
        });
        // Act
        const linkButton = component.find('.calendar-link-button');
        // Assert
        expect(linkButton.length).not.toBe(0);
        linkButton.prop('onClick')();
        expect(removeFuncMock.callCount).toBe(1);
      });
    });
  });
});
