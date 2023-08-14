import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import ReservationValidationErrors from './ReservationValidationErrors';
import { capitalizeFirst } from '../../../utils/textUtils';
import { FIELDS } from '../../../constants/ReservationConstants';

describe('pages/reservation/reservation-information/ReservationValidationErrors', () => {
  const defaultProps = {
    universalFields: [{
      data: null,
      description: 'test-description',
      id: 3,
      label: 'test-label',
      name: 'test-name',
      options: [
        { id: 1, text: 'test-option-1' },
        { id: 2, text: 'test-option-2' },
        { id: 3, text: 'test-option-3' },
      ],
    }],
    formErrors: ['reserverName', 'reserverEmailAddress', 'universalData', 'billingAddressStreet'],
    showFormErrorList: true,
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ReservationValidationErrors {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    test('only wrapping div when showFormErrorList is false', () => {
      const wrapper = getWrapper({ showFormErrorList: false });
      const div = wrapper.find('#information-page-validation-and-errors');
      expect(div).toHaveLength(1);
      expect(div.prop('role')).toBe('alert');
      expect(div.children()).toHaveLength(0);
    });

    describe('when showFormErrorList is true', () => {
      test('wrapping div', () => {
        const wrapper = getWrapper();
        const div = wrapper.find('#information-page-validation-and-errors');
        expect(div).toHaveLength(1);
        expect(div.prop('role')).toBe('alert');
      });

      test('empty div after wrapping div', () => {
        const wrapper = getWrapper();
        const div = wrapper.find('#information-page-validation-and-errors').children().find('div');
        expect(div).toHaveLength(1);
      });

      test('validation error label', () => {
        const wrapper = getWrapper();
        const label = wrapper.find('p.validation-error-label');
        expect(label).toHaveLength(1);
        expect(label.text()).toBe('ReservationProducts.validation.label');
      });

      test('validation error list', () => {
        const wrapper = getWrapper();
        const list = wrapper.find('ul');
        expect(list).toHaveLength(1);
      });

      test('validation error list items', () => {
        const wrapper = getWrapper();
        const listItems = wrapper.find('li');
        expect(listItems).toHaveLength(4);
        expect(listItems.at(0).text()).toBe(capitalizeFirst(FIELDS.RESERVER_NAME.label));
        expect(listItems.at(1).text()).toBe(capitalizeFirst(FIELDS.RESERVER_EMAIL_ADDRESS.label));
        expect(listItems.at(2).text()).toBe(
          `ReservationForm.validation.payer.label ${FIELDS.BILLING_ADDRESS_STREET.label}`
        );
        const billingSpan = listItems.at(2).find('span');
        expect(billingSpan).toHaveLength(1);
        expect(billingSpan.prop('className')).toBe('text-lowercase');
        expect(listItems.at(3).text()).toBe(capitalizeFirst(defaultProps.universalFields[0].label));
      });
    });
  });
});
