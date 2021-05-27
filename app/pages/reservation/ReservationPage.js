import first from 'lodash/first';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';
import get from 'lodash/get';
import has from 'lodash/has';
import moment from 'moment';
import React, { Component } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import { postReservation, putReservation } from 'actions/reservationActions';
import { fetchResource } from 'actions/resourceActions';
import {
  clearReservations,
  closeReservationSuccessModal,
  openResourceTermsModal,
  openResourcePaymentTermsModal,
} from 'actions/uiActions';
import PageWrapper from 'pages/PageWrapper';
import { injectT } from 'i18n';
import ReservationConfirmation from './reservation-confirmation/ReservationConfirmation';
import ReservationInformation from './reservation-information/ReservationInformation';
import ReservationPhases from './reservation-phases/ReservationPhases';
import ReservationTime from './reservation-time/ReservationTime';
import reservationPageSelector from './reservationPageSelector';
import { createOrder, hasProducts } from '../../utils/reservationUtils';
import userManager from 'utils/userManager';

class UnconnectedReservationPage extends Component {
  constructor(props) {
    super(props);
    this.fetchResource = this.fetchResource.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
    const { reservationToEdit } = this.props;
    this.state = {
      view: !isEmpty(reservationToEdit) ? 'time' : 'information',
    };
  }

  /**
 * The last if statement is there to redirect to the resource page if
 * language changes on the final confirmation page, previously it just
 * displayed an empty page.
 */
  componentDidMount() {
    const {
      location,
      reservationCreated,
      reservationEdited,
      reservationToEdit,
      selected,
      history,
      isLoggedIn,
      loginExpiresAt
    } = this.props;
    if (
      isEmpty(reservationCreated)
      && isEmpty(reservationEdited)
      && isEmpty(reservationToEdit)
      && isEmpty(selected)
    ) {
      const query = queryString.parse(location.search);

      if (!query.id && query.resource) {
        history.replace(`/resources/${query.resource}`);
      } else if ('path' in query && query.path === 'manage-reservations') {
        history.replace('/manage-reservations');
      } else {
        history.replace('/my-reservations');
      }
    }
    if (
      this.state.view === 'information'
      && (!isEmpty(reservationCreated) || !isEmpty(reservationEdited))
    ) {
      this.handleRedirect();
    } else {
      this.fetchResource();
      window.scrollTo(0, 0);
    }

    // ensure user has enough time to complete reservation
    this.handleSigninRefresh(isLoggedIn, loginExpiresAt, 20);
  }

  componentWillUpdate(nextProps) {
    // changes to confirm page if receives correct reservation props from backend
    // if requires payment, redirect to given url
    const { reservationCreated: nextCreated, reservationEdited: nextEdited } = nextProps;
    const { reservationCreated, reservationEdited } = this.props;
    if (
      (!isEmpty(nextCreated) || !isEmpty(nextEdited))
      && (nextCreated !== reservationCreated || nextEdited !== reservationEdited)
    ) {
      if (has(nextCreated, 'order.paymentUrl')) {
        const paymentUrl = get(nextCreated, 'order.paymentUrl');
        window.location = paymentUrl;
        return;
      }
      // TODO: fix this lint
      // eslint-disable-next-line react/no-will-update-set-state
      this.setState({
        view: 'confirmation',
      });
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount() {
    if (this.state.view === 'confirmation') {
      this.props.actions.clearReservations();
    }
    this.props.actions.closeReservationSuccessModal();
  }

  handleBack = () => {
    if (!isEmpty(this.props.reservationToEdit)) {
      this.setState({ view: 'time' });
      window.scrollTo(0, 0);
    }
  };

  handleConfirmTime = () => {
    this.setState({ view: 'information' });
    window.scrollTo(0, 0);
  };

  /**
   * Calls redux post reservation action if making a new reservation or
   * put reservation action if editing a previously made reservation.
   *
   * @param {Object} values each form field's values
   */
  handleReservation = (values = {}) => {
    const {
      actions, currentLanguage, reservationToEdit, resource, selected
    } = this.props;
    if (!isEmpty(selected)) {
      const { begin } = first(selected);
      const { end } = last(selected);
      const preferredLanguage = currentLanguage;
      const order = createOrder(resource.products);

      if (!isEmpty(reservationToEdit)) {
        // old reservation values before editing
        const oldValues = Object.assign({}, reservationToEdit);
        // new reservation values from each field
        const newValues = Object.assign({}, values);
        // if value (string) was not previously empty and now is empty -> insert "-"
        for (let i = 0; i < Object.keys(newValues).length; i += 1) {
          const key = Object.keys(newValues)[i];
          if (typeof (oldValues[key]) === 'string' && oldValues[key].length > 0
          && typeof (values[key]) === 'string' && values[key].trim().length === 0) {
            newValues[key] = '-';
          }
        }

        actions.putReservation({
          ...oldValues,
          ...newValues,
          preferredLanguage,
          begin,
          end,
        });
      } else {
        actions.postReservation({
          ...values,
          order,
          preferredLanguage,
          begin,
          end,
          resource: resource.id,
        });
      }
    }
  };

  handleCancel = () => {
    const {
      reservationToEdit, resource, history, location
    } = this.props;
    if (!isEmpty(reservationToEdit)) {
      const query = queryString.parse(location.search);
      if ('path' in query && query.path === 'manage-reservations') {
        history.replace('/manage-reservations');
      } else {
        history.replace('/my-reservations');
      }
    } else {
      history.replace(`/resources/${resource.id}`);
    }
  }

  // silently refreshes login if current login is old enough
  handleSigninRefresh(isLoggedIn, loginExpiresAt, minMinutesLeft = 20) {
    // dont handle if user is not currently logged in
    if (isLoggedIn && loginExpiresAt) {
      const expiresAt = moment.unix(loginExpiresAt);
      const minutesLeft = expiresAt.diff(moment(), 'minutes');
      if (minutesLeft < minMinutesLeft) {
        userManager.signinSilent();
      }
    }
  }

  /**
 * Redirects the user to the resourcepage
 */
  handleRedirect() {
    const query = queryString.parse(this.props.location.search);
    this.props.history.push(`/resources/${query.resource}/reservation`);
  }

  fetchResource() {
    const { actions, date, resource } = this.props;
    if (!isEmpty(resource)) {
      const start = moment(date)
        .subtract(2, 'M')
        .startOf('month')
        .format();
      const end = moment(date)
        .add(2, 'M')
        .endOf('month')
        .format();
      actions.fetchResource(resource.id, { start, end });
    }
  }

  render() {
    const {
      actions,
      contrast,
      currentLanguage,
      isAdmin,
      isLoggedIn,
      isStaff,
      isFetchingResource,
      isMakingReservations,
      location,
      match,
      reservationCreated,
      reservationEdited,
      reservationToEdit,
      resource,
      selected,
      t,
      unit,
      user,
      history,
    } = this.props;
    const { view } = this.state;

    if (
      isEmpty(resource)
      && isEmpty(reservationCreated)
      && isEmpty(reservationEdited)
      && isEmpty(reservationToEdit)
      && !isFetchingResource
    ) {
      return <div />;
    }

    const isEditing = !isEmpty(reservationToEdit);
    const isEdited = !isEmpty(reservationEdited);
    const begin = !isEmpty(selected) ? first(selected).begin : null;
    const end = !isEmpty(selected) ? last(selected).end : null;
    const selectedTime = begin && end ? { begin, end } : null;
    const title = t(
      `ReservationPage.${isEditing || isEdited ? 'editReservationTitle' : 'newReservationTitle'}`
    );
    const params = queryString.parse(location.search);
    const hasPayment = hasProducts(resource);

    return (
      <div className="app-ReservationPage">
        <PageWrapper title={title} transparent>
          <React.Fragment>
            <div className={`app-ReservationPage__content ${contrast}`}>
              <h1>{title}</h1>
              <Loader loaded={!isEmpty(resource)}>
                <ReservationPhases
                  currentPhase={view}
                  hasPayment={hasPayment}
                  isEditing={isEditing || isEdited}
                />
                {view === 'time' && isEditing && (
                  <ReservationTime
                    history={history}
                    location={location}
                    match={match}
                    onCancel={this.handleCancel}
                    onConfirm={this.handleConfirmTime}
                    params={params}
                    resource={resource}
                    selectedReservation={reservationToEdit}
                    selectedTime={selectedTime}
                    unit={unit}
                  />
                )}
                {view === 'information' && selectedTime && (
                  <ReservationInformation
                    isAdmin={isAdmin}
                    isEditing={isEditing}
                    isMakingReservations={isMakingReservations}
                    isStaff={isStaff}
                    onBack={this.handleBack}
                    onCancel={this.handleCancel}
                    onConfirm={this.handleReservation}
                    openResourcePaymentTermsModal={actions.openResourcePaymentTermsModal}
                    openResourceTermsModal={actions.openResourceTermsModal}
                    reservation={reservationToEdit}
                    resource={resource}
                    selectedTime={selectedTime}
                    state={this.props.state}
                    unit={unit}
                    user={user}
                  />
                )}
                {view === 'confirmation' && (reservationCreated || reservationEdited) && (
                  <ReservationConfirmation
                    currentLanguage={currentLanguage}
                    history={history}
                    isEdited={isEdited}
                    isLoggedIn={isLoggedIn}
                    reservation={reservationCreated || reservationEdited}
                    resource={resource}
                    user={user}
                  />
                )}
              </Loader>
            </div>
          </React.Fragment>
        </PageWrapper>
      </div>
    );
  }
}

UnconnectedReservationPage.propTypes = {
  actions: PropTypes.object.isRequired,
  contrast: PropTypes.string,
  currentLanguage: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  isFetchingResource: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  reservationToEdit: PropTypes.object,
  reservationCreated: PropTypes.object,
  reservationEdited: PropTypes.object,
  resource: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
  state: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  loginExpiresAt: PropTypes.number
};
UnconnectedReservationPage = injectT(UnconnectedReservationPage); // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    clearReservations,
    closeReservationSuccessModal,
    fetchResource,
    openResourceTermsModal,
    openResourcePaymentTermsModal,
    putReservation,
    postReservation,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedReservationPage };
export default connect(
  reservationPageSelector,
  mapDispatchToProps
)(UnconnectedReservationPage);
