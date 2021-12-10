import React from 'react';
import { Button, Modal } from 'react-bootstrap';

import { shallowWithIntl } from 'utils/testUtils';
import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import { UnconnectedPaymentModalContainer as PaymentModalContainer } from '../PaymentModalContainer';
import TimeRange from '../../../time-range/TimeRange';
import PaymentButton from '../PaymentButton';

describe('shared/modals/reservation-payment/PaymentModalContainer', () => {
  const defaultProps = {
    actions: {
      closeReservationPaymentModal: () => {},
      putReservation: () => {}
    },
    contrast: 'some-contrast-style',
    fontSize: 'some-fontsize-style',
    isLoggedIn: true,
    isSaving: false,
    loginExpiresAt: 0,
    reservation: Reservation.build(),
    resource: Resource.build(),
    show: false,
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<PaymentModalContainer {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    test('wrapping modal', () => {
      const modal = getWrapper().find(Modal);
      expect(modal).toHaveLength(1);
      expect(modal.prop('className')).toBe(`reservation-payment-modal ${defaultProps.fontSize} ${defaultProps.contrast}`);
      expect(modal.prop('onHide')).toBe(defaultProps.actions.closeReservationPaymentModal);
      expect(modal.prop('show')).toBe(defaultProps.show);
    });

    test('modal header', () => {
      const header = getWrapper().find(Modal.Header);
      expect(header).toHaveLength(1);
      expect(header.prop('closeButton')).toBe(true);
      expect(header.prop('closeLabel')).toBe('ModalHeader.closeButtonText');
    });

    test('modal title', () => {
      const title = getWrapper().find(Modal.Title);
      expect(title).toHaveLength(1);
      expect(title.prop('componentClass')).toBe('h3');
      expect(title.prop('children')).toBe('ReservationPaymentModal.title');
    });

    describe('modal body', () => {
      test('wrapper component', () => {
        const body = getWrapper().find(Modal.Body);
        expect(body).toHaveLength(1);
      });

      describe('children when reservation with order is given', () => {
        const order = { id: 'order-id', price: 3.50 };
        const ReservationWithOrder = Reservation.build({ order });
        const body = getWrapper({ reservation: ReservationWithOrder }).find(Modal.Body);

        test('reservation name', () => {
          const name = body.find('p.reservation-name');
          expect(name).toHaveLength(1);
          expect(name.text()).toBe(defaultProps.resource.name);
        });

        test('reservation time', () => {
          const timeDiv = body.find('div.reservation-time');
          expect(timeDiv).toHaveLength(1);
          const time = timeDiv.find(TimeRange);
          expect(time).toHaveLength(1);
          expect(time.prop('begin')).toBe(ReservationWithOrder.begin);
          expect(time.prop('end')).toBe(ReservationWithOrder.end);
        });

        test('reservation price', () => {
          const price = body.find('p.reservation-price');
          expect(price).toHaveLength(1);
          expect(price.text()).toBe(`common.priceTotalLabel: ${ReservationWithOrder.order.price}€`);
        });

        test('reservation payment notice', () => {
          const notice = body.find('p.reservation-payment-notice');
          expect(notice).toHaveLength(1);
          expect(notice.text()).toBe('ReservationPaymentModal.onlinePaymentNotice');
        });
      });

      describe('children when reservation with order is not given', () => {
        const ReservationWithoutOrder = Reservation.build({ order: undefined });
        const body = getWrapper({ reservation: ReservationWithoutOrder }).find(Modal.Body);

        test('error text', () => {
          const error = body.find('p');
          expect(error).toHaveLength(1);
          expect(error.text()).toBe('Notifications.errorMessage');
        });
      });
    });

    describe('modal footer', () => {
      const footer = getWrapper().find(Modal.Footer);
      test('wrapper component', () => {
        expect(footer).toHaveLength(1);
      });

      describe('children', () => {
        test('back button', () => {
          const button = footer.find(Button);
          expect(button).toHaveLength(1);
          expect(button.prop('bsStyle')).toBe('default');
          expect(button.prop('className')).toBe(defaultProps.fontSize);
          expect(button.prop('onClick')).toBe(defaultProps.actions.closeReservationPaymentModal);
          expect(button.prop('children')).toBe('common.back');
        });

        test('PaymentButton', () => {
          const button = footer.find(PaymentButton);
          expect(button).toHaveLength(1);
          expect(button.prop('fontSize')).toBe(defaultProps.fontSize);
          expect(button.prop('handleUpdateReservation')).toBeDefined();
          expect(button.prop('isSaving')).toBe(defaultProps.isSaving);
          expect(button.prop('paymentUrl')).toBe('');
          expect(button.prop('reservationExists')).toBe(false);
          expect(button.prop('reservationState')).toBe(defaultProps.reservation.state);
        });
      });
    });
  });
});
