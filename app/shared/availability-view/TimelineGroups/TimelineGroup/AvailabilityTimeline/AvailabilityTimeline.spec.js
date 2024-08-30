import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';

import AvailabilityTimeline from './AvailabilityTimeline';
import Reservation from './Reservation';
import ReservationSlot from './ReservationSlot';
import { calcPossibleTimes } from './availabilityTimelineUtils';

function getWrapper(props) {
  const defaults = {
    id: 'resource-id',
    items: [],
    slotSize: '00:30:00',
    openingHours: {
      closes: '2024-06-20T20:00:00+03:00',
      opens: '2024-06-20T07:00:00+03:00',
    },
  };
  return shallow(<AvailabilityTimeline {...defaults} {...props} />);
}

describe('shared/availability-view/AvailabilityTimeline', () => {
  test('has correct initial possibleTimes state', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    const expected = calcPossibleTimes(instance.props.slotSize, instance.props.openingHours.opens);
    expect(instance.state.possibleTimes).toStrictEqual(expected);
  });

  test('possibleTimes is updated via componentDidUpdate on openingHours change', () => {
    const wrapper = getWrapper();
    const prevProps = wrapper.props();
    const instance = wrapper.instance();
    const spy = jest.spyOn(instance, 'setState');
    const newOpeningHours = { opens: '2024-06-21T08:30:00+03:00' };
    const expected = calcPossibleTimes(instance.props.slotSize, newOpeningHours.opens);
    wrapper.setProps({ openingHours: newOpeningHours });
    instance.componentDidUpdate(prevProps);
    expect(spy).toHaveBeenCalledWith({ possibleTimes: expected });
    expect(instance.state.possibleTimes).toEqual(expected);
  });

  test('renders a div.availability-timeline', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.availability-timeline')).toBe(true);
  });

  test('renders given reservation slot', () => {
    const id = 'resource-auuxnane';
    const onReservationSlotClick = () => null;
    const onReservationSlotMouseEnter = () => null;
    const onReservationSlotMouseLeave = () => null;
    const wrapper = getWrapper({
      id,
      items: [{
        key: '1',
        type: 'reservation-slot',
        data: { begin: moment().format(), end: moment().format(), resourceId: '' },
      }],
      onReservationSlotClick,
      onReservationSlotMouseEnter,
      onReservationSlotMouseLeave,
    });
    const instance = wrapper.instance();
    const slot = wrapper.find(ReservationSlot);
    expect(slot).toHaveLength(1);
    expect(slot.prop('resourceId')).toBe(id);
    expect(slot.prop('onClick')).toBe(onReservationSlotClick);
    expect(slot.prop('onMouseEnter')).toBe(onReservationSlotMouseEnter);
    expect(slot.prop('onMouseLeave')).toBe(onReservationSlotMouseLeave);
    expect(slot.prop('possibleTimes')).toBe(instance.state.possibleTimes);
  });

  test('renders given reservation', () => {
    const wrapper = getWrapper({
      items: [{
        key: '1',
        type: 'reservation',
        data: {
          begin: '',
          end: '',
          id: 12345,
          name: 'My Reservation',
        },
      }],
    });
    const reservation = wrapper.find(Reservation);
    expect(reservation).toHaveLength(1);
    expect(reservation.prop('name')).toBe('My Reservation');
  });

  test('renders slots and reservations', () => {
    const wrapper = getWrapper({
      items: [
        {
          key: '1',
          type: 'reservation-slot',
          data: {
            begin: moment().format(),
            end: moment().format(),
            resourceId: '',
          },
        },
        {
          key: '2',
          type: 'reservation',
          data: {
            begin: '', end: '', id: 12345, name: ''
          }
        },
        {
          key: '3',
          type: 'reservation-slot',
          data: {
            begin: moment().format(),
            end: moment().format(),
            resourceId: '',
          },
        },
      ],
    });
    const children = wrapper.children();
    expect(children.at(0).is(ReservationSlot)).toBe(true);
    expect(children.at(1).is(Reservation)).toBe(true);
    expect(children.at(2).is(ReservationSlot)).toBe(true);
  });
});
