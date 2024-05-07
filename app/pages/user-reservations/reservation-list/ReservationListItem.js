import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import iconHome from 'hel-icons/dist/shapes/home.svg';

import iconCalendar from 'assets/icons/calendar.svg';
import ReservationAccessCode from 'shared/reservation-access-code';
import ReservationControls from 'shared/reservation-controls';
import ReservationStateLabel from 'shared/reservation-state-label';
import TimeRange from 'shared/time-range';
import { injectT } from 'i18n';
import { getMainImage } from 'utils/imageUtils';
import { getResourcePageUrl } from 'utils/resourceUtils';
import { isMultiday } from '../../../utils/timeUtils';

class ReservationListItem extends Component {
  renderImage(image) {
    if (image && image.url) {
      return <img alt={image.caption} className="resourceImg" src={image.url} />;
    }
    return null;
  }

  render() {
    const {
      isAdmin, reservation, resource, t, unit, paymentUrlData
    } = this.props;

    const nameSeparator = isEmpty(resource) || isEmpty(unit) ? '' : ', ';
    const isReservationMultiday = isMultiday(reservation.begin, reservation.end);
    const beginFormat = isReservationMultiday ? 'D.M.YYYY HH:mm' : 'dddd, LLL';
    const endFormat = isReservationMultiday ? 'D.M.YYYY HH:mm' : 'LT';

    return (
      <li className="reservation container">
        <div className="col-md-3 col-lg-2 image-container">
          <Link
            aria-hidden="true"
            tabIndex="-1"
            to={getResourcePageUrl(resource)}
          >
            {this.renderImage(getMainImage(resource.images))}
          </Link>
        </div>
        <div className="col-xs-12 col-sm-8 col-md-5 col-lg-7 reservation-details">
          <ReservationStateLabel reservation={reservation} />
          <Link to={getResourcePageUrl(resource)}>
            <h2>{resource.name}</h2>
          </Link>
          <div>
            <img alt={t('common.addressStreetLabel')} className="location" src={iconHome} />
            <span className="unit-name">{unit.name}</span>
            {nameSeparator}
            <span>{unit.streetAddress}</span>
          </div>
          <div>
            <img alt={t('common.reservationTimeLabel')} className="timeslot" src={iconCalendar} />
            <TimeRange
              begin={reservation.begin}
              beginFormat={beginFormat}
              end={reservation.end}
              endFormat={endFormat}
              isMultiday={isReservationMultiday}
            />
          </div>
          <ReservationAccessCode
            reservation={reservation}
            resource={resource}
            text={t('ReservationListItem.accessCodeText')}
          />
        </div>
        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-3 action-container">
          <ReservationControls
            isAdmin={isAdmin}
            paymentUrlData={paymentUrlData}
            reservation={reservation}
            resource={resource}
          />
        </div>
      </li>
    );
  }
}

ReservationListItem.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
  paymentUrlData: PropTypes.object,
};

export default injectT(ReservationListItem);
