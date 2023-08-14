import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import CustomerGroupNoOption from '../CustomerGroupNoOption';

describe('reservation-products/CustomerGroupNoOption', () => {
  const defaultProps = {
    customerGroup: {
      id: 'cg-1', name: 'Individuals'
    }
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<CustomerGroupNoOption {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    test('wrapping div', () => {
      const div = getWrapper().find('div#products-customer-group-no-option');
      expect(div).toHaveLength(1);
    });

    test('label', () => {
      const label = getWrapper().find('p.products-customer-group-no-option-label');
      expect(label).toHaveLength(1);
      expect(label.text()).toBe('ReservationProducts.select.clientGroup.label');
    });

    test('customer group name text', () => {
      const cgName = getWrapper().find('p.products-customer-group-no-option-value');
      expect(cgName).toHaveLength(1);
      expect(cgName.text()).toBe(defaultProps.customerGroup.name);
    });
  });
});
