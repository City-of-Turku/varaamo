import React from 'react';
import simple from 'simple-mock';

import PageWrapper from 'pages/PageWrapper';
import { shallowWithIntl } from 'utils/testUtils';
import { UnconnectedUserReservationsPage as UserReservationsPage } from './UserReservationsPage';
import ReservationList from './reservation-list';
import ReservationCancelModal from 'shared/modals/reservation-cancel';
import ReservationInfoModal from 'shared/modals/reservation-info';
import ReservationPaymentModal from 'shared/modals/reservation-payment';

describe('pages/user-reservations/UserReservationsPage', () => {
  const fetchReservations = simple.stub();
  const fetchResources = simple.stub();
  const fetchUnits = simple.stub();

  const defaultProps = {
    actions: {
      fetchReservations,
      fetchResources,
      fetchUnits,
    },
    reservationsFetchCount: 1,
    resourcesLoaded: true,
    contrast: '',
  };

  function getWrapper(extraProps = {}) {
    const props = Object.assign({}, defaultProps, extraProps);
    return shallowWithIntl(<UserReservationsPage {...props} />);
  }

  describe('render', () => {
    test('renders UserReservationPage with high-contrast', () => {
      const element = getWrapper({ contrast: 'high-contrast' }).find('div').first();
      expect(element.hasClass('high-contrast')).toBe(true);
    });

    test('renders UserReservationPage without high-contrast', () => {
      const element = getWrapper().find('div').first();
      expect(element.hasClass('high-contrast')).toBe(false);
    });

    test('renders PageWrapper with correct title', () => {
      const pageWrapper = getWrapper().find(PageWrapper);
      expect(pageWrapper).toHaveLength(1);
      expect(pageWrapper.prop('title')).toBe('UserReservationsPage.title');
    });

    test('displays correct title inside h1 tags', () => {
      const h1 = getWrapper().find('h1');
      expect(h1.text()).toBe('UserReservationsPage.title');
    });

    test('renders ReservationList with all user reservations', () => {
      const reservationList = getWrapper().find(ReservationList);

      expect(reservationList.length).toBe(1);
      expect(reservationList.props().filter).toBeFalsy();
      expect(reservationList.prop('loading')).toBeDefined();
      expect(reservationList.prop('paymentUrlData')).toBe(undefined);
    });

    test('renders ReservationCancelModal', () => {
      const modal = getWrapper().find(ReservationCancelModal);
      expect(modal).toHaveLength(1);
    });

    test('renders ReservationInfoModal ', () => {
      const modal = getWrapper().find(ReservationInfoModal);
      expect(modal).toHaveLength(1);
    });

    test('renders ReservationPaymentModal ', () => {
      const modal = getWrapper().find(ReservationPaymentModal);
      expect(modal).toHaveLength(1);
    });
  });

  describe('componentDidMount', () => {
    beforeAll(() => {
      fetchReservations.reset();
      fetchResources.reset();
      fetchUnits.reset();
      getWrapper().instance().componentDidMount();
    });

    test('fetches resources', () => {
      expect(fetchResources.callCount).toBe(1);
    });

    test('fetches units', () => {
      expect(fetchUnits.callCount).toBe(1);
    });

    test('fetches only user\'s own reservations', () => {
      expect(fetchReservations.callCount).toBe(1);
      expect(fetchReservations.lastCall.args[0].isOwn).toBe(true);
      expect(fetchReservations.lastCall.args[0].include).toBe('order_detail');
    });
  });
});
