import React from 'react';
import PropTypes from 'prop-types';

import constants from '../../../constants/AppConstants';
import injectT from '../../../i18n/injectT';

function PaymentMethodSelect({ currentPaymentMethod, onPaymentMethodChange, t }) {
  const paymentMethods = constants.PAYMENT_METHODS;
  return (
    <fieldset className="payment-methods">
      <legend>{t('ReservationProducts.paymentMethod.label')}</legend>

      <label htmlFor="payment-method-online">
        <input
          checked={currentPaymentMethod === paymentMethods.ONLINE}
          id="payment-method-online"
          name="payment-method"
          onChange={onPaymentMethodChange}
          type="radio"
          value={paymentMethods.ONLINE}
        />
        {t('common.paymentMethod.online')}
      </label>
      <label htmlFor="payment-method-cash">
        <input
          checked={currentPaymentMethod === paymentMethods.CASH}
          id="payment-method-cash"
          name="payment-method"
          onChange={onPaymentMethodChange}
          type="radio"
          value={paymentMethods.CASH}
        />
        {t('common.paymentMethod.cash')}
      </label>
    </fieldset>
  );
}

PaymentMethodSelect.propTypes = {
  currentPaymentMethod: PropTypes.string.isRequired,
  onPaymentMethodChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(PaymentMethodSelect);
