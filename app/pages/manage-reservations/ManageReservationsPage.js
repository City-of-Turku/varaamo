import constants from 'constants/AppConstants';

import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loader';
import { Col, Grid, Row } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';

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
import { getFilteredReservations } from './manageReservationsPageUtils';
import ReservationInfoModal from 'shared/modals/reservation-info';
import ReservationCancelModal from 'shared/modals/reservation-cancel';
import PageResultsText from './PageResultsText';


class ManageReservationsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showOnlyFilters: [constants.RESERVATION_SHOWONLY_FILTERS.CAN_MODIFY],
    };

    this.handleFetchReservations = this.handleFetchReservations.bind(this);
    this.handleFetchResource = this.handleFetchResource.bind(this);
    this.onSearchFiltersChange = this.onSearchFiltersChange.bind(this);
    this.onShowOnlyFiltersChange = this.onShowOnlyFiltersChange.bind(this);
    this.handleOpenInfoModal = this.handleOpenInfoModal.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleEditReservation = this.handleEditReservation.bind(this);
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

  // opens reservation page in edit mode
  handleEditClick(reservation) {
    const { history, actions } = this.props;

    const normalizedReservation = Object.assign(
      {}, reservation, { resource: reservation.resource.id }
    );
    // clear old selected reservations before selecting new reservation to edit
    actions.clearReservations();

    // fetch resource before changing page to make sure reservation page has
    // all needed info to function
    this.handleFetchResource(reservation.resource.id, reservation.begin);
    actions.editReservation({ reservation: normalizedReservation });
    const nextUrl = `${getEditReservationUrl(normalizedReservation)}&path=manage-reservations`;
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
      case constants.RESERVATION_STATE.DENIED:
        actions.denyPreliminaryReservation(reservation);
        break;
      default:
        break;
    }
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
    } = this.props;

    const {
      showOnlyFilters,
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
              <Col sm={12}>
                <h1>{title}</h1>
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
  isFetchingReservations: PropTypes.bool,
  isFetchingUnits: PropTypes.bool,
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
