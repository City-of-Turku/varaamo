import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchReservations } from 'actions/reservationActions';
import { fetchResources } from 'actions/resourceActions';
import { fetchUnits } from 'actions/unitActions';
import ReservationInfoModal from 'shared/modals/reservation-info';
import PageWrapper from 'pages/PageWrapper';
import ReservationCancelModal from 'shared/modals/reservation-cancel';
import ReservationPaymentModal from 'shared/modals/reservation-payment';
import { injectT } from 'i18n';
import userReservationsPageSelector from './userReservationsPageSelector';
import ReservationList from './reservation-list';
import { loadPersistedPaymentUrl } from '../../utils/localStorageUtils';

class UnconnectedUserReservationsPage extends Component {
  componentDidMount() {
    this.props.actions.fetchResources();
    this.props.actions.fetchUnits();
    this.props.actions.fetchReservations({ isOwn: true, include: 'order_detail' });
  }

  render() {
    const {
      reservationsFetchCount,
      resourcesLoaded,
      t,
      contrast,
    } = this.props;

    const paymentUrlData = loadPersistedPaymentUrl();

    return (
      <div className={`app-UserReservationPage ${contrast}`}>
        <PageWrapper className="app-UserReservationPage__wrapper" title={t('UserReservationsPage.title')} transparent={false}>
          <Loader loaded={resourcesLoaded}>
            <div>
              <h1>{t('UserReservationsPage.title')}</h1>
              <ReservationList
                loading={reservationsFetchCount < 1}
                paymentUrlData={paymentUrlData}
              />
            </div>
            <ReservationCancelModal />
            <ReservationInfoModal />
            <ReservationPaymentModal />
          </Loader>
        </PageWrapper>
      </div>
    );
  }
}

UnconnectedUserReservationsPage.propTypes = {
  actions: PropTypes.object.isRequired,
  reservationsFetchCount: PropTypes.number.isRequired,
  resourcesLoaded: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  contrast: PropTypes.string,
};
UnconnectedUserReservationsPage = injectT(UnconnectedUserReservationsPage);  // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    fetchReservations,
    fetchResources,
    fetchUnits,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}


export { UnconnectedUserReservationsPage };
export default connect(userReservationsPageSelector, mapDispatchToProps)(
  UnconnectedUserReservationsPage
);
