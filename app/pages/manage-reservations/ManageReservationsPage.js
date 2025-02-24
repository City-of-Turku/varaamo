
import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loader';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Button from 'react-bootstrap/lib/Button';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';

import constants from 'constants/AppConstants';
import injectT from '../../i18n/injectT';
import PageWrapper from '../PageWrapper';
import ManageReservationsFilters from './filters/ManageReservationsFilters';
import ManageReservationsList from './list/ManageReservationsList';
import Pagination from '../../shared/pagination/Pagination';
import { getFiltersFromUrl, getSearchFromFilters } from '../../utils/searchUtils';
import { getEditReservationUrl } from 'utils/reservationUtils';
import {
  clearReservations,
  selectReservationToEdit,
  showReservationInfoModal,
  openReservationCancelModal,
  selectReservationToCancel
} from 'actions/uiActions';
import { fetchResource } from 'actions/resourceActions';
import { fetchUnits } from 'actions/unitActions';
import {
  fetchReservations,
  confirmPreliminaryReservation,
  denyPreliminaryReservation
} from 'actions/reservationActions';
import manageReservationsPageSelector from './manageReservationsPageSelector';
import { getFilteredReservations, getResourceSlotSize } from './manageReservationsPageUtils';
import ReservationInfoModal from 'shared/modals/reservation-info';
import ReservationCancelModal from 'shared/modals/reservation-cancel';
import PageResultsText from './PageResultsText';
import MassCancelModal from '../../shared/modals/reservation-mass-cancel/MassCancelModal';
import ConfirmCashModal from '../../shared/modals/reservation-confirm-cash/ConfirmCashModal';


class ManageReservationsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showOnlyFilters: [constants.RESERVATION_SHOWONLY_FILTERS.CAN_MODIFY],
      showMassCancel: false,
      showConfirmCash: false,
      selectedReservation: null,
      openingEditPage: false,
      editPayload: {},
    };

    this.handleFetchReservations = this.handleFetchReservations.bind(this);
    this.handleFetchResource = this.handleFetchResource.bind(this);
    this.onSearchFiltersChange = this.onSearchFiltersChange.bind(this);
    this.onShowOnlyFiltersChange = this.onShowOnlyFiltersChange.bind(this);
    this.handleOpenInfoModal = this.handleOpenInfoModal.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleEditReservation = this.handleEditReservation.bind(this);
    this.handleShowMassCancel = this.handleShowMassCancel.bind(this);
    this.handleHideMassCancel = this.handleHideMassCancel.bind(this);
    this.handleShowConfirmCash = this.handleShowConfirmCash.bind(this);
    this.handleHideConfirmCash = this.handleHideConfirmCash.bind(this);
    this.handleConfirmCash = this.handleConfirmCash.bind(this);
    this.handleOpenEditPage = this.handleOpenEditPage.bind(this);
  }

  handleShowMassCancel() {
    this.setState({ showMassCancel: true });
  }

  handleHideMassCancel() {
    this.setState({ showMassCancel: false });
  }

  handleShowConfirmCash(reservation) {
    this.setState({ showConfirmCash: true, selectedReservation: reservation });
  }

  handleHideConfirmCash() {
    this.setState({ showConfirmCash: false, selectedReservation: null });
  }

  componentDidMount() {
    this.props.actions.fetchUnits();
    this.handleFetchReservations();
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (prevProps.location !== location) {
      this.handleFetchReservations();
    }
    if (prevProps.isFetchingResource && !this.props.isFetchingResource) {
      const { openingEditPage } = this.state;
      if (openingEditPage) {
        this.handleOpenEditPage();
      }
    }
  }

  onSearchFiltersChange(filters) {
    const { history } = this.props;

    history.push({
      search: getSearchFromFilters(filters),
    });
  }

  // handles filters which don't affect search url i.e. can_modify
  onShowOnlyFiltersChange(filters) {
    this.setState({
      showOnlyFilters: filters,
    });
  }

  handleFetchReservations() {
    const { location, actions } = this.props;
    const filters = getFiltersFromUrl(location, false);
    const params = {
      // add favorites in by default and override it with filters param
      is_favorite_resource: 'true',
      ...filters,
      pageSize: constants.MANAGE_RESERVATIONS.PAGE_SIZE,
      // adding both include params into an obj results them being added like this:
      // include=resource_detail&include=order_detai
      include: { 1: 'resource_detail', 2: 'order_detail' },
    };

    actions.fetchReservations({ ...params });
  }

  handleFetchResource(resourceId, begin) {
    const { actions } = this.props;
    // need to fetch resource reservation slot status for long enough period
    // to make date changes etc
    const start = moment(begin)
      .subtract(2, 'M')
      .startOf('month')
      .format();
    const end = moment(begin)
      .add(2, 'M')
      .endOf('month')
      .format();

    actions.fetchResource(resourceId, { start, end });
  }

  handleOpenInfoModal(reservation) {
    const { actions } = this.props;
    // fetch resource to get user permission info
    this.handleFetchResource(reservation.resource, reservation.begin);
    actions.showReservationInfoModal(reservation);
  }

  // starts process of opening reservation edit page
  handleEditClick(reservation) {
    const normalizedReservation = Object.assign(
      {}, reservation, { resource: reservation.resource.id }
    );
    this.handleFetchResource(reservation.resource.id, reservation.begin);
    const payload = { reservation: normalizedReservation };
    this.setState({ openingEditPage: true, editPayload: payload });
  }

  handleOpenEditPage() {
    const { actions, resources, history } = this.props;
    const { editPayload } = this.state;

    this.setState({ openingEditPage: false });

    // clear old selected reservations before selecting new reservation to edit
    actions.clearReservations();

    const payload = { ...editPayload };
    const slotSize = getResourceSlotSize(resources, payload.reservation.resource);
    if (slotSize) {
      payload.slotSize = slotSize;
    }

    actions.editReservation(payload);
    const nextUrl = `${getEditReservationUrl(editPayload.reservation)}&path=manage-reservations`;
    history.push(nextUrl);
  }

  // handles direct edit actions like confirm, deny and cancel reservation
  handleEditReservation(reservation, status) {
    const { actions } = this.props;

    switch (status) {
      case constants.RESERVATION_STATE.CANCELLED:
        actions.selectReservationToCancel(reservation);
        actions.openReservationCancelModal(reservation);
        break;
      case constants.RESERVATION_STATE.CONFIRMED:
        actions.confirmPreliminaryReservation(reservation);
        break;
      case constants.RESERVATION_STATE.WAITING_FOR_CASH_PAYMENT:
        this.handleShowConfirmCash(reservation);
        break;
      case constants.RESERVATION_STATE.DENIED:
        actions.denyPreliminaryReservation(reservation);
        break;
      default:
        break;
    }
  }

  // handles confirming cash payments via cash confirm modal onSubmit
  handleConfirmCash() {
    const { actions } = this.props;
    const { selectedReservation } = this.state;
    actions.confirmPreliminaryReservation(selectedReservation);
    this.handleHideConfirmCash();
  }

  render() {
    const {
      t,
      history,
      location,
      units,
      reservations,
      reservationsTotalCount,
      locale,
      isFetchingReservations,
      isFetchingUnits,
      fontSize,
    } = this.props;

    const {
      showOnlyFilters,
      showMassCancel,
      showConfirmCash,
    } = this.state;

    const filters = getFiltersFromUrl(location, false);
    const title = t('ManageReservationsPage.title');
    const filteredReservations = getFilteredReservations(showOnlyFilters, reservations, []);
    const currentPage = filters && filters.page ? Number(filters.page) : 1;

    return (
      <div className="app-ManageReservationsPage">
        <div className="app-ManageReservationsPage__filters">
          <Grid>
            <Row>
              <Col sm={9}>
                <h1>{title}</h1>
              </Col>
              <Col id="cancel-btn-container" sm={3}>
                <Button
                  className={fontSize}
                  id="cancel-reservations-btn"
                  onClick={this.handleShowMassCancel}
                >
                  {t('common.cancelReservations')}
                </Button>
              </Col>
            </Row>
          </Grid>
          <ManageReservationsFilters
            filters={filters}
            onSearchChange={this.onSearchFiltersChange}
            onShowOnlyFiltersChange={this.onShowOnlyFiltersChange}
            showOnlyFilters={showOnlyFilters}
            units={units}
          />
          <Grid>
            <Row>
              <Col sm={12}>
                <PageResultsText
                  currentPage={currentPage}
                  filteredReservations={filteredReservations}
                  pageSize={constants.MANAGE_RESERVATIONS.PAGE_SIZE}
                  reservations={reservations}
                  totalReservations={reservationsTotalCount}
                />
              </Col>
            </Row>
          </Grid>
        </div>
        <div className="app-ManageReservationsPage__list">
          <PageWrapper title={title}>
            <Row>
              <Col sm={12}>
                <Loader loaded={!isFetchingReservations && !isFetchingUnits}>
                  <ManageReservationsList
                    locale={locale}
                    onEditClick={this.handleEditClick}
                    onEditReservation={this.handleEditReservation}
                    onInfoClick={this.handleOpenInfoModal}
                    reservations={filteredReservations}
                  />
                </Loader>
                <Pagination
                  currentPage={filters && filters.page ? Number(filters.page) : 1}
                  onChange={newPage => history.push({
                    search: getSearchFromFilters({ ...filters, page: newPage }),
                  })}
                  pages={
                    Math.ceil(reservationsTotalCount / constants.MANAGE_RESERVATIONS.PAGE_SIZE)
                  }
                />
              </Col>
            </Row>
          </PageWrapper>
        </div>
        <ReservationInfoModal />
        <ReservationCancelModal />
        <MassCancelModal
          onCancelSuccess={this.handleFetchReservations}
          onClose={this.handleHideMassCancel}
          show={showMassCancel}
        />
        <ConfirmCashModal
          onClose={this.handleHideConfirmCash}
          onSubmit={this.handleConfirmCash}
          show={showConfirmCash}
        />
      </div>
    );
  }
}

ManageReservationsPage.propTypes = {
  t: PropTypes.func.isRequired,
  history: PropTypes.object,
  location: PropTypes.object.isRequired,
  actions: PropTypes.object,
  locale: PropTypes.string.isRequired,
  units: PropTypes.array,
  reservations: PropTypes.array,
  reservationsTotalCount: PropTypes.number.isRequired,
  resources: PropTypes.object,
  isFetchingResource: PropTypes.bool,
  isFetchingReservations: PropTypes.bool,
  isFetchingUnits: PropTypes.bool,
  fontSize: PropTypes.string,
};

export const UnwrappedManageReservationsPage = injectT(ManageReservationsPage);

const mapDispatchToProps = (dispatch) => {
  const actionCreators = {
    clearReservations,
    editReservation: selectReservationToEdit,
    fetchUnits,
    fetchReservations,
    fetchResource,
    showReservationInfoModal,
    openReservationCancelModal,
    selectReservationToCancel,
    confirmPreliminaryReservation,
    denyPreliminaryReservation,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
};

export default connect(
  manageReservationsPageSelector, mapDispatchToProps
)(withRouter(UnwrappedManageReservationsPage));
