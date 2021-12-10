import React from 'react';
import Loader from 'react-loader';

import { shallowWithIntl, mountWithIntl } from 'utils/testUtils';
import ReservationPhases from '../reservation-phases/ReservationPhases';
import PaymentFailed from './PaymentFailed';
import PaymentSuccess from './PaymentSuccess';
import { UnconnectedReservationPaymentReturnPage as ReservationPaymentReturnPage } from './ReservationPaymentReturnPage';


describe('pages/reservation/payment/ReservationPaymentReturnPage', () => {
  const defaultProps = {
    location: {
      pathname: '/reservation-payment-return',
      search: '?payment_status=failure&reservation_id=01',
    },
    actions: {},
    resources: {},
    reservations: {},
    isLoggedIn: false,
    history: {}
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ReservationPaymentReturnPage {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    test('PageWrapper with correct props', () => {
      const wrapper = getWrapper();
      expect(wrapper).toHaveLength(1);
      expect(wrapper.prop('title')).toBe('ReservationPage.newReservationTitle');
      expect(wrapper.prop('transparent')).toBe(true);
    });

    test('wrapping div', () => {
      const div = getWrapper().find('.app-ReservationPage__content');
      expect(div).toHaveLength(1);
    });

    test('h1 title', () => {
      const title = getWrapper().find('h1');
      expect(title).toHaveLength(1);
      expect(title.prop('className')).toBe('app-ReservationPage__title app-ReservationPage__title--big');
      expect(title.text()).toBe('ReservationPage.newReservationTitle');
    });

    describe('ReservationPhases', () => {
      test('with default props', () => {
        const phases = getWrapper().find(ReservationPhases);
        expect(phases).toHaveLength(1);
        expect(phases.prop('hasProducts')).toBe(true);
        expect(phases.prop('isEditing')).toBe(false);
        expect(phases.prop('needManualConfirmation')).toBe(false);
      });
      test('when query param success is false', () => {
        const location = {
          pathname: '/reservation-payment-return',
          search: '?payment_status=failure&reservation_id=01',
        };
        const phases = getWrapper({ location }).find(ReservationPhases);
        expect(phases).toHaveLength(1);
        expect(phases.prop('currentPhase')).toBe('payment');
      });

      test('when query param success is false', () => {
        const location = {
          pathname: '/reservation-payment-return',
          search: '?payment_status=success&reservation_id=01',
        };
        const phases = getWrapper({ location }).find(ReservationPhases);
        expect(phases).toHaveLength(1);
        expect(phases.prop('currentPhase')).toBe('confirmation');
      });
    });

    describe('Loader', () => {
      test('when prop resources, reservations and isLoggedIn are empty and falsy', () => {
        const props = { resources: {}, reservations: {}, isLoggedIn: false };
        const loader = getWrapper(props).find(Loader);
        expect(loader).toHaveLength(1);
        expect(loader.prop('loaded')).toBe(false);
      });

      test('when prop resources, reservations and isLoggedIn are not empty and truthy', () => {
        const props = { resources: { id: 'test' }, reservations: { id: 'test' }, isLoggedIn: true };
        const loader = getWrapper(props).find(Loader);
        expect(loader).toHaveLength(1);
        expect(loader.prop('loaded')).toBe(true);
      });
    });

    describe('PaymentSuccess', () => {
      test('when status is success and not loading', () => {
        const props = {
          resources: { resource1: { id: 'resource1' } },
          reservations: { reservation1: { id: 3, resource: 'resource1' }, },
          isLoggedIn: true,
          location: {
            pathname: '/reservation-payment-return',
            search: '?payment_status=success&reservation_id=3',
          }
        };
        const wrapper = getWrapper(props);
        const instance = wrapper.instance();
        const paymentSuccess = wrapper.find(PaymentSuccess);
        const reservation = instance.getReservation(
          props.reservations.reservation1.id, props.reservations
        );

        expect(paymentSuccess).toHaveLength(1);
        expect(paymentSuccess.prop('history')).toBe(defaultProps.history);
        expect(paymentSuccess.prop('isLoggedIn')).toBe(props.isLoggedIn);
        expect(paymentSuccess.prop('reservation')).toBe(reservation);
        expect(paymentSuccess.prop('resource')).toBe(props.resources[reservation.resource]);
      });

      test('when status is not success', () => {
        const props = {
          location: {
            pathname: '/reservation-payment-return',
            search: '?payment_status=failure&reservation_id=3',
          }
        };

        const paymentSuccess = getWrapper(props).find(PaymentSuccess);
        expect(paymentSuccess).toHaveLength(0);
      });
    });

    describe('PaymentFailed', () => {
      test('when status is failure', () => {
        const props = {
          resources: { resource1: { id: 'resource1' } },
          reservations: { reservation1: { id: 3, resource: 'resource1' }, },
          isLoggedIn: true,
          location: {
            pathname: '/reservation-payment-return',
            search: '?payment_status=failure&reservation_id=3',
          }
        };
        const paymentFailed = getWrapper(props).find(PaymentFailed);
        expect(paymentFailed).toHaveLength(1);
        expect(paymentFailed.prop('resourceId')).toBe(props.resources.resource1.id);
      });

      test('when status is not failure', () => {
        const props = {
          location: {
            pathname: '/reservation-payment-return',
            search: '?payment_status=success&reservation_id=3',
          }
        };
        const paymentFailed = getWrapper(props).find(PaymentFailed);
        expect(paymentFailed).toHaveLength(0);
      });
    });
  });

  describe('functions', () => {
    describe('componentDidUpdate', () => {
      describe('when isLoggedIn prop changes', () => {
        test('calls props.actions.fetchResources and fetchReservations', () => {
          const fetchResources = jest.fn();
          const fetchReservations = jest.fn();
          const actions = { fetchResources, fetchReservations };
          const wrapper = mountWithIntl(
            <ReservationPaymentReturnPage {...defaultProps} {...{ actions }} />
          );

          expect(fetchResources.mock.calls.length).toBe(0);
          expect(fetchReservations.mock.calls.length).toBe(0);
          wrapper.setProps({ isLoggedIn: true });
          expect(fetchResources.mock.calls.length).toBe(1);
          expect(fetchReservations.mock.calls.length).toBe(1);
          expect(fetchReservations.mock.calls[0][0]).toStrictEqual({ include: 'order_detail', isOwn: true });
        });
      });

      describe('getQueryParam', () => {
        test('returns url search parameter value for given name or undefined if param doesnt exist', () => {
          const location = {
            pathname: '/reservation-payment-return',
            search: '?payment_status=success&reservation_id=3',
          };
          const instance = getWrapper({ location }).instance();
          expect(instance.getQueryParam('payment_status')).toBe('success');
          expect(instance.getQueryParam('test')).toBe(undefined);
        });
      });

      describe('getReservation', () => {
        const reservations = { reservation1: { id: 3, resource: 'resource1' }, };

        test('returns null if param reservations is falsy', () => {
          const instance = getWrapper().instance();
          expect(instance.getReservation(1, undefined)).toBe(null);
        });

        test('returns null if reservations doesnt contain reservation with given id', () => {
          const instance = getWrapper({ reservations }).instance();
          expect(instance.getReservation(1, reservations)).toBe(null);
        });

        test('returns correct reservation when reservations contains reservation with given id', () => {
          const instance = getWrapper({ reservations }).instance();
          expect(instance.getReservation(3, reservations)).toBe(reservations.reservation1);
        });
      });
    });
  });
});
