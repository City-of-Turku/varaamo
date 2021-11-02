import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import CustomerGroupSelect from '../CustomerGroupSelect';

describe('reservation-products/CustomerGroupSelect', () => {
  const defaultProps = {
    currentlySelectedGroup: '',
    customerGroups: [
      { id: 'cg-1', name: 'Organizations and corporations' },
      { id: 'cg-2', name: 'Individuals' },
    ],
    onChange: () => {},
  };

  function getWrapper(props) {
    return shallowWithIntl(<CustomerGroupSelect {...defaultProps} {...props} />);
  }

  describe('renders', () => {
    test('label', () => {
      const label = getWrapper().find('label');
      expect(label).toHaveLength(1);
      expect(label.prop('htmlFor')).toBe('customer-group-select');
      expect(label.text()).toContain('ReservationProducts.select.clientGroup.label');
    });

    test('select', () => {
      const select = getWrapper().find('select');
      expect(select).toHaveLength(1);
      expect(select.prop('id')).toBe('customer-group-select');
      expect(select.prop('name')).toBe('customer-groups');
      expect(select.prop('onChange')).toBe(defaultProps.onChange);
      expect(select.prop('value')).toBe(defaultProps.currentlySelectedGroup);
    });

    test('options', () => {
      const options = getWrapper().find('option');
      expect(options).toHaveLength(defaultProps.customerGroups.length + 1);

      const firstOption = options.at(0);
      expect(firstOption.prop('disabled')).toBe(true);
      expect(firstOption.prop('hidden')).toBe(true);
      expect(firstOption.prop('value')).toBe('');
      expect(firstOption.text()).toBe('common.select');

      if (options.length > 1) {
        for (let index = 1; index < options.length; index += 1) {
          const option = options.at(index);
          expect(option.prop('value')).toBe(defaultProps.customerGroups[index - 1].id);
          expect(option.text()).toBe(defaultProps.customerGroups[index - 1].name);
        }
      }
    });
  });
});
