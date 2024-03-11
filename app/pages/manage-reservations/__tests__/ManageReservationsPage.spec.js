
import React from 'react';
import Loader from 'react-loader';
import moment from 'moment';

import constants from 'constants/AppConstants';
import { shallowWithIntl } from 'utils/testUtils';
import { getFiltersFromUrl, getSearchFromFilters } from 'utils/searchUtils';
import ManageReservationsFilters from '../filters/ManageReservationsFilters';
import { UnwrappedManageReservationsPage as ManageReservationPage } from '../ManageReservationsPage';
import ManageReservationsList from '../list/ManageReservationsList';
import { getFilteredReservations } from '../manageReservationsPageUtils';
import Pagination from 'shared/pagination/Pagination';
import ReservationInfoModal from 'shared/modals/reservation-info';
import ReservationCancelModal from 'shared/modals/reservation-cancel';
import PageWrapper from '../../PageWrapper';
import Reservation from 'utils/fixtures/Reservation';
import { getEditReservationUrl } from 'utils/reservationUtils';
import PageResultsText from '../PageResultsText';
import MassCancelModal from '../../../shared/modals/reservation-mass-cancel/MassCancelModal';
import ConfirmCashModal from '../../../shared/modals/reservation-confirm-cash/ConfirmCashModal';


describe('ManageReservationsFilters', () => {
  const defaultProps = {
    actions: {
      clearReservations: jest.fn(),
      editReservation: jest.fn(),
      fetchUnits: jest.fn(),
      fetchReservations: jest.fn(),
      fetchResource: jest.fn(),
      showReservationInfoModal: jest.fn(),
      openReservationCancelModal: jest.fn(),
      selectReservationToCancel: jest.fn(),
      confirmPreliminaryReservation: jest.fn(),
      denyPreliminaryReservation: jest.fn(),
    },
    history: { push: () => {} },
    location: {},
    locale: 'fi',
    units: [],
    reservations: [],
    reservationsTotalCount: 0,
    isFetchingReservations: false,
    isFetchingUnits: false,
    fontSize: '__font-size-small',
  };

  function getWrapper(props) {
    return shallowWithIntl(<ManageReservationPage {...defaultProps} {...props} />);
  }
  describe('renders', () => {
    test('wrapping div', () => {
      const wrapper = getWrapper().find('.app-ManageReservationsPage');
      expect(wrapper).toHaveLength(1);
    });

    test('filters wrapping div', () => {
      const wrapper = getWrapper().find('.app-ManageReservationsPage__filters');
      expect(wrapper).toHaveLength(1);
    });

    test('filters h1 heading', () => {
      const heading = getWrapper().find('.app-ManageReservationsPage__filters').find('h1');
      expect(heading).toHaveLength(1);
      expect(heading.text()).toBe('ManageReservationsPage.title');
    });

    test('mass cancel button', () => {
      const wrapper = getWrapper();
      const massCancelButton = wrapper.find('.app-ManageReservationsPage__filters').find('Button');
      expect(massCancelButton).toHaveLength(1);
      expect(massCancelButton.prop('id')).toBe('cancel-reservations-btn');
      expect(massCancelButton.prop('onClick')).toBe(wrapper.instance().handleShowMassCancel);
      expect(massCancelButton.prop('className')).toBe(defaultProps.fontSize);
      expect(massCancelButton.children().at(0).text()).toBe('common.cancelReservations');
    });

    test('ManageReservationsFilters', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const filters = wrapper.find(ManageReservationsFilters);
      expect(filters).toHaveLength(1);
      expect(filters.prop('filters')).toStrictEqual(getFiltersFromUrl(defaultProps.location, false));
      expect(filters.prop('onSearchChange')).toBe(instance.onSearchFiltersChange);
      expect(filters.prop('onShowOnlyFiltersChange')).toBe(instance.onShowOnlyFiltersChange);
      expect(filters.prop('showOnlyFilters')).toBe(instance.state.showOnlyFilters);
      expect(filters.prop('units')).toBe(defaultProps.units);
    });

    test('PageResultsText', () => {
      const results = getWrapper().find(PageResultsText);
      expect(results).toHaveLength(1);
      expect(results.prop('currentPage')).toBe(1);
      expect(results.prop('filteredReservations')).toStrictEqual([]);
      expect(results.prop('pageSize')).toBe(constants.MANAGE_RESERVATIONS.PAGE_SIZE);
      expect(results.prop('reservations')).toBe(defaultProps.reservations);
      expect(results.prop('totalReservations')).toBe(defaultProps.reservationsTotalCount);
    });

    test('results table wrapping div', () => {
      const wrapper = getWrapper().find('.app-ManageReservationsPage__list');
      expect(wrapper).toHaveLength(1);
    });

    test('PageWrapper', () => {
      const pageWrapper = getWrapper().find(PageWrapper);
      expect(pageWrapper).toHaveLength(1);
      expect(pageWrapper.prop('title')).toBe('ManageReservationsPage.title');
    });

    test('Loader', () => {
      const loader = getWrapper().find('.app-ManageReservationsPage__list').find(Loader);
      expect(loader).toHaveLength(1);
      expect(loader.prop('loaded')).toBe(
        !defaultProps.isFetchingReservations && !defaultProps.isFetchingUnits
      );
    });

    test('ManageReservationsList', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const list = wrapper.find(ManageReservationsList);
      expect(list).toHaveLength(1);
      expect(list.prop('locale')).toBe(defaultProps.locale);
      expect(list.prop('onEditClick')).toBe(instance.handleEditClick);
      expect(list.prop('onEditReservation')).toBe(instance.handleEditReservation);
      expect(list.prop('onInfoClick')).toBe(instance.handleOpenInfoModal);
      expect(list.prop('reservations')).toStrictEqual(
        getFilteredReservations(
          instance.state.showOnlyFilters,
          defaultProps.reservations,
          defaultProps.userFavoriteResources
        )
      );
    });

    test('Pagination', () => {
      const filters = getFiltersFromUrl(defaultProps.location, false);
      const pagination = getWrapper().find(Pagination);
      expect(pagination).toHaveLength(1);
      expect(pagination.prop('currentPage')).toBe(filters && filters.page ? Number(filters.page) : 1);
      expect(pagination.prop('onChange')).toBeDefined();
      expect(pagination.prop('pages')).toBe(
        Math.ceil(defaultProps.reservationsTotalCount / constants.MANAGE_RESERVATIONS.PAGE_SIZE)
      );
    });

    test('ReservationInfoModal', () => {
      const infoModal = getWrapper().find(ReservationInfoModal);
      expect(infoModal).toHaveLength(1);
    });

    test('ReservationCancelModal', () => {
      const cancelModal = getWrapper().find(ReservationCancelModal);
      expect(cancelModal).toHaveLength(1);
    });

    test('MassCancelModal', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const massCancelModal = wrapper.find(MassCancelModal);
      expect(massCancelModal).toHaveLength(1);
      expect(massCancelModal.prop('onCancelSuccess')).toBe(instance.handleFetchReservations);
      expect(massCancelModal.prop('onClose')).toBe(instance.handleHideMassCancel);
      expect(massCancelModal.prop('show')).toBe(instance.state.showMassCancel);
    });

    test('ConfirmCashModal', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const confirmCashModal = wrapper.find(ConfirmCashModal);
      expect(confirmCashModal).toHaveLength(1);
      expect(confirmCashModal.prop('onSubmit')).toBe(instance.handleConfirmCash);
      expect(confirmCashModal.prop('onClose')).toBe(instance.handleHideConfirmCash);
      expect(confirmCashModal.prop('show')).toBe(instance.state.showConfirmCash);
    });
  });

  describe('functions', () => {
    afterEach(() => {
      const actionFunctions = Object.values(defaultProps.actions);
      actionFunctions.forEach((action) => {
        action.mockClear();
      });
    });

    describe('handleShowMassCancel', () => {
      const instance = getWrapper().instance();
      const spy = jest.spyOn(instance, 'setState');
      instance.handleShowMassCancel();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toStrictEqual({ showMassCancel: true });
    });

    describe('handleHideMassCancel', () => {
      const instance = getWrapper().instance();
      const spy = jest.spyOn(instance, 'setState');
      instance.handleHideMassCancel();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toStrictEqual({ showMassCancel: false });
    });

    describe('handleShowConfirmCash', () => {
      test('calls setState with correct params', () => {
        const instance = getWrapper().instance();
        const spy = jest.spyOn(instance, 'setState');
        const reservation = { id: '123' };
        instance.handleShowConfirmCash(reservation);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toStrictEqual(
          { showConfirmCash: true, selectedReservation: reservation }
        );
      });
    });

    describe('handleHideConfirmCash', () => {
      test('calls setState with correct params', () => {
        const instance = getWrapper().instance();
        const spy = jest.spyOn(instance, 'setState');
        instance.handleHideConfirmCash();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toStrictEqual(
          { showConfirmCash: false, selectedReservation: null }
        );
      });
    });

    describe('componentDidMount', () => {
      test('calls fetchUnits', () => {
        const instance = getWrapper().instance();
        instance.componentDidMount();
        expect(defaultProps.actions.fetchUnits).toHaveBeenCalledTimes(1);
      });

      test('calls handleFetchReservations', () => {
        const instance = getWrapper().instance();
        const spy = jest.spyOn(instance, 'handleFetchReservations');
        instance.componentDidMount();
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    describe('componentDidUpdate', () => {
      test('calls handleFetchReservations when location changes', () => {
        const instance = getWrapper({ location: { search: '' } }).instance();
        const spy = jest.spyOn(instance, 'handleFetchReservations');
        instance.componentDidUpdate({ location: { search: '?test=123' } });
        expect(spy).toHaveBeenCalledTimes(1);
      });

      test('does not call handleFetchReservations when location does not changes', () => {
        const location = { search: '?test=123' };
        const instance = getWrapper({ location }).instance();
        const spy = jest.spyOn(instance, 'handleFetchReservations');
        instance.componentDidUpdate({ location });
        expect(spy).toHaveBeenCalledTimes(0);
      });
    });

    describe('onSearchFiltersChange', () => {
      test('calls history push with correct params', () => {
        const history = { push: jest.fn() };
        const filters = { test: 123 };
        const instance = getWrapper({ history }).instance();
        instance.onSearchFiltersChange(filters);
        expect(history.push.mock.calls.length).toBe(1);
        expect(history.push.mock.calls[0][0]).toStrictEqual({
          search: getSearchFromFilters(filters)
        });
      });
    });

    describe('onShowOnlyFiltersChange', () => {
      test('sets state showOnlyFilters', () => {
        const filters = ['test'];
        const instance = getWrapper().instance();
        instance.onShowOnlyFiltersChange(filters);
        expect(instance.state.showOnlyFilters).toBe(filters);
      });
    });

    describe('handleFetchReservations', () => {
      test('calls fetchReservations with correct params', () => {
        const location = { search: '?test=123' };
        const filters = getFiltersFromUrl(location, false);
        const params = {
          is_favorite_resource: 'true',
          ...filters,
          pageSize: constants.MANAGE_RESERVATIONS.PAGE_SIZE,
          include: { 1: 'resource_detail', 2: 'order_detail' },
        };
        const instance = getWrapper({ location }).instance();
        instance.handleFetchReservations();

        expect(defaultProps.actions.fetchReservations.mock.calls.length).toBe(1);
        expect(defaultProps.actions.fetchReservations.mock.calls[0][0]).toStrictEqual(params);
      });
    });

    describe('handleFetchResource', () => {
      test('calls fetchResource witch correct params', () => {
        const resourceId = 'test-1';
        const begin = '2021-05-20';
        const start = moment(begin)
          .subtract(2, 'M')
          .startOf('month')
          .format();
        const end = moment(begin)
          .add(2, 'M')
          .endOf('month')
          .format();
        const instance = getWrapper().instance();
        instance.handleFetchResource(resourceId, begin);
        expect(defaultProps.actions.fetchResource.mock.calls.length).toBe(1);
        expect(defaultProps.actions.fetchResource.mock.calls[0][0]).toBe(resourceId);
        expect(defaultProps.actions.fetchResource.mock.calls[0][1]).toStrictEqual({ start, end });
      });
    });

    describe('handleOpenInfoModal', () => {
      const reservation = Reservation.build({ resource: 'test-id' });

      test('calls handleFetchResource with correct params', () => {
        const instance = getWrapper().instance();
        const spy = jest.spyOn(instance, 'handleFetchResource');
        instance.handleOpenInfoModal(reservation);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(reservation.resource, reservation.begin);
      });

      test('calls showReservationInfoModal with correct params', () => {
        const instance = getWrapper().instance();
        instance.handleOpenInfoModal(reservation);
        expect(defaultProps.actions.showReservationInfoModal.mock.calls.length).toBe(1);
        expect(defaultProps.actions.showReservationInfoModal.mock.calls[0][0]).toBe(reservation);
      });
    });

    describe('handleEditClick', () => {
      const resource = { id: 'test-id' };
      const reservation = Reservation.build({ resource });
      const normalizedReservation = Object.assign(
        {}, reservation, { resource: reservation.resource.id }
      );
      test('calls clearReservations', () => {
        const instance = getWrapper().instance();
        instance.handleEditClick(reservation);
        expect(defaultProps.actions.clearReservations.mock.calls.length).toBe(1);
      });

      test('calls handleFetchResource with correct params', () => {
        const instance = getWrapper().instance();
        const spy = jest.spyOn(instance, 'handleFetchResource');
        instance.handleEditClick(reservation);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(resource.id, reservation.begin);
      });

      test('calls editReservation with correct params', () => {
        const instance = getWrapper().instance();
        instance.handleEditClick(reservation);
        expect(defaultProps.actions.editReservation.mock.calls.length).toBe(1);
        expect(defaultProps.actions.editReservation.mock.calls[0][0])
          .toStrictEqual({ reservation: normalizedReservation });
      });

      test('calls history push with correct params', () => {
        const history = { push: jest.fn() };
        const instance = getWrapper({ history }).instance();
        instance.handleEditClick(reservation);
        const expectedParam = `${getEditReservationUrl(normalizedReservation)}&path=manage-reservations`;
        expect(history.push.mock.calls.length).toBe(1);
        expect(history.push.mock.calls[0][0]).toBe(expectedParam);
      });
    });

    describe('handleEditReservation', () => {
      const reservation = Reservation.build();
      test('calls correct functions when status is cancelled', () => {
        const instance = getWrapper().instance();
        const status = constants.RESERVATION_STATE.CANCELLED;
        instance.handleEditReservation(reservation, status);
        expect(defaultProps.actions.selectReservationToCancel.mock.calls.length).toBe(1);
        expect(defaultProps.actions.selectReservationToCancel.mock.calls[0][0]).toBe(reservation);

        expect(defaultProps.actions.openReservationCancelModal.mock.calls.length).toBe(1);
        expect(defaultProps.actions.openReservationCancelModal.mock.calls[0][0]).toBe(reservation);
      });

      test('calls correct function when status is confirmed', () => {
        const instance = getWrapper().instance();
        const status = constants.RESERVATION_STATE.CONFIRMED;
        instance.handleEditReservation(reservation, status);
        expect(defaultProps.actions.confirmPreliminaryReservation.mock.calls.length).toBe(1);
        expect(defaultProps.actions.confirmPreliminaryReservation.mock.calls[0][0])
          .toBe(reservation);
      });

      test('calls correct function when status is waiting for cash', () => {
        const instance = getWrapper().instance();
        const spy = jest.spyOn(instance, 'handleShowConfirmCash');
        const status = constants.RESERVATION_STATE.WAITING_FOR_CASH_PAYMENT;
        instance.handleEditReservation(reservation, status);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(reservation);
      });

      test('calls correct function when status is denied', () => {
        const instance = getWrapper().instance();
        const status = constants.RESERVATION_STATE.DENIED;
        instance.handleEditReservation(reservation, status);
        expect(defaultProps.actions.denyPreliminaryReservation.mock.calls.length).toBe(1);
        expect(defaultProps.actions.denyPreliminaryReservation.mock.calls[0][0])
          .toBe(reservation);
      });

      test('doesnt call any of the defined functions when status is unknown', () => {
        const instance = getWrapper().instance();
        const status = 'test';
        instance.handleEditReservation(reservation, status);
        expect(defaultProps.actions.selectReservationToCancel.mock.calls.length).toBe(0);
        expect(defaultProps.actions.openReservationCancelModal.mock.calls.length).toBe(0);
        expect(defaultProps.actions.confirmPreliminaryReservation.mock.calls.length).toBe(0);
        expect(defaultProps.actions.denyPreliminaryReservation.mock.calls.length).toBe(0);
      });
    });

    describe('handleConfirmCash', () => {
      test('calls confirmPreliminaryReservation with correct params', () => {
        const reservation = Reservation.build();
        const instance = getWrapper().instance();
        instance.setState({ selectedReservation: reservation });
        instance.handleConfirmCash();
        expect(defaultProps.actions.confirmPreliminaryReservation.mock.calls.length).toBe(1);
        expect(defaultProps.actions.confirmPreliminaryReservation.mock.calls[0][0])
          .toBe(reservation);
      });

      test('sets correct state values', () => {
        const reservation = Reservation.build();
        const instance = getWrapper().instance();
        instance.setState({ selectedReservation: reservation, showConfirmCash: true });
        instance.handleConfirmCash();
        expect(instance.state.showConfirmCash).toBe(false);
        expect(instance.state.selectedReservation).toBe(null);
      });
    });
  });
});
