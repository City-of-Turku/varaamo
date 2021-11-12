import React from 'react';
import PropTypes from 'prop-types';

function SingleReservationDetail({ label, value }) {
  if (!value) {
    return null;
  }

  return (
    <React.Fragment>
      <p className="app-ReservationDetails__label">
        {label}
      </p>
      <p className="app-ReservationDetails__value">
        {value}
      </p>
    </React.Fragment>
  );
}

SingleReservationDetail.defaultProps = {
  value: ''
};

SingleReservationDetail.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default SingleReservationDetail;
