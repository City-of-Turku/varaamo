import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import { injectT } from 'i18n';
import { getNaiveDate } from '../../../utils/resourceUtils';

function ReservingRestrictedText({
  reservableAfter, reservableBefore, reservableDaysInAdvance, t
}) {
  const dateFormat = 'D.M.YYYY';
  const today = moment().format(dateFormat);
  const from = reservableAfter ? moment(reservableAfter).format(dateFormat) : today;
  const reservableDate = moment(getNaiveDate(reservableBefore), 'YYYY-MM-DD');
  const until = reservableDate.subtract(1, 'days').format(dateFormat);

  return (
    <p className="info-text">
      {t('ReservingRestrictedText.reservationRestricted', { days: reservableDaysInAdvance })}
      {' '}
      {t('ReservingRestrictedText.reservationAvailableBetween', { today: from, until })}
    </p>
  );
}

ReservingRestrictedText.propTypes = {
  reservableAfter: PropTypes.string,
  reservableBefore: PropTypes.string.isRequired,
  reservableDaysInAdvance: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ReservingRestrictedText);
