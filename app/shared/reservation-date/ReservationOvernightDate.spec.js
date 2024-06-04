import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import ReservationOvernightDate from './ReservationOvernightDate';

describe('shared/reservation-date/ReservationOvernightDate', () => {
  function getWrapper(extraProps) {
    return shallowWithIntl(<ReservationOvernightDate {...extraProps} />);
  }

  let wrapper;

  const beginDate = '2018-01-29T13:00:00+02:00';
  const endDate = '2018-01-31T09:00:00+02:00';

  beforeAll(() => {
    wrapper = getWrapper({
      beginDate,
      endDate
    });
  });

  test('renders a container div', () => {
    const container = wrapper.find('div.reservation-date');
    expect(container.length).toBe(1);
  });

  test('renders time texts', () => {
    const texts = wrapper.find('p.reservation-date__time');
    expect(texts.length).toBe(3);
    expect(texts.at(0).text()).toBe('common.time.begin: 29.1.2018 TimeSlots.selectedTime');
    expect(texts.at(1).text()).toBe('common.time.end: 31.1.2018 TimeSlots.selectedTime');
    expect(texts.at(2).text()).toBe('common.time.duration: 1common.unit.time.day.short 20h');
  });

  test('renders time icons', () => {
    const icons = wrapper.find('img.reservation-date__icon');
    expect(icons.length).toBe(3);
    expect(icons.at(0).prop('src')).toBe('test-file-stub');
    expect(icons.at(0).prop('alt')).toBe('');
    expect(icons.at(1).prop('src')).toBe('test-file-stub');
    expect(icons.at(1).prop('alt')).toBe('');
    expect(icons.at(2).prop('src')).toBe('test-file-stub');
    expect(icons.at(2).prop('alt')).toBe('');
  });

  test('renders empty when start or end date missing', () => {
    const emptyWrapper = getWrapper({});
    expect(emptyWrapper.equals(<span />)).toBe(true);
  });
});
