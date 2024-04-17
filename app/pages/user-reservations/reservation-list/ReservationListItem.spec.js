import React from 'react';
import Immutable from 'seamless-immutable';
import { Link } from 'react-router-dom';

import ReservationStateLabel from 'shared/reservation-state-label';
import TimeRange from 'shared/time-range';
import Image from 'utils/fixtures/Image';
import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import ReservationControls from 'shared/reservation-controls';
import { getResourcePageUrl } from 'utils/resourceUtils';
import { shallowWithIntl } from 'utils/testUtils';
import ReservationListItem from './ReservationListItem';

describe('pages/user-reservations/reservation-list/ReservationListItem', () => {
  const props = {
    isAdmin: false,
    reservation: Immutable(Reservation.build()),
    resource: Immutable(Resource.build({
      images: [Image.build()],
      type: { name: 'test_type' },
    })),
    unit: Immutable(Unit.build()),
  };

  let component;

  beforeAll(() => {
    component = shallowWithIntl(<ReservationListItem {...props} />);
  });

  describe('rendering', () => {
    test('renders a li element', () => {
      expect(component.is('li')).toBe(true);
      expect(component.prop('className')).toBe('reservation container');
    });

    test('displays an image with correct props', () => {
      const image = component.find('.resourceImg');

      expect(image).toHaveLength(1);
      expect(image.props().alt).toBe(props.resource.images[0].caption);
      expect(image.props().src).toBe(props.resource.images[0].url);
    });

    test('contains two links to resource page with correct props', () => {
      const expectedUrl = getResourcePageUrl(props.resource);
      const links = component.find(Link);

      expect(links.length).toBe(2);
      // image link
      expect(links.at(0).prop('aria-hidden')).toBe('true');
      expect(links.at(0).prop('tabIndex')).toBe('-1');
      expect(links.at(0).prop('to')).toBe(expectedUrl);
      // header/name link
      expect(links.at(1).prop('to')).toBe(expectedUrl);
    });

    test('displays the name of the resource', () => {
      const expected = props.resource.name;

      expect(component.find('h2').text()).toContain(expected);
    });

    test('displays unit icon with correct props', () => {
      const unitIcon = component.find('.location');
      expect(unitIcon.length).toBe(1);
      expect(unitIcon.prop('alt')).toBe('common.addressStreetLabel');
      expect(unitIcon.prop('src')).toBeDefined();
    });

    test('displays the name of the given unit in props', () => {
      const expected = props.unit.name;

      expect(component.find('.unit-name').text()).toContain(expected);
    });

    test('displays timeslot icon with correct props', () => {
      const timeslotIcon = component.find('.timeslot');
      expect(timeslotIcon.length).toBe(1);
      expect(timeslotIcon.prop('alt')).toBe('common.reservationTimeLabel');
      expect(timeslotIcon.prop('src')).toBeDefined();
    });

    describe('when reservation is not multiday', () => {
      test('contains TimeRange component with correct props', () => {
        const timeRange = component.find(TimeRange);
        expect(timeRange).toHaveLength(1);
        expect(timeRange.prop('begin')).toBe(props.reservation.begin);
        expect(timeRange.prop('end')).toBe(props.reservation.end);
        expect(timeRange.prop('beginFormat')).toBe('dddd, LLL');
        expect(timeRange.prop('endFormat')).toBe('LT');
      });
    });

    describe('when reservation is multiday', () => {
      test('contains TimeRange component with correct props', () => {
        const reservationA = { ...props.reservation, begin: '2017-01-01T10:00:00+02:00', end: '2017-01-02T12:00:00+02:00' };
        const newProps = { ...props, reservation: reservationA };
        const componentA = shallowWithIntl(<ReservationListItem {...newProps} />);
        const timeRange = componentA.find(TimeRange);
        expect(timeRange).toHaveLength(1);
        expect(timeRange.prop('begin')).toBe(reservationA.begin);
        expect(timeRange.prop('end')).toBe(reservationA.end);
        expect(timeRange.prop('beginFormat')).toBe('D.M.YYYY HH:mm');
        expect(timeRange.prop('endFormat')).toBe('D.M.YYYY HH:mm');
      });
    });

    test('renders ReservationStateLabel component', () => {
      const reservationStateLabel = component.find(ReservationStateLabel);
      expect(reservationStateLabel.length).toBe(1);
    });

    test('renders ReservationControls component', () => {
      const reservationControls = component.find(ReservationControls);
      expect(reservationControls).toHaveLength(1);
    });

    test('passes correct props to ReservationControls component', () => {
      const actualProps = component.find(ReservationControls).props();

      expect(actualProps.isAdmin).toBe(false);
      expect(actualProps.reservation).toBe(props.reservation);
      expect(actualProps.resource).toBe(props.resource);
    });
  });
});
