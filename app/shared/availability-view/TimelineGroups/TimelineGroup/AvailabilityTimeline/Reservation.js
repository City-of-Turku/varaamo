import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Popover from 'react-bootstrap/lib/Popover';

import ReservationAccessCode from 'shared/reservation-access-code';
import constants from '../../../../../constants/AppConstants';
import utils from '../utils';

function getReserverName(reserverName, user) {
  return reserverName || (user && (user.displayName || user.email));
}

Reservation.propTypes = {
  accessCode: PropTypes.string,
  begin: PropTypes.string.isRequired,
  comments: PropTypes.string,
  end: PropTypes.string.isRequired,
  eventSubject: PropTypes.string,
  id: PropTypes.number.isRequired,
  numberOfParticipants: PropTypes.number,
  onClick: PropTypes.func,
  reserverName: PropTypes.string,
  state: PropTypes.string,
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string,
  }),
  pos: PropTypes.array, // [num, num] used to determine reservation slot
};

function Reservation({ onClick, ...reservation }) {
  const startTime = moment(reservation.begin);
  const endTime = moment(reservation.end);
  let width = utils.getTimeSlotWidth({ startTime, endTime });
  // console.log(`width: ${width}`);
  // let width2 = 0;
  // reservation is the last slot of the day -> width extends to midnight.
  if (reservation.pos[0] === reservation.pos[1]) {
    const eka = moment(reservation.begin);
    const toka = moment(reservation.begin).add(1, 'd').startOf('day');
    width = utils.getTimeSlotWidth({ startTime: eka, endTime: toka });
    // width = (48 - (reservation.pos[1] + 1)) * 30;
  }
  if (reservation.pos[0] === 0 && (reservation.pos[0] !== reservation.pos[1])) {
    // res is the first slot of the day -> reservation started yesterday and extends to this one.
    const eka = moment(reservation.end).startOf('day');
    const toka = moment(reservation.end);
    width = utils.getTimeSlotWidth({ startTime: eka, endTime: toka });
    console.log(`widthi: ${width}`);
    console.log(eka.toISOString());
    console.log(toka.toISOString());
  }
  // console.log(`width2: ${width}`);
  const reserverName = getReserverName(reservation.reserverName, reservation.user);
  const popover = (
    <Popover className="reservation-info-popover" id={`popover-${reservation.id}`} title={reservation.eventSubject}>
      <div>
        <Glyphicon glyph="time" />
        {`${startTime.format('HH:mm')} - ${endTime.format('HH:mm')}`}
      </div>
      {reserverName && <div>{reserverName}</div>}
      {reservation.numberOfParticipants && (
      <div>
        <Glyphicon glyph="user" />
        {' '}
        {reservation.numberOfParticipants}
      </div>
      )}
      {reservation.accessCode && <div><ReservationAccessCode reservation={reservation} /></div>}
      {reservation.comments && <hr />}
      {reservation.comments && (
      <div>
        <Glyphicon glyph="comment" />
        {' '}
        {reservation.comments}
      </div>
      )}
    </Popover>
  );
  return (
    <button
      className={classNames('reservation-link', { 'with-comments': reservation.comments })}
      onClick={() => onClick && reservation.userPermissions.canModify && onClick(reservation)}
      type="button"
    >
      <OverlayTrigger
        overlay={popover}
        placement="top"
        trigger={['hover', 'focus']}
      >
        <span
          className={classNames('reservation',
            { requested: reservation.state === 'requested' },
            { ready_for_payment: reservation.state === 'ready_for_payment' },
            {
              waiting_for_cash_payment:
                reservation.state === constants.RESERVATION_STATE.WAITING_FOR_CASH_PAYMENT
            },
            { disabled: reservation.state === 'confirmed' && !reservation.isOwn && !reservation.userPermissions.canModify },
            { reserved: reservation.state === 'confirmed' && !reservation.isOwn && reservation.userPermissions.canModify })}
          style={{ width }}
        >
          <span className="names">
            <span className="event-subject">{reservation.eventSubject}</span>
            <span className="reserver-name">{reserverName}</span>
          </span>
        </span>
      </OverlayTrigger>
    </button>
  );
}

export default Reservation;
