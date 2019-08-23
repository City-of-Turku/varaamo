import * as React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Loader from 'react-loader';
import { withRouter } from 'react-router-dom';
import { Grid, Row, Col } from 'react-bootstrap';

import PageWrapper from '../../../../app/pages/PageWrapper';
import injectT from '../../../../app/i18n/injectT';
import client from '../../../../common/api/client';
import ManageReservationsFilters from '../filters/ManageReservationsFilters';
import ManageReservationsList from '../list/ManageReservationsList';
import Pagination from '../../../../common/pagination/Pagination';
import * as searchUtils from '../../../search/utils';
import ReservationInfomationModal from '../../modal/ReservationInfomationModal';

export const PAGE_SIZE = 50;

class ManageReservationsPage extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    history: PropTypes.object,
    location: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isLoadingUnits: false,
      reservations: [],
      units: [],
      totalCount: 0,
      isModalOpen: false,
      selectedReservation: {}
    };
  }

  componentDidMount() {
    this.loadUnits();
    this.loadReservations();
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;

    if (prevProps.location !== location) {
      this.loadReservations();
    }
  }

  onInfoClick = (e, reservation) => {
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen,
      selectedReservation: reservation
    }));
  }

  loadReservations = () => {
    const {
      location,
    } = this.props;

    this.setState({
      isLoading: true,
    });

    const filters = searchUtils.getFiltersFromUrl(location, false);
    const params = {
      ...filters,
      page_size: PAGE_SIZE,
      include: 'resource_detail'
    };

    client.get('reservation', params)
      .then(({ data }) => {
        this.setState({
          isLoading: false,
          reservations: get(data, 'results', []),
          totalCount: get(data, 'count', 0),
        });
      });
  };

  loadUnits = () => {
    this.setState({
      isLoadingUnits: true,
    });

    client.get('unit', { page_size: 500, unit_has_resource: true })
      .then(({ data }) => {
        this.setState({
          isLoadingUnits: false,
          units: get(data, 'results', []),
        });
      });
  };

  onFiltersChange = (filters) => {
    const { history } = this.props;

    history.push({
      search: searchUtils.getSearchFromFilters(filters),
    });
  };

  render() {
    const {
      t,
      history,
      location,
    } = this.props;

    const {
      isLoading,
      isLoadingUnits,
      reservations,
      units,
      totalCount,
      isModalOpen,
      selectedReservation
    } = this.state;
    const filters = searchUtils.getFiltersFromUrl(location, false);
    const title = t('ManageReservationsPage.title');

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
            onChange={this.onFiltersChange}
            units={units}
          />
        </div>
        <div className="app-ManageReservationsPage__list">
          <PageWrapper title={title}>
            <Row>
              <Col sm={12}>
                <Loader loaded={!isLoading && !isLoadingUnits}>
                  <ManageReservationsList
                    onInfoClick={this.onInfoClick}
                    reservations={reservations}
                  />
                </Loader>
                <Pagination
                  onChange={newPage => history.push({
                    search: searchUtils.getSearchFromFilters({ ...filters, page: newPage }),
                  })}
                  page={filters && filters.page ? Number(filters.page) : 1}
                  pages={Math.round(totalCount / PAGE_SIZE)}
                />
              </Col>
            </Row>
          </PageWrapper>
        </div>
        {isModalOpen && (
        <div className="app-ManageReservationsPage__modal">
          <ReservationInfomationModal
            isOpen={isModalOpen}
            onHide={this.onInfoClick}
            reservation={selectedReservation}
          />
        </div>
        )}
      </div>
    );
  }
}

export const UnwrappedManageReservationsPage = injectT(ManageReservationsPage);
export default withRouter(UnwrappedManageReservationsPage);
