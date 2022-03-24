import { shallow } from 'enzyme';
import React from 'react';

import SingleReservationDetail from './SingleReservationDetail';

describe('pages/reservation/reservation-details/SingleReservationDetail', () => {
  const defaultProps = {
    label: 'test-label',
    value: 'test-value',
  };

  function getWrapper(extraProps) {
    return shallow(<SingleReservationDetail {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    test('nothing when prop value is falsy', () => {
      const wrapper = getWrapper({ value: '' });
      expect(wrapper.isEmptyRender()).toBe(true);
    });

    test('label', () => {
      const label = getWrapper().find('p.app-ReservationDetails__label');
      expect(label).toHaveLength(1);
      expect(label.text()).toBe(defaultProps.label);
    });

    test('value', () => {
      const value = getWrapper().find('p.app-ReservationDetails__value');
      expect(value).toHaveLength(1);
      expect(value.text()).toBe(defaultProps.value);
    });
  });
});
