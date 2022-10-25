import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { currentUserSelector } from '../../../state/selectors/authSelectors';
import ReservationConfirmation from '../reservation-confirmation/ReservationConfirmation';
import { currentLanguageSelector } from '../../../state/selectors/translationSelectors';

function PaymentSuccess({
  currentLanguage,
  reservation,
  resource,
  user,
  isLoggedIn,
  history
}) {
  /*
    Paid reservations are considered to have already been edited when
    the reservations requires manual confirmation at this point.
    Normal paid reservations are always at creation state at this point
    i.e. not yet edited.
  */
  const isEdited = !!((resource && resource.needManualConfirmation));

  return (
    <div className="reservation-payment-success">
      <ReservationConfirmation
        currentLanguage={currentLanguage}
        history={history}
        isEdited={isEdited}
        isLoggedIn={isLoggedIn}
        reservation={reservation}
        resource={resource}
        user={user}
      />
    </div>
  );
}

PaymentSuccess.propTypes = {
  currentLanguage: PropTypes.string.isRequired,
  reservation: PropTypes.object,
  resource: PropTypes.object,
  user: PropTypes.object,
  isLoggedIn: PropTypes.bool,
  history: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    currentLanguage: currentLanguageSelector(state),
    user: currentUserSelector(state)
  };
}

export { PaymentSuccess as UnconnectedPaymentSuccess };
export default connect(mapStateToProps, null)(PaymentSuccess);
