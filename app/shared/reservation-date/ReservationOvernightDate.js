import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import iconClock from 'assets/icons/clock-o.svg';
import iconCalendar from 'assets/icons/calendar.svg';
import { getPrettifiedDuration } from 'utils/timeUtils';
import injectT from '../../i18n/injectT';

function ReservationOvernightDate({ beginDate, endDate, t }) {
  if (!beginDate || !endDate) {
    return <span />;
  }

  const reservationBegin = moment(beginDate);
  const reservationEnd = moment(endDate);
  const begin = reservationBegin.format('D.M.YYYY HH:mm');
  const end = reservationEnd.format('D.M.YYYY HH:mm');
  const duration = getPrettifiedDuration(reservationBegin, reservationEnd);

  return (
    <div className="reservation-date">
      <p className="reservation-date__time">
        <img alt="" className="reservation-date__icon" src={iconCalendar} />
        {`${t('common.time.begin')}: `}
        <span className="reservation-date__overnight-time">{begin}</span>
      </p>
      <p className="reservation-date__time">
        <img alt="" className="reservation-date__icon" src={iconCalendar} />
        {`${t('common.time.end')}: `}
        <span className="reservation-date__overnight-time">{end}</span>
      </p>
      <p className="reservation-date__time">
        <img alt="" className="reservation-date__icon" src={iconClock} />
        {`${t('common.time.duration')}: `}
        <span className="reservation-date__overnight-time">{duration}</span>
      </p>
    </div>
  );
}

ReservationOvernightDate.propTypes = {
  beginDate: PropTypes.string,
  endDate: PropTypes.string,
  t: PropTypes.func,
};

export default injectT(ReservationOvernightDate);
