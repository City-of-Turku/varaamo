import React from 'react';
import PropTypes from 'prop-types';
import Well from 'react-bootstrap/lib/Well';
import moment from 'moment';

import injectT from '../../../i18n/injectT';
import { getPrettifiedDuration } from 'utils/timeUtils';
import SingleReservationDetail from './SingleReservationDetail';

function ReservationDetails({
  customerGroupName, orderPrice, paymentMethod, resourceName, selectedTime, unitName, t
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

      <SingleReservationDetail
        label={t('ReservationDetails.resourceLabel')}
        value={resourceName}
      />
      <SingleReservationDetail
        label={t('ReservationDetails.unitLabel')}
        value={unitName}
      />
      <SingleReservationDetail
        label={t('common.customerGroup')}
        value={customerGroupName}
      />
      <SingleReservationDetail
        label={t('common.priceTotalLabel')}
        value={orderPrice}
      />
      <SingleReservationDetail
        label={t('common.paymentMethod')}
        value={paymentMethod}
      />
      <SingleReservationDetail
        label={t('ReservationPage.detailsTime')}
        value={reservationTime}
      />
    </Well>
  );
}

ReservationDetails.defaultProps = {
  customerGroupName: '',
  orderPrice: '',
  paymentMethod: '',
  selectedTime: null,
};

ReservationDetails.propTypes = {
  customerGroupName: PropTypes.string,
  orderPrice: PropTypes.string,
  paymentMethod: PropTypes.string,
  resourceName: PropTypes.string.isRequired,
  selectedTime: PropTypes.object,
  t: PropTypes.func.isRequired,
  unitName: PropTypes.string.isRequired,
};

export default injectT(ReservationDetails);
