import { shallow } from 'enzyme';
import React from 'react';

import TimeSlotPrice from '../TimeSlotPrice';

describe('reservation-products/product-time-slots/TimeSlotPrice', () => {
  const defaultProps = {
    begin: '08:00:00',
    end: '12:00:00',
    price: '3.50',
    period: '00:30:00',
  };

  function getWrapper(extraProps) {
    return shallow(<TimeSlotPrice {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    test('list element', () => {
      const timeSlot = getWrapper();
      expect(timeSlot.text()).toBe('08:00–12:00:⠀3.50 € / 30min');
    });
  });
});
