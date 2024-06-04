import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import TimeRange from 'shared/time-range';
import { isMultiday } from '../../utils/timeUtils';

class CompactReservationList extends Component {
  renderFixedReservation = reservation => this.renderReservation(reservation);

  renderRemovableReservation = reservation => this.renderReservation(reservation, true);

  renderReservation = (reservation, removable = false) => {
    let resourceName = null;
    if (this.props.resources) {
      const resource = this.props.resources[reservation.resource] || {};
      resourceName = resource.name;
    }

    const isReservationMultiday = isMultiday(reservation.begin, reservation.end);
    const beginFormat = isReservationMultiday ? 'D.M.YYYY HH:mm' : 'dddd, LLL';
    const endFormat = isReservationMultiday ? 'D.M.YYYY HH:mm' : 'LT';

    return (
      <li key={reservation.begin}>
        {resourceName ? `${resourceName}: ` : ''}
        <TimeRange
          begin={reservation.begin}
          beginFormat={beginFormat}
          end={reservation.end}
          endFormat={endFormat}
        />
        {removable
          && (
          <Glyphicon
            glyph="remove-circle"
            onClick={() => this.props.onRemoveClick(reservation.begin)}
          />
          )
        }
        {this.props.subtitle
          && (
          <div className="compact-reservation-list-subtitle">
            {reservation[this.props.subtitle]}
          </div>
          )
        }
      </li>
    );
  }

  render() {
    return (
      <ul className="compact-reservation-list">
        {this.props.reservations.map(this.renderFixedReservation)}
        {this.props.removableReservations && this.props.removableReservations.map(
          this.renderRemovableReservation
        )}
      </ul>
    );
  }
}

CompactReservationList.propTypes = {
  onRemoveClick: PropTypes.func,
  removableReservations: PropTypes.array,
  reservations: PropTypes.array.isRequired,
  resources: PropTypes.object,
  subtitle: PropTypes.string,
};

export default CompactReservationList;
