import React from 'react';
import PropTypes from 'prop-types';
import { Well } from 'react-bootstrap';

import injectT from '../../../i18n/injectT';

function ReservationDetails({
  orderPrice, reservationTime, resourceName, unitName, t
}) {
  return (
    <Well className="app-ReservationDetails">
      <h2>{t('ReservationPage.detailsTitle')}</h2>
      <p className="app-ReservationDetails__label">
        {t('ReservationDetails.resourceLabel')}
      </p>
      <p className="app-ReservationDetails__value">
        {resourceName}
      </p>

      <p className="app-ReservationDetails__label">
        {t('ReservationDetails.unitLabel')}
      </p>
      <p className="app-ReservationDetails__value">
        {unitName}
      </p>

      {orderPrice && (
        <React.Fragment>
          <p className="app-ReservationDetails__label">
            {t('common.priceTotalLabel')}
          </p>
          <p className="app-ReservationDetails__value">
            {orderPrice}
          </p>
        </React.Fragment>
      )}

      {reservationTime && (
        <React.Fragment>
          <p className="app-ReservationDetails__label">
            {t('ReservationPage.detailsTime')}
          </p>
          <p className="app-ReservationDetails__value">
            {reservationTime}
          </p>
        </React.Fragment>
      )}
    </Well>
  );
}

ReservationDetails.defaultProps = {
  orderPrice: '',
  reservationTime: '',
};

ReservationDetails.propTypes = {
  orderPrice: PropTypes.string,
  reservationTime: PropTypes.string,
  resourceName: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  unitName: PropTypes.string.isRequired,
};

export default injectT(ReservationDetails);
