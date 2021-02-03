import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { currentUserSelector } from '../../../state/selectors/authSelectors';
import ReservationConfirmation from '../reservation-confirmation/ReservationConfirmation';

function PaymentSuccess({
  reservation,
  resource,
  user,
  isLoggedIn,
  history
}) {
  return (
    <div className="reservation-payment-success">
      <ReservationConfirmation
        history={history}
        isLoggedIn={isLoggedIn}
        reservation={reservation}
        resource={resource}
        user={user}
      />
    </div>
  );
}

PaymentSuccess.propTypes = {
  reservation: PropTypes.object,
  resource: PropTypes.object,
  user: PropTypes.object,
  isLoggedIn: PropTypes.bool,
  history: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    user: currentUserSelector(state)
  };
}

export { PaymentSuccess as UnconnectedPaymentSuccess };
export default connect(mapStateToProps, null)(PaymentSuccess);
