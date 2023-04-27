import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Popover from 'react-bootstrap/lib/Popover';
import moment from 'moment';

import { injectT } from 'i18n/index';

class ReservationPopover extends PureComponent {
  render() {
    const {
      begin, children, end, onCancel, t, minPeriod, maxPeriod, timeDetails,
    } = this.props;
    const reservationLength = end ? moment.duration(moment(end).diff(moment(begin))) : null;
    // console.log(test);
    let aloitus = '';
    let lopetus = '';
    const { alku, loppu } = timeDetails;
    if (alku && loppu && (alku.open !== loppu.resourceOpen)) {
      const dif = moment.duration(moment(loppu.resourceOpen).diff(moment(alku.close)));
      console.log('popover diffi');
      console.log(dif.asHours());
      // reservationLength.subtract(dif.asHours(), 'h');
      aloitus = moment(begin).format('DD.MM [klo] LT');
      lopetus = moment(end).format('DD.MM [klo] LT');
    }
    let durationString = '(';
    if (reservationLength.days()) {
      durationString += `${reservationLength.asHours()}h`;
    } else if (reservationLength.hours()) { durationString += `${reservationLength.hours()}h`; }
    durationString += ` ${reservationLength.minutes()}min)`;
    const popover = (
      <Popover
        className="reservation-popover"
        id="popover-selection-information"
        title={t('ReservationPopover.selectionInfoHeader')}
      >
        {!aloitus && !lopetus && (
          <span>
            {moment(begin).format('HH:mm')}


            –
            {end && moment(end).format('HH:mm')}
          </span>
        )}
        <span>
          {aloitus}


          –
          {end && lopetus}
        </span>

        {reservationLength && false && (
          <span className="reservation-popover__length">
            {reservationLength.hours()
              ? `(${reservationLength.hours()}h ${reservationLength.minutes()}min)`
              : `(${reservationLength.minutes()}min)`}
            {durationString}
          </span>
        )}
        {reservationLength && (
          <span className="reservation-popover__length">
            {durationString}
          </span>
        )}
        {minPeriod && (
          <span>
              {t('ReservationPopover.minPeriod')}
            {` ${moment(minPeriod, 'hh:mm:ss').format('H')}h`}
          </span>
        )}
        {maxPeriod && (
          <span>
              {t('ReservationPopover.maxPeriod')}
            {` ${moment(maxPeriod, 'hh:mm:ss').format('H')}h`}
          </span>
        )}


        <Glyphicon className="reservation-popover__cancel" glyph="trash" onClick={onCancel} />
      </Popover>
    );
    return (
      <OverlayTrigger defaultOverlayShown overlay={popover} placement="top" trigger={[]}>
        {children}
      </OverlayTrigger>
    );
  }
}

ReservationPopover.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  onCancel: PropTypes.func.isRequired,
  begin: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  minPeriod: PropTypes.string,
  maxPeriod: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  timeDetails: PropTypes.any,
};

ReservationPopover.defaultProps = {
  minPeriod: null,
  maxPeriod: null,
  timeDetails: {}
};

export default injectT(ReservationPopover);
