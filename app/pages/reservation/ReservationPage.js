import constants from 'constants/AppConstants';

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
import { addNotification } from 'actions/notificationsActions';
import PageWrapper from 'pages/PageWrapper';
import { injectT } from 'i18n';
import ReservationConfirmation from './reservation-confirmation/ReservationConfirmation';
import ReservationInformation from './reservation-information/ReservationInformation';
import ReservationPhases from './reservation-phases/ReservationPhases';
import ReservationTime from './reservation-time/ReservationTime';
import reservationPageSelector from './reservationPageSelector';
import {
  changeProductQuantity, checkOrderPrice, createOrder, createOrderLines,
  getInitialProducts, getNonZeroQuantityProducts, hasProducts
} from '../../utils/reservationUtils';
import userManager from 'utils/userManager';
import ReservationProducts from './reservation-products/ReservationProducts';

class UnconnectedReservationPage extends Component {
  constructor(props) {
    super(props);
    this.fetchResource = this.fetchResource.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
    this.handleChangeProductQuantity = this.handleChangeProductQuantity.bind(this);
    this.handleCheckOrderPrice = this.handleCheckOrderPrice.bind(this);
    this.handleCreateErrorNotification = this.handleCreateErrorNotification.bind(this);
    this.HandleToggleMandatoryProducts = this.HandleToggleMandatoryProducts.bind(this);
    this.handleCustomerGroupChange = this.handleCustomerGroupChange.bind(this);

    const { reservationToEdit, resource } = this.props;

    this.state = {
      view: this.getInitialView(resource, reservationToEdit),
      mandatoryProducts: getInitialProducts(resource, constants.PRODUCT_TYPES.MANDATORY),
      extraProducts: getInitialProducts(resource, constants.PRODUCT_TYPES.EXTRA),
      order: { loadingData: true },
      skipMandatoryProducts: false,
      currentCustomerGroup: '',
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
    } else {
      // handle price ops only when reservation info exists
      const isEditing = !isEmpty(reservationToEdit);
      const { mandatoryProducts, extraProducts } = this.state;
      this.handleCheckOrderPrice(
        this.props.resource, selected, mandatoryProducts, extraProducts, isEditing
      );
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

  getInitialView(resource, reservationToEdit) {
    if (!isEmpty(reservationToEdit)) {
      return 'time';
    }
    if (hasProducts(resource)) {
      return 'products';
    }

    return 'information';
  }

  handleBack = () => {
    const { resource, reservationToEdit } = this.props;
    const includeProducts = hasProducts(resource) && isEmpty(reservationToEdit);

    if (this.state.view === 'information' && includeProducts) {
      this.setState({ view: 'products' });
      window.scrollTo(0, 0);
    } else if (!isEmpty(reservationToEdit)) {
      this.setState({ view: 'time' });
      window.scrollTo(0, 0);
    }
  };

  handleConfirmTime = () => {
    const { resource, reservationToEdit } = this.props;
    // when editing reservation with products, dont include products page
    const includeProducts = hasProducts(resource) && isEmpty(reservationToEdit);
    this.setState({ view: includeProducts ? 'products' : 'information' });
    window.scrollTo(0, 0);
  };

  handleProductsConfirm = () => {
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
      const { mandatoryProducts, extraProducts, currentCustomerGroup } = this.state;

      // order with only zero quantity products won't go through payment process
      const products = getNonZeroQuantityProducts([...mandatoryProducts, ...extraProducts]);
      const order = createOrder(products, currentCustomerGroup);

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

  handleCreateErrorNotification() {
    const { actions, t } = this.props;
    actions.addNotification({
      message: t('Notifications.errorMessage'),
      type: 'error',
      timeOut: 10000,
    });
  }

  handleCustomerGroupChange(event) {
    const { value } = event.target;
    const { resource, selected } = this.props;
    const { mandatoryProducts, extraProducts } = this.state;
    this.setState({ currentCustomerGroup: value });
    this.handleCheckOrderPrice(
      resource, selected, mandatoryProducts, extraProducts, false, value
    );
  }

  handleCheckOrderPrice(
    resource, selectedTime, mandatoryProducts, extraProducts, isEditing = false, customerGroup
  ) {
    if (!hasProducts(resource) || isEditing) {
      return;
    }

    const begin = !isEmpty(selectedTime) ? first(selectedTime).begin : null;
    const end = !isEmpty(selectedTime) ? last(selectedTime).end : null;
    const products = [...mandatoryProducts, ...extraProducts];

    checkOrderPrice(begin, end, createOrderLines(products), this.props.state, customerGroup)
      .then(order => this.setState({ order }))
      .catch(() => {
        this.handleCreateErrorNotification();
        this.setState({ order: { error: true } });
      });
  }

  HandleToggleMandatoryProducts() {
    const { skipMandatoryProducts, mandatoryProducts, extraProducts } = this.state;
    const { resource, selected } = this.props;
    const quantity = skipMandatoryProducts ? 1 : 0;
    const updatedMandatoryProducts = mandatoryProducts.map(
      mandatoryProduct => changeProductQuantity(mandatoryProduct, quantity)
    );
    this.setState(prevState => ({
      mandatoryProducts: updatedMandatoryProducts,
      skipMandatoryProducts: !prevState.skipMandatoryProducts,
    }));
    this.handleCheckOrderPrice(
      resource, selected, updatedMandatoryProducts, extraProducts
    );
  }

  handleChangeProductQuantity(product, quantity, type = constants.PRODUCT_TYPES.EXTRA) {
    const { resource, selected } = this.props;
    const { mandatoryProducts, extraProducts, currentCustomerGroup } = this.state;
    if (hasProducts(resource)) {
      if (type === constants.PRODUCT_TYPES.MANDATORY) {
        const updatedMandatoryProducts = mandatoryProducts.map((mandatoryProduct) => {
          if (mandatoryProduct.id === product.id) {
            return changeProductQuantity(product, quantity);
          }
          return mandatoryProduct;
        });
        this.setState({ mandatoryProducts: updatedMandatoryProducts });
        this.handleCheckOrderPrice(
          resource, selected, updatedMandatoryProducts, extraProducts, false, currentCustomerGroup
        );
      }
      if (type === constants.PRODUCT_TYPES.EXTRA) {
        const updatedExtraProducts = extraProducts.map((extraProduct) => {
          if (extraProduct.id === product.id) {
            return changeProductQuantity(product, quantity);
          }
          return extraProduct;
        });
        this.setState({ extraProducts: updatedExtraProducts });
        this.handleCheckOrderPrice(
          resource, selected, mandatoryProducts, updatedExtraProducts, false, currentCustomerGroup
        );
      }
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
    const {
      currentCustomerGroup, order, skipMandatoryProducts, view
    } = this.state;

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
                {view === 'products' && selectedTime && (
                  <ReservationProducts
                    changeProductQuantity={this.handleChangeProductQuantity}
                    currentCustomerGroup={currentCustomerGroup}
                    currentLanguage={currentLanguage}
                    isEditing={isEditing}
                    isStaff={isStaff}
                    onBack={this.handleBack}
                    onCancel={this.handleCancel}
                    onConfirm={this.handleProductsConfirm}
                    onCustomerGroupChange={this.handleCustomerGroupChange}
                    onStaffSkipChange={this.HandleToggleMandatoryProducts}
                    order={order}
                    resource={resource}
                    selectedTime={selectedTime}
                    skipMandatoryProducts={skipMandatoryProducts}
                    unit={unit}
                  />
                )}
                {view === 'information' && selectedTime && (
                  <ReservationInformation
                    currentCustomerGroup={currentCustomerGroup}
                    isAdmin={isAdmin}
                    isEditing={isEditing}
                    isMakingReservations={isMakingReservations}
                    isStaff={isStaff}
                    onBack={this.handleBack}
                    onCancel={this.handleCancel}
                    onConfirm={this.handleReservation}
                    openResourcePaymentTermsModal={actions.openResourcePaymentTermsModal}
                    openResourceTermsModal={actions.openResourceTermsModal}
                    order={order}
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
    addNotification,
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
