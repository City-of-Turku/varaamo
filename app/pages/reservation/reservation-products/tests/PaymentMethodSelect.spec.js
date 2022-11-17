import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import constants from '../../../../constants/AppConstants';
import PaymentMethodSelect from '../PaymentMethodSelect';

describe('reservation-products/PaymentMethodSelect', () => {
  const defaultProps = {
    currentPaymentMethod: constants.PAYMENT_METHODS.ONLINE,
    onPaymentMethodChange: () => {}
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<PaymentMethodSelect {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    test('fieldset', () => {
      const fieldset = getWrapper().find('fieldset');
      expect(fieldset).toHaveLength(1);
      expect(fieldset.prop('className')).toBe('payment-methods');
    });

    test('legend', () => {
      const legend = getWrapper().find('legend');
      expect(legend).toHaveLength(1);
      expect(legend.text()).toBe('ReservationProducts.paymentMethod.label');
    });

    test('input labels', () => {
      const labels = getWrapper().find('label');
      expect(labels).toHaveLength(2);

      expect(labels.at(0).prop('htmlFor')).toBe('payment-method-online');
      expect(labels.at(0).text()).toBe('common.paymentMethod.online');

      expect(labels.at(1).prop('htmlFor')).toBe('payment-method-cash');
      expect(labels.at(1).text()).toBe('common.paymentMethod.cash');
    });

    test('inputs', () => {
      const inputs = getWrapper().find('input');
      expect(inputs).toHaveLength(2);

      expect(inputs.at(0).prop('checked')).toBe(true);
      expect(inputs.at(0).prop('id')).toBe('payment-method-online');
      expect(inputs.at(0).prop('name')).toBe('payment-method');
      expect(inputs.at(0).prop('onChange')).toBe(defaultProps.onPaymentMethodChange);
      expect(inputs.at(0).prop('type')).toBe('radio');
      expect(inputs.at(0).prop('value')).toBe(constants.PAYMENT_METHODS.ONLINE);

      expect(inputs.at(1).prop('checked')).toBe(false);
      expect(inputs.at(1).prop('id')).toBe('payment-method-cash');
      expect(inputs.at(1).prop('name')).toBe('payment-method');
      expect(inputs.at(1).prop('onChange')).toBe(defaultProps.onPaymentMethodChange);
      expect(inputs.at(1).prop('type')).toBe('radio');
      expect(inputs.at(1).prop('value')).toBe(constants.PAYMENT_METHODS.CASH);
    });
  });
});
