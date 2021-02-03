import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import get from 'lodash/get';
import Loader from 'react-loader';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import injectT from '../../../i18n/injectT';
import PageWrapper from '../../PageWrapper';
import PaymentFailed from './PaymentFailed';
import PaymentSuccess from './PaymentSuccess';
import { fetchResources } from 'actions/resourceActions';
import { fetchReservations } from 'actions/reservationActions';
import { reservationsSelector, resourcesSelector } from '../../../state/selectors/dataSelectors';
import { isLoggedInSelector } from '../../../state/selectors/authSelectors';
import ReservationPhases from '../reservation-phases/ReservationPhases';


class ReservationPaymentReturnPage extends Component {
  componentDidUpdate(prevProps) {
    // TODO: handle user not being logged in when returning here

    if (prevProps.isLoggedIn !== this.props.isLoggedIn) {
      this.props.actions.fetchResources();
      this.props.actions.fetchReservations({ include: 'order_detail', isOwn: true });
    }
  }

  // returns url search param
  getQueryParam = (paramName) => {
    const { location } = this.props;
    const params = queryString.parse(location.search);
    const param = get(params, paramName);
    return param;
  };

  // finds and returns correct reservation based on given id
  getReservation = (reservationId, reservations) => {
    if (!reservations) {
      return null;
    }

    const reservationArray = Object.values(reservations);
    for (let index = 0; index < reservationArray.length; index += 1) {
      if (reservationArray[index].id === Number(reservationId)) {
        return reservationArray[index];
      }
    }
    return null;
  }

  render() {
    const {
      t, reservations, resources, isLoggedIn, history,
    } = this.props;

    const isLoading = Object.keys(reservations).length < 1
       || Object.keys(resources).length < 1 || !isLoggedIn;

    const reservationId = this.getQueryParam('reservation_id');
    const status = this.getQueryParam('payment_status');

    const reservation = this.getReservation(reservationId, reservations);
    const resource = reservation ? resources[reservation.resource] : null;

    const title = t('ReservationPage.newReservationTitle');

    // if status is success, show summary page, else show payment page with error message..
    const view = status === 'success' ? 'confirmation' : 'payment';
    return (
      <PageWrapper title={title} transparent>
        <div className="app-ReservationPage__content">
          <h1 className="app-ReservationPage__title app-ReservationPage__title--big">
            {title}
          </h1>
          <ReservationPhases
            currentPhase={view}
            hasPayment
            isEditing={false}
          />
          <Loader loaded={!isLoading}>
            {status === 'success' && !isLoading && (
            <PaymentSuccess
              history={history}
              isLoggedIn={isLoggedIn}
              reservation={reservation}
              resource={resource}
            />
            )}
            {status === 'failure' && <PaymentFailed resourceId={resource ? resource.id : ''} />}
          </Loader>
        </div>
      </PageWrapper>
    );
  }
}

ReservationPaymentReturnPage.propTypes = {
  t: PropTypes.func,
  location: PropTypes.object,
  actions: PropTypes.object.isRequired,
  resources: PropTypes.object,
  reservations: PropTypes.object,
  isLoggedIn: PropTypes.bool,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  reservations: reservationsSelector,
  resources: resourcesSelector,
  isLoggedIn: isLoggedInSelector,
});

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    fetchResources,
    fetchReservations,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}
// eslint-disable-next-line no-class-assign
ReservationPaymentReturnPage = injectT(ReservationPaymentReturnPage);

export { ReservationPaymentReturnPage as UnconnectedReservationPaymentReturnPage };
export default connect(
  mapStateToProps, mapDispatchToProps
)(injectT(ReservationPaymentReturnPage));
