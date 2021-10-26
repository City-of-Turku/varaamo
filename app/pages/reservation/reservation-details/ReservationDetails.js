import React from 'react';
import PropTypes from 'prop-types';
import { Well } from 'react-bootstrap';
import moment from 'moment';

import injectT from '../../../i18n/injectT';
import { getPrettifiedDuration } from 'utils/timeUtils';

function ReservationDetails({
  orderPrice, resourceName, selectedTime, unitName, t
}) {
  let reservationTime = '';
  if (selectedTime) {
    const beginText = moment(selectedTime.begin).format('D.M.YYYY HH:mm');
    const endText = moment(selectedTime.end).format('HH:mm');
    const duration = getPrettifiedDuration(selectedTime.begin, selectedTime.end);
    reservationTime = `${beginText}–${endText} (${duration})`;
  }

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
  selectedTime: null,
};

ReservationDetails.propTypes = {
  orderPrice: PropTypes.string,
  resourceName: PropTypes.string.isRequired,
  selectedTime: PropTypes.object,
  t: PropTypes.func.isRequired,
  unitName: PropTypes.string.isRequired,
};

export default injectT(ReservationDetails);
