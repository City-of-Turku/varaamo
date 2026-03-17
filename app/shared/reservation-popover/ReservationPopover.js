import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Popover from 'react-bootstrap/lib/Popover';
import moment from 'moment';

import { injectT } from 'i18n/index';
import { isDurationWithinLimits } from './reservationPopoverUtils';

class ReservationPopover extends PureComponent {
  render() {
    const {
      begin, children, end, onCancel, t, minPeriod, maxPeriod, notValidTime
    } = this.props;
    const reservationLength = end ? moment.duration(moment(end).diff(moment(begin))) : null;
    const minPeriodMoment = minPeriod ? moment(minPeriod, 'hh:mm:ss') : null;
    const maxPeriodMoment = maxPeriod ? moment(maxPeriod, 'hh:mm:ss') : null;
    const durationWithinLimits = isDurationWithinLimits(
      reservationLength, minPeriod, maxPeriod);

    const popover = (
      <Popover
        className="reservation-popover"
        id="popover-selection-information"
        title={t('ReservationPopover.selectionInfoHeader')}
      >
        <span>
          {moment(begin).format('HH:mm')}


          –
          {end && moment(end).format('HH:mm')}
        </span>

        {reservationLength && (
          <span className={`reservation-popover__length${!durationWithinLimits ? ' limit-alert' : ''}`}>
            {reservationLength.hours()
              ? `(${reservationLength.hours()}h ${reservationLength.minutes()}min)`
              : `(${reservationLength.minutes()}min)`}
          </span>
        )}
        {minPeriod && (
          <span>
              {t('ReservationPopover.minPeriod')}
            <span className="reservation-popover__period-limit">
              {minPeriodMoment.hours()
                ? `${minPeriodMoment.hours()}h ${minPeriodMoment.minutes()}min`
                : `${minPeriodMoment.minutes()}min`}
            </span>
          </span>
        )}
        {maxPeriod && (
          <span>
              {t('ReservationPopover.maxPeriod')}
            <span className="reservation-popover__period-limit">
              {maxPeriodMoment.hours()
                ? `${maxPeriodMoment.hours()}h ${maxPeriodMoment.minutes()}min`
                : `${maxPeriodMoment.minutes()}min`}
            </span>
          </span>
        )}

        {notValidTime && (
          <span className="reservation-popover__length limit-alert">
            {t('ReservationPopover.slotAlignWarning')}
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
  notValidTime: PropTypes.bool.isRequired,
};

ReservationPopover.defaultProps = {
  minPeriod: null,
  maxPeriod: null
};

export default injectT(ReservationPopover);
