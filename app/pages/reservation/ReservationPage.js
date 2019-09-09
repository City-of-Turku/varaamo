import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import React, { Component } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { postReservation, putReservation } from '../../actions/reservationActions';
import { fetchResource } from '../../actions/resourceActions';
import {
  clearReservations,
  closeReservationSuccessModal,
  openResourceTermsModal,
} from '../../actions/uiActions';
import PageWrapper from '../PageWrapper';
import injectT from '../../i18n/injectT';
import ReservationInformation from './reservation-information/ReservationInformation';
import ReservationPhases from './reservation-phases/ReservationPhases';
import ReservationTime from './reservation-time/ReservationTime';
import reservationPageSelector from './reservationPageSelector';
import recurringReservationsConnector from '../../state/recurringReservations';
import { getResourceById } from '../../../src/domain/resource/utils';
import { getReservationById } from '../../../src/domain/reservation/utils';

class UnconnectedReservationPage extends Component {
  constructor(props) {
    super(props);
    this.fetchResource = this.fetchResource.bind(this);

    this.state = {
      view: 'time',
    };
  }

  componentDidMount() {
    const {
      match: { params }, history
    } = this.props;

    if (!params.reservationId) {
      history.replace('/my-reservations');
    } else {
      this.fetchReservation();
    }
  }

  handleBack = () => {
    this.setState({ view: 'time' });
    window.scrollTo(0, 0);
  };

  handleCancel = () => {
    const { history } = this.props;
    history.replace('/my-reservations');
  };

  handleConfirmTime = () => {
    this.setState({ view: 'information' });
    window.scrollTo(0, 0);
  };

  handleDateChange = (newDate) => {
    const { history } = this.props;
    const day = newDate.toISOString().substring(0, 10);
    history.replace(`/reservation?date=${day}`);
  };

  // createPaymentReturnUrl = () => {
  //   const { protocol, hostname } = window.location;
  //   const port = window.location.port ? `:${window.location.port}` : '';
  //   return `${protocol}//${hostname}${port}/reservation-payment-return`;
  // };

  handleReservation = () => {
    // later
  };

  fetchResource = async (resourceId) => {
    const {
      date
    } = this.props;

    const start = moment(date)
      .subtract(2, 'M')
      .startOf('month')
      .format();
    const end = moment(date)
      .add(2, 'M')
      .endOf('month')
      .format();

    let response;
    try {
      response = await getResourceById(resourceId, { start, end });

      this.setState({
        resource: response.data
      });
    } catch (err) {
      // TODO: make error notification
    }
  }

  fetchReservation = async () => {
    const { match: { params } } = this.props;

    let response;
    try {
      response = await getReservationById(params.reservationId);

      this.setState({
        reservation: response.data
      });

      this.fetchResource(response.data.resource);
    } catch (error) {
      // handle error
    }
  };

  // renderRecurringReservations = () => {
  //   const {
  //     resource,
  //     actions,
  //     recurringReservations,
  //     selectedReservations,
  //     t,
  //   } = this.props;

  //   const reservationsCount = selectedReservations.length + recurringReservations.length;
  //   const introText = resource.needManualConfirmation
  //     ? t('ConfirmReservationModal.preliminaryReservationText', { reservationsCount })
  //     : t('ConfirmReservationModal.regularReservationText', { reservationsCount });

  //   return (
  //     <>
  //       {/* Recurring selection dropdown  */}
  //       <RecurringReservationControls />
  //       { <p><strong>{introText}</strong></p> }

  //       {/* Selected recurring info */}
  //       <CompactReservationList
  //         onRemoveClick={actions.removeReservation}
  //         removableReservations={recurringReservations}
  //         reservations={selectedReservations}
  //       />
  //     </>
  //   );
  // }

  render() {
    const {
      actions,
      t,
      isAdmin
    } = this.props;
    const { view, resource, reservation } = this.state;

    if (
      isEmpty(resource)
      || isEmpty(reservation)
    ) {
      return <div />;
    }

    const isEditing = view === 'time';

    const title = t(
      `ReservationPage.${isEditing ? 'editReservationTitle' : 'newReservationTitle'}`
    );

    return (
      <div className="app-ReservationPage">
        <PageWrapper title={title} transparent>
          <div>
            <div className="app-ReservationPage__content">
              <h1 className="app-ReservationPage__title app-ReservationPage__title--big">
                {title}
              </h1>
              <Loader loaded={!isEmpty(resource)}>
                <ReservationPhases
                  currentPhase={view}
                  isEditing={isEditing}
                  resource={resource}
                />
                {view === 'time' && (
                  <ReservationTime
                    handleDateChange={this.handleDateChange}
                    onCancel={this.handleCancel}
                    onConfirm={this.handleConfirmTime}
                    reservation={reservation}
                    resource={resource}
                  />
                )}
                {view === 'information' && (
                  <>
                    {isAdmin && this.renderRecurringReservations()}
                    <ReservationInformation
                      onBack={this.handleBack}
                      onCancel={this.handleCancel}
                      onConfirm={this.handleReservation}
                      openResourceTermsModal={actions.openResourceTermsModal}
                      reservation={reservation}
                      resource={resource}
                      unit={reservation.unit}
                    />

                  </>

                )}
                {view === 'payment' && (
                  <div className="text-center">
                    <p>{t('ReservationPage.paymentText')}</p>
                  </div>
                )}
                {/* {view === 'confirmation' && (reservationCreated || reservationEdited) && (
                  <ReservationConfirmation
                    isEdited={isEdited}
                    reservation={reservationCreated || reservationEdited}
                    resource={resource}
                    user={user}
                  />
                )} */}
              </Loader>
            </div>
          </div>
        </PageWrapper>
      </div>
    );
  }
}

UnconnectedReservationPage.propTypes = {
  actions: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};
UnconnectedReservationPage = injectT(UnconnectedReservationPage); // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    clearReservations,
    closeReservationSuccessModal,
    fetchResource,
    openResourceTermsModal,
    putReservation,
    postReservation,
    removeReservation: recurringReservationsConnector.removeReservation,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedReservationPage };
export default connect(
  reservationPageSelector,
  mapDispatchToProps
)(UnconnectedReservationPage);
