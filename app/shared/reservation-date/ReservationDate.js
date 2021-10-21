import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import iconClock from 'assets/icons/clock-o.svg';
import { getPrettifiedDuration } from 'utils/timeUtils';

function ReservationDate({ beginDate, endDate }) {
  if (!beginDate || !endDate) {
    return <span />;
  }
  const reservationBegin = moment(beginDate);
  const reservationEnd = moment(endDate);
  const day = reservationBegin.format('D');
  const dayOfWeek = reservationBegin.format('dddd');
  const month = reservationBegin.format('MMMM');
  const beginTime = reservationBegin.format('HH:mm');
  const endTime = reservationEnd.format('HH:mm');
  const duration = getPrettifiedDuration(reservationBegin, reservationEnd);

  return (
    <div className="reservation-date">
      <div className="reservation-date__content">
        <span className="reservation-date__month">{month}</span>
        <span className="reservation-date__day-number">{day}</span>
        <span className="reservation-date__day-of-week">{dayOfWeek}</span>
      </div>
      <p className="reservation-date__time">
        <img alt="" className="reservation-date__icon" src={iconClock} />
        {` ${beginTime} \u2013 ${endTime} (${duration})`}
      </p>
    </div>
  );
}

ReservationDate.propTypes = {
  beginDate: PropTypes.string,
  endDate: PropTypes.string,
};

export default ReservationDate;
