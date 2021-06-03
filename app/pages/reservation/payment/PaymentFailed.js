import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import injectT from '../../../i18n/injectT';

function PaymentFailed({
  t,
  resourceId,
}) {
  return (
    <div className="reservation-payment-failed">
      <h2>{t('payment.title')}</h2>
      <p>{t('payment.text')}</p>
      {resourceId && (
        <Link className="reservation-payment-failed-link" id="payment-failed-return-link" to={`/resources/${resourceId}`}>
          {t('payment.link.return')}
        </Link>
      )}
      <Link className="reservation-payment-failed-link" id="payment-failed-own-reservations-link" to="/my-reservations">
        {t('payment.link.ownReservations')}
      </Link>
    </div>
  );
}

PaymentFailed.propTypes = {
  t: PropTypes.func,
  resourceId: PropTypes.string,
};

export default injectT(PaymentFailed);
