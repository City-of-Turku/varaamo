import React from 'react';
import { Link } from 'react-router-dom';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';
import iconHeart from 'hel-icons/dist/shapes/heart-o.svg';

import BackgroundImage from 'shared/background-image';
import Image from 'utils/fixtures/Image';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import { getResourcePageUrlComponents } from 'utils/resourceUtils';
import { shallowWithIntl } from 'utils/testUtils';
import ResourceAvailability from './label/ResourceAvailability';
import { UnconnectedResourceCard } from './ResourceCard';
import UnpublishedLabel from 'shared/label/Unpublished';
import ResourceCardInfoCell from './info';
import iconHeartWhite from 'assets/icons/heart-white.svg';

describe('shared/resource-card/ResourceCard', () => {
  function getResource(extra) {
    return Immutable(
      Resource.build({
        equipment: [
          {
            id: '1',
            name: 'television',
          },
          {
            id: '2',
            name: 'printer',
          },
        ],
        images: [Image.build()],
        maxPricePerHour: '30',
        peopleCapacity: '16',
        type: {
          name: 'workplace',
        },
        description: 'some description text',
        ...extra,
      })
    );
  }

  const history = {
    push: () => { },
    replace: () => { },
  };

  const defaultProps = {
    actions: {
      favoriteResource: jest.fn(),
      unfavoriteResource: jest.fn(),
    },
    history,
    date: '2015-10-10',
    isLoggedIn: false,
    location: {
      pathname: 'somepath',
      search: 'somesearch',
      state: {
        scrollTop: 123,
      },
    },
    resource: getResource(),
    unit: Immutable(
      Unit.build({
        id: 'unit_value',
        name: 'unit_name',
        addressZip: '00100',
        municipality: 'helsinki',
        streetAddress: 'Fabiankatu',
      })
    ),
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<UnconnectedResourceCard {...defaultProps} {...extraProps} />);
  }

  test('renders wrapping div element with correct props', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div')).toBe(true);
    expect(wrapper.prop('aria-label')).toBe(defaultProps.resource.name);
    expect(wrapper.prop('role')).toBe('listitem');
  });

  test('renders stacked className if stacked prop is passed', () => {
    const resourceCard = getWrapper({ stacked: true }).filter('.app-ResourceCard__stacked');
    expect(resourceCard).toHaveLength(1);
  });

  test('does not render stacked className if stacked prop is not passed', () => {
    const resourceCard = getWrapper().filter('.app-ResourceCard__stacked');
    expect(resourceCard).toHaveLength(0);
  });

  describe('backgroundImage', () => {
    function getBackgroundImageWrapper(extraProps) {
      return getWrapper(extraProps).find(BackgroundImage);
    }

    test('renders BackgroundImage component with correct image', () => {
      const backgroundImage = getBackgroundImageWrapper();
      const resourceMainImage = defaultProps.resource.images[0];

      expect(backgroundImage).toHaveLength(1);
      expect(backgroundImage.prop('image')).toEqual(resourceMainImage);
    });
  });

  describe('info box', () => {
    test('render 4 ResourceCardInfoCell cells by default', () => {
      const info = getWrapper().find('.app-ResourceCard__info');
      const cells = info.find(ResourceCardInfoCell);
      expect(cells.length).toEqual(4);
    });

    describe('purpose info cell', () => {
      test('renders with correct props', () => {
        const info = getWrapper().find('.info-cell-purpose');
        expect(info.prop('alt')).toBe('ResourceCard.infoTitle.purpose');
        expect(info.prop('icon')).toBeDefined();
      });
    });

    describe('distance info cell', () => {
      test('will not render by default if location not in use', () => {
        const info = getWrapper().find('.info-cell-distance');
        expect(info.length).toBe(0);
      });
      test('renders if location is in use', () => {
        const info = getWrapper({ resource: getResource({ distance: true }) }).find('.info-cell-distance');
        expect(info.length).toBe(1);
      });
    });

    describe('favorite info cell', () => {
      test('will not render by default if user is not logged in', () => {
        const info = getWrapper().find('.info-cell-favorite');
        expect(info.length).toBe(0);
      });

      test('renders if user is logged in', () => {
        const info = getWrapper({ isLoggedIn: true }).find('.info-cell-favorite');
        expect(info.length).toBe(1);
        expect(info.prop('alt')).toEqual('');
        expect(info.prop('icon')).toEqual(iconHeart);
        expect(info.prop('onClick')).toBeDefined();
      });

      test('render add to favorites label if not already favorite and user is logged in', () => {
        const favoriteTitle = getWrapper({ isLoggedIn: true, resource: getResource({ isFavorite: false }) }).find('.app-ResourceCard__infoTitle__favorite');
        expect(favoriteTitle).toHaveLength(1);
        expect(favoriteTitle.text()).toContain('ResourceCard.infoTitle.addFavorite');
      });

      test('render remove from favorites label if already favorite and user is logged in', () => {
        const favoriteTitle = getWrapper({ isLoggedIn: true, resource: getResource({ isFavorite: true }) }).find('.app-ResourceCard__infoTitle__favorite');
        expect(favoriteTitle).toHaveLength(1);
        expect(favoriteTitle.text()).toContain('ResourceCard.infoTitle.removeFavorite');
      });

      test('render with unfavorite icon when isFavorite is true, user logged in', () => {
        const info = getWrapper({
          isLoggedIn: true,
          resource: getResource({ isFavorite: true })
        }).find('.info-cell-favorite');

        expect(info.prop('alt')).toEqual('');
        expect(info.prop('icon')).toEqual(iconHeartWhite);
        expect(info.prop('onClick')).toBeDefined();
      });

      test('invoke favorite func when favorite icon is clicked as default, user logged in', () => {
        const info = getWrapper({ isLoggedIn: true }).find('.app-ResourceCard__info');
        const cell = info.find(ResourceCardInfoCell).last();
        cell.simulate('click');
        expect(defaultProps.actions.favoriteResource).toHaveBeenCalledTimes(1);
      });

      test('invoke set unfavorite func when favorite icon is clicked, user logged in', () => {
        const info = getWrapper({
          resource: getResource({ isFavorite: true }),
          isLoggedIn: true
        }).find('.app-ResourceCard__info');
        const cell = info.find(ResourceCardInfoCell).last();
        cell.simulate('click');
        expect(defaultProps.actions.unfavoriteResource).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('people capacity', () => {
    test('renders with correct props', () => {
      const peopleCapacity = getWrapper().find('.info-cell-capacity');
      expect(peopleCapacity).toHaveLength(1);
      expect(peopleCapacity.prop('alt')).toBe('ResourceCard.infoTitle.peopleCapacity');
      expect(peopleCapacity.prop('icon')).toBeDefined();
    });

    test('renders correct text', () => {
      const peopleCapacity = getWrapper().find('.app-ResourceCard__peopleCapacity');
      expect(peopleCapacity.length).toBe(1);
      expect(peopleCapacity.text()).toContain('ResourceCard.peopleCapacity');
    });
  });

  describe('address', () => {
    test('renders with correct props', () => {
      const address = getWrapper().find('.info-cell-address');
      expect(address).toHaveLength(1);
      expect(address.prop('alt')).toBe('ResourceCard.infoTitle.address');
      expect(address.prop('icon')).toBeDefined();
    });

    test('renders the street address of the given unit in props', () => {
      const wrapper = getWrapper();
      const streetAddress = wrapper.find('.app-ResourceCard__street-address');
      const zipAddress = wrapper.find('.app-ResourceCard__zip-address');

      expect(streetAddress).toHaveLength(1);
      expect(streetAddress.html()).toContain(defaultProps.unit.streetAddress);
      expect(zipAddress).toHaveLength(1);
      expect(zipAddress.html()).toContain(defaultProps.unit.addressZip);
      expect(zipAddress.html()).toContain(defaultProps.unit.municipality);
    });
  });

  describe('distance', () => {
    describe('when distance is defined', () => {
      test('renders with correct props', () => {
        const distance = getWrapper({ resource: getResource({ distance: 11123 }) })
          .find('.info-cell-distance');
        expect(distance).toHaveLength(1);
        expect(distance.prop('alt')).toBe('ResourceCard.infoTitle.distance');
        expect(distance.prop('icon')).toBeDefined();
      });

      test('renders correct text', () => {
        const distanceLabel = getWrapper({
          resource: getResource({ distance: 11123 }),
        }).find('.app-ResourceCard__distance');

        expect(distanceLabel).toHaveLength(1);
        expect(distanceLabel.text()).toBe('11 km');
      });

      test('renders distance with a decimal if distance is smaller than 10 km', () => {
        const distanceLabel = getWrapper({
          resource: getResource({ distance: 123 }),
        }).find('.app-ResourceCard__distance');

        expect(distanceLabel).toHaveLength(1);
        expect(distanceLabel.text()).toBe('0.1 km');
      });
    });
    describe('when distance is not defined', () => {
      test('will not render', () => {
        const distance = getWrapper().find('.info-cell-distance');
        expect(distance.length).toBe(0);
      });
    });
  });

  describe('price', () => {
    test('renders with correct props', () => {
      const price = getWrapper().find('.info-cell-price');
      expect(price).toHaveLength(1);
      expect(price.prop('alt')).toBe('ResourceCard.infoTitle.price');
      expect(price.prop('icon')).toBeDefined();
    });

    test('renders a hourly price', () => {
      const hourlyPriceSpan = getWrapper().find('.app-ResourceCard__hourly-price');

      expect(hourlyPriceSpan.is('span')).toBe(true);
      expect(hourlyPriceSpan.text()).toContain('30 €/h');
    });

    test(
      'renders correct text if minPricePerHourand maxPricePerHour are 0',
      () => {
        const resource = getResource({
          maxPricePerHour: 0,
          minPricePerHour: 0,
        });
        const hourlyPriceSpan = getWrapper({ resource }).find('.app-ResourceCard__hourly-price');

        expect(hourlyPriceSpan.is('span')).toBe(true);
        expect(hourlyPriceSpan.text()).toContain('ResourceIcons.free');
      }
    );

    test(
      'renders correct text if resource minPricePerHour and maxPricePerHour is empty',
      () => {
        const resource = getResource({
          maxPricePerHour: '',
          minPricePerHour: '',
        });
        const hourlyPriceSpan = getWrapper({ resource }).find('.app-ResourceCard__hourly-price');

        expect(hourlyPriceSpan.is('span')).toBe(true);
        expect(hourlyPriceSpan.text()).toContain('ResourceIcons.free');
      }
    );
  });

  test('contains links to correct resource page', () => {
    const links = getWrapper().find(Link);
    const urlComponents = getResourcePageUrlComponents(defaultProps.resource, defaultProps.date);
    const expected = {
      pathname: urlComponents.pathname,
      search: `?${urlComponents.query}`,
      state: { fromSearchResults: true },
    };

    expect(links.length).toBe(2);
    expect(links.at(0).props().to).toEqual(expected);
    expect(links.at(1).props().to).toEqual(expected);
  });

  test('image link contains correct props', () => {
    const links = getWrapper().find(Link);
    const expected = defaultProps.resource.name;
    expect(links.at(0).prop('aria-label')).toEqual(expected);
    expect(links.at(0).prop('aria-hidden')).toBe('true');
    expect(links.at(0).prop('tabIndex')).toBe('-1');
  });

  test('main link contains correct props', () => {
    const links = getWrapper().find(Link);
    const expected = `${defaultProps.resource.name}, ${defaultProps.unit.name}`;
    expect(links.at(1).prop('aria-label')).toEqual(expected);
  });

  test('renders the name of the resource inside a h3 header', () => {
    const header = getWrapper().find('h3');
    const expected = defaultProps.resource.name;

    expect(header.html()).toContain(expected);
  });

  test('renders the name of the given unit in props', () => {
    const unitName = getWrapper()
      .find('.app-ResourceCard__unit-name')
      .find('span');
    const expected = defaultProps.unit.name;

    expect(unitName.text()).toContain(expected);
  });

  test('renders the type of the given resource in props', () => {
    const typeLabel = getWrapper()
      .find('.app-ResourceCard__unit-name')
      .find('span');
    expect(typeLabel).toHaveLength(1);
    expect(typeLabel.text()).toBe(defaultProps.unit.name);
  });

  test('renders ResourceAvailability with correct props', () => {
    const resourceAvailability = getWrapper().find(ResourceAvailability);
    expect(resourceAvailability.prop('date')).toBe(defaultProps.date);
    expect(resourceAvailability.prop('resource').id).toBe(defaultProps.resource.id);
  });

  test('renders UnpublishedLabel when resource public is false', () => {
    const unpublishedLabel = getWrapper(
      { resource: getResource({ public: false }) }
    ).find(UnpublishedLabel);

    expect(unpublishedLabel.length).toEqual(1);
  });

  test('no renders UnpublishedLabel when resource public is true', () => {
    const unpublishedLabel = getWrapper(
      { resource: getResource({ public: true }) }
    ).find(UnpublishedLabel);

    expect(unpublishedLabel.length).toEqual(0);
  });

  test('renders resource description snippet', () => {
    const wrapper = getWrapper();
    const description = wrapper.find('.app-ResourceCard__description');
    expect(description.length).toBe(1);
    expect(description.text()).toEqual(
      wrapper.instance().createTextSnippet(getResource().description, 348)
    );
  });

  describe('createTextSnippet', () => {
    test('if given string is null, returns empty string', () => {
      const instance = getWrapper().instance();
      const nullString = null;
      expect(instance.createTextSnippet(nullString, 100)).toEqual('');
    });
    test('if given string is shorter than given length, returns same given string', () => {
      const instance = getWrapper().instance();
      const testString = 'this is a test string';
      expect(instance.createTextSnippet(testString, 100)).toEqual(testString);
    });
    test('if given string is longer than given length, returns string of given length with added dots', () => {
      const instance = getWrapper().instance();
      const testString = 'this is a test string';
      expect(instance.createTextSnippet(testString, 4)).toEqual('this...');
    });
    test('if given string contains a named link, it is cleansed correctly', () => {
      const instance = getWrapper().instance();
      const testString = 'this is a test string with [named link](https://www.google.com)';
      const expectedResult = 'this is a test string with named link';
      expect(instance.createTextSnippet(testString, 100)).toEqual(expectedResult);
    });
  });

  describe('handleSearchByType', () => {
    let historyMock;

    beforeAll(() => {
      historyMock = simple.mock(history, 'push');
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls history.push with correct path', () => {
      getWrapper()
        .instance()
        .handleSearchByType();
      const actualPath = historyMock.lastCall.args[0];
      const expectedPath = '/search?search=workplace';

      expect(historyMock.callCount).toBe(1);
      expect(actualPath).toBe(expectedPath);
    });
  });

  describe('handleSearchByDistance', () => {
    let historyMock;

    beforeAll(() => {
      historyMock = simple.mock(history, 'push');
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls history.push with correct path', () => {
      getWrapper({
        resource: getResource({ distance: 5000 }),
      })
        .instance()
        .handleSearchByDistance();
      const actualPath = historyMock.lastCall.args[0];
      const expectedPath = '/search?distance=5000';

      expect(historyMock.callCount).toBe(1);
      expect(actualPath).toBe(expectedPath);
    });
  });

  describe('handleSearchByPeopleCapacity', () => {
    let historyMock;

    beforeAll(() => {
      historyMock = simple.mock(history, 'push');
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls history.push with correct path', () => {
      getWrapper()
        .instance()
        .handleSearchByPeopleCapacity();
      const actualPath = historyMock.lastCall.args[0];
      const expectedPath = '/search?people=16';

      expect(historyMock.callCount).toBe(1);
      expect(actualPath).toBe(expectedPath);
    });
  });

  describe('handleSearchByUnit', () => {
    let historyMock;

    beforeAll(() => {
      historyMock = simple.mock(history, 'push');
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls browserHistory.push with correct path', () => {
      getWrapper()
        .instance()
        .handleSearchByUnit();
      const actualPath = historyMock.lastCall.args[0];
      const expectedPath = '/search?unit=unit_value';

      expect(historyMock.callCount).toBe(1);
      expect(actualPath).toBe(expectedPath);
    });
  });

  describe('handleLinkClick', () => {
    let historyMock;

    beforeAll(() => {
      historyMock = simple.mock(history, 'replace');
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls browserHistory.replace', () => {
      getWrapper()
        .instance()
        .handleLinkClick();

      expect(historyMock.callCount).toBe(1);
      expect(historyMock.lastCall.args).toHaveLength(1);
      expect(historyMock.lastCall.args[0].pathname).toBe(defaultProps.location.pathname);
      expect(historyMock.lastCall.args[0].search).toBe(defaultProps.location.search);
    });
  });
});
