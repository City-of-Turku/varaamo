import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import Immutable from 'seamless-immutable';

import WrappedText from 'shared/wrapped-text';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import { shallowWithIntl } from 'utils/testUtils';
import { getServiceMapUrl } from 'utils/unitUtils';
import ResourceInfo from './ResourceInfo';
import ReservationInfo from '../reservation-info';

describe('pages/resource/resource-info/ResourceInfo', () => {
  const defaultProps = {
    currentLanguage: 'fi',
    isLoggedIn: false,
    resource: Immutable(
      Resource.build({
        description: 'Some description',
        genericTerms: 'some generic terms',
        specificTerms: 'some specific terms',
        maxPricePerHour: '30',
        peopleCapacity: '16',
        type: {
          name: 'workplace',
        },
      })
    ),
    unit: Immutable(Unit.build({
      addressZip: '12345',
      id: 'aaa',
      mapServiceId: '123',
      municipality: 'some city',
      streetAddress: 'Street address 123',
    })),
    equipment: [
      'equipment 1',
      'equipment 2',
      'equipment 3',
    ]
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ResourceInfo {...defaultProps} {...extraProps} />);
  }

  test('renders section with correct props', () => {
    const section = getWrapper().find('.app-ResourceInfo');
    expect(section).toHaveLength(1);
    expect(section.prop('aria-labelledby')).toBe('ResourcePageInfo');
  });

  test('renders header text', () => {
    const header = getWrapper().find('#ResourcePageInfo');
    expect(header).toHaveLength(1);
    expect(header.text()).toBe('ResourcePage.info');
  });

  test('renders resource description as WrappedText', () => {
    const wrappedText = getWrapper()
      .find('.app-ResourceInfo__description')
      .find(WrappedText);
    const expectedText = defaultProps.resource.description;

    expect(wrappedText).toHaveLength(1);
    expect(wrappedText.prop('text')).toBe(expectedText);
    expect(wrappedText.prop('allowNamedLinks')).toBe(true);
    expect(wrappedText.prop('openLinksInNewTab')).toBe(true);
  });

  test('renders panels with correct props', () => {
    const panels = getWrapper().find(Panel);

    expect(panels).toHaveLength(3);
    expect(panels.at(0).prop('header')).toBe('ResourceInfo.reservationTitle');
    expect(panels.at(0).prop('defaultExpanded')).toBeTruthy();
    expect(panels.at(1).prop('header')).toBe('ResourceInfo.additionalInfoTitle');
    expect(panels.at(2).prop('header')).toBe('ResourceInfo.equipmentHeader');
    expect(panels.at(2).prop('defaultExpanded')).toBeTruthy();
  });

  test('renders panel.titles with correct props', () => {
    const panels = getWrapper().find(Panel).find(Panel.Heading).find(Panel.Title);

    expect(panels).toHaveLength(3);
    expect(panels.at(0).prop('componentClass')).toBe('h3');
    expect(panels.at(1).prop('componentClass')).toBe('h3');
    expect(panels.at(2).prop('componentClass')).toBe('h3');

    expect(panels.at(0).prop('children')).toBe('ResourceInfo.reservationTitle');
    expect(panels.at(1).prop('children')).toBe('ResourceInfo.additionalInfoTitle');
    expect(panels.at(2).prop('children')).toBe('ResourceInfo.equipmentHeader');
  });

  test('renders ReservationInfo with correct props', () => {
    const reservationInfo = getWrapper().find(ReservationInfo);
    expect(reservationInfo).toHaveLength(1);
    expect(reservationInfo.prop('isLoggedIn')).toBe(defaultProps.isLoggedIn);
    expect(reservationInfo.prop('resource')).toEqual(defaultProps.resource);
  });

  test('renders the unit name and address', () => {
    const unit = Unit.build({
      addressZip: '99999',
      municipality: 'helsinki',
      name: 'Unit name',
      streetAddress: 'Test street 12',
    });
    const addressSpan = getWrapper({ unit })
      .find('.app-ResourceInfo__address')
      .find('span');

    expect(addressSpan).toHaveLength(3);
    expect(addressSpan.at(0).text()).toBe(unit.name);
    expect(addressSpan.at(1).text()).toBe(unit.streetAddress);
    expect(addressSpan.at(2).text()).toBe('99999 Helsinki');
  });

  test('renders web address', () => {
    const unit = Unit.build({
      id: 'abc:123',
      addressZip: '99999',
      municipality: 'helsinki',
      name: 'Unit name',
      streetAddress: 'Test street 12',
      wwwUrl: 'some-url',
    });
    const link = getWrapper({ unit })
      .find('.app-ResourceInfo__www')
      .find('a');

    expect(link).toHaveLength(1);
    expect(link.prop('href')).toBe(unit.wwwUrl);
    expect(link.prop('target')).toBe('_blank');
    expect(link.text()).toBe('ResourceInfo.webSiteLink');
  });

  test('renders service map link', () => {
    const unit = Unit.build({
      id: 'abc',
      mapServiceId: '123',
      addressZip: '99999',
      municipality: 'helsinki',
      name: 'Unit name',
      streetAddress: 'Test street 12',
      wwwUrl: 'some-url',
    });
    const expected = getServiceMapUrl(defaultProps.unit, defaultProps.currentLanguage);
    const link = getWrapper({ unit })
      .find('.app-ResourceInfo__servicemap')
      .find('a');

    expect(link).toHaveLength(1);
    expect(link.prop('href')).toBe(expected);
    expect(link.prop('target')).toBe('_blank');
    expect(link.prop('rel')).toBe('noopener noreferrer');
    expect(link.text()).toBe('ResourceInfo.serviceMapLink');
  });

  test('does not render service map link if unit or unit.mapServiceId empty', () => {
    const link = getWrapper({ unit: {} })
      .find('.app-ResourceInfo__servicemap')
      .find('a');

    expect(link).toHaveLength(0);
  });

  test('renders the <ul> element', () => {
    const element = getWrapper().find('ul');
    expect(element).toHaveLength(1);
  });

  test('render equipment list', () => {
    const element = getWrapper().find('li');
    expect(element).toHaveLength(3);
    expect(element.first().text()).toBe('equipment 1');
    expect(element.at(1).text()).toBe('equipment 2');
    expect(element.last().text()).toBe('equipment 3');
  });

  test('does not render equipment list when list is empty', () => {
    const element = getWrapper({ equipment: [] }, { equipmentList: [] }).find('li');
    expect(element).toHaveLength(0);
  });
});
