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
    hasError: false,
    isRequired: false,
    onChange: () => {},
  };

  function getWrapper(props) {
    return shallowWithIntl(<CustomerGroupSelect {...defaultProps} {...props} />);
  }

  describe('renders', () => {
    test('wrapper div', () => {
      const div = getWrapper().find('div#customer-group-select-wrapper');
      expect(div).toHaveLength(1);
    });

    test('label', () => {
      const label = getWrapper().find('label');
      expect(label).toHaveLength(1);
      expect(label.prop('htmlFor')).toBe('customer-group-select');
    });

    describe('label span contents', () => {
      test('when prop hasError is true', () => {
        const span = getWrapper({ hasError: true }).find('#customer-group-select-label');
        expect(span).toHaveLength(1);
        expect(span.prop('className')).toBe('has-error');
        expect(span.text()).toBe('ReservationProducts.select.clientGroup.label');
      });

      test('when prop hasError is false', () => {
        const span = getWrapper({ hasError: false }).find('#customer-group-select-label');
        expect(span).toHaveLength(1);
        expect(span.prop('className')).toBe('');
        expect(span.text()).toBe('ReservationProducts.select.clientGroup.label');
      });

      describe('asterisk span', () => {
        test('when prop isRequired is true', () => {
          const parentSpan = getWrapper({ isRequired: true }).find('#customer-group-select-label');
          expect(parentSpan).toHaveLength(1);
          const asteriskSpan = parentSpan.children('span');
          expect(asteriskSpan).toHaveLength(1);
          expect(asteriskSpan.prop('aria-hidden')).toBe('true');
          expect(asteriskSpan.text()).toBe('*');
        });

        test('when prop isRequired is false', () => {
          const parentSpan = getWrapper({ isRequired: false }).find('#customer-group-select-label');
          expect(parentSpan).toHaveLength(1);
          const asteriskSpan = parentSpan.children('span');
          expect(asteriskSpan).toHaveLength(0);
        });
      });
    });

    test('select', () => {
      const select = getWrapper().find('select');
      expect(select).toHaveLength(1);
      expect(select.prop('aria-invalid')).toBe(defaultProps.hasError);
      expect(select.prop('aria-required')).toBe(defaultProps.isRequired);
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

    describe('required error paragraph', () => {
      test('when prop hasError is true', () => {
        const paragraph = getWrapper({ hasError: true }).find('p.has-error');
        expect(paragraph).toHaveLength(1);
        expect(paragraph.prop('aria-hidden')).toBe('true');
        expect(paragraph.text()).toBe('ReservationForm.requiredError');
      });

      test('when prop hasError is false', () => {
        const paragraph = getWrapper({ hasError: false }).find('p.has-error');
        expect(paragraph).toHaveLength(0);
      });
    });
  });
});
