import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Reservation from 'utils/fixtures/Reservation';
import { makeButtonTests, shallowWithIntl } from 'utils/testUtils';
import constants from '../../constants/AppConstants';
import ReservationControls from './ReservationControls';

describe('shared/reservation-controls/ReservationControls', () => {
  const onCancelClick = simple.stub();
  const onConfirmClick = simple.stub();
  const onDenyClick = simple.stub();
  const onEditClick = simple.stub();
  const onInfoClick = simple.stub();
  const onPayClick = simple.stub();

  function getWrapper(reservation, isAdmin = false, paymentUrlData = {}) {
    const props = {
      isAdmin,
      onCancelClick,
      onConfirmClick,
      onDenyClick,
      onEditClick,
      onInfoClick,
      onPayClick,
      reservation: Immutable(reservation),
      paymentUrlData,
    };
    return shallowWithIntl(<ReservationControls {...props} />);
  }

  describe('if user is an admin', () => {
    const isAdmin = true;

    describe('with regular reservation', () => {
      describe('without reservation user permissions', () => {
        const userPermissions = {};
        const reservation = Reservation.build({ needManualConfirmation: false, state: 'confirmed', userPermissions });
        const buttons = getWrapper(reservation, isAdmin).find(Button);

        test('renders two buttons', () => {
          expect(buttons.length).toBe(2);
        });
        describe('the first button', () => {
          makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
        });
        describe('the 2nd button', () => {
          makeButtonTests(buttons.at(1), 'cancel', 'ReservationControls.cancel', onCancelClick);
        });
      });

      describe('with reservation user permission canModify', () => {
        const userPermissions = { canModify: true };
        const reservation = Reservation.build({ needManualConfirmation: false, state: 'confirmed', userPermissions });
        const buttons = getWrapper(reservation, isAdmin).find(Button);

        test('renders three buttons', () => {
          expect(buttons.length).toBe(3);
        });
        describe('the first button', () => {
          makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
        });
        describe('the second button', () => {
          makeButtonTests(buttons.at(1), 'edit', 'ReservationControls.edit', onEditClick);
        });
        describe('the 3rd button', () => {
          makeButtonTests(buttons.at(2), 'cancel', 'ReservationControls.cancel', onCancelClick);
        });
      });

      describe('with reservation user permission canDelete', () => {
        const userPermissions = { canDelete: true };
        const reservation = Reservation.build({ needManualConfirmation: false, state: 'confirmed', userPermissions });
        const buttons = getWrapper(reservation, isAdmin).find(Button);

        test('renders two buttons', () => {
          expect(buttons.length).toBe(2);
        });
        describe('the first button', () => {
          makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
        });
        describe('the second button', () => {
          makeButtonTests(buttons.at(1), 'cancel', 'ReservationControls.cancel', onCancelClick);
        });
      });

      describe('with reservation user permissions canModify and canDelete', () => {
        const userPermissions = { canModify: true, canDelete: true };
        const reservation = Reservation.build({ needManualConfirmation: false, state: 'confirmed', userPermissions });
        const buttons = getWrapper(reservation, isAdmin).find(Button);

        test('renders three buttons', () => {
          expect(buttons.length).toBe(3);
        });
        describe('the first button', () => {
          makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
        });
        describe('the second button', () => {
          makeButtonTests(buttons.at(1), 'edit', 'ReservationControls.edit', onEditClick);
        });
        describe('the third button', () => {
          makeButtonTests(buttons.at(2), 'cancel', 'ReservationControls.cancel', onCancelClick);
        });
      });
    });

    describe('with preliminary reservation in cancelled state', () => {
      const reservation = Reservation.build({ needManualConfirmation: true, state: 'cancelled' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      test('renders one button', () => {
        expect(buttons.length).toBe(1);
      });

      describe('the button', () => {
        makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
      });
    });

    describe('with preliminary reservation in denied state', () => {
      const reservation = Reservation.build({ needManualConfirmation: true, state: 'denied' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      test('renders one button', () => {
        expect(buttons.length).toBe(1);
      });

      describe('the button', () => {
        makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
      });
    });

    describe('with preliminary reservation in confirmed state', () => {
      describe('if user has can modify reservation permission', () => {
        const userPermissions = { canModify: true };
        const reservation = Reservation.build({
          needManualConfirmation: true,
          state: 'confirmed',
          userPermissions
        });
        const buttons = getWrapper(reservation, isAdmin).find(Button);

        test('renders three buttons', () => {
          expect(buttons.length).toBe(3);
        });

        describe('the first button', () => {
          makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
        });

        describe('the second button', () => {
          makeButtonTests(buttons.at(1), 'edit', 'ReservationControls.edit', onEditClick);
        });

        describe('the third button', () => {
          makeButtonTests(buttons.at(2), 'cancel', 'ReservationControls.cancel', onCancelClick);
        });
      });

      describe('if user does not have can modify reservation permission', () => {
        const userPermissions = { canModify: false };
        const reservation = Reservation.build({
          needManualConfirmation: true,
          state: 'confirmed',
          userPermissions
        });
        const buttons = getWrapper(reservation, isAdmin).find(Button);

        test('renders two buttons', () => {
          expect(buttons.length).toBe(2);
        });

        describe('the first button', () => {
          makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
        });

        describe('the second button', () => {
          makeButtonTests(buttons.at(1), 'cancel', 'ReservationControls.cancel', onCancelClick);
        });
      });
    });
  });

  describe('if user is not an admin', () => {
    const isAdmin = false;

    describe('with regular reservation', () => {
      describe('without reservation user permissions', () => {
        const userPermissions = {};
        const reservation = Reservation.build({ needManualConfirmation: false, state: 'confirmed', userPermissions });
        const buttons = getWrapper(reservation, isAdmin).find(Button);

        test('renders two buttons', () => {
          expect(buttons.length).toBe(2);
        });
        describe('the first button', () => {
          makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
        });
        describe('the 2nd button', () => {
          makeButtonTests(buttons.at(1), 'cancel', 'ReservationControls.cancel', onCancelClick);
        });
      });

      describe('with reservation user permission canModify', () => {
        const userPermissions = { canModify: true };
        const reservation = Reservation.build({ needManualConfirmation: false, state: 'confirmed', userPermissions });
        const buttons = getWrapper(reservation, isAdmin).find(Button);

        test('renders two buttons', () => {
          expect(buttons.length).toBe(3);
        });
        describe('the first button', () => {
          makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
        });
        describe('the second button', () => {
          makeButtonTests(buttons.at(1), 'edit', 'ReservationControls.edit', onEditClick);
        });
        describe('the 3rd button', () => {
          makeButtonTests(buttons.at(2), 'cancel', 'ReservationControls.cancel', onCancelClick);
        });
      });

      describe('with reservation user permission canDelete', () => {
        const userPermissions = { canDelete: true };
        const reservation = Reservation.build({ needManualConfirmation: false, state: 'confirmed', userPermissions });
        const buttons = getWrapper(reservation, isAdmin).find(Button);

        test('renders two buttons', () => {
          expect(buttons.length).toBe(2);
        });
        describe('the first button', () => {
          makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
        });
        describe('the second button', () => {
          makeButtonTests(buttons.at(1), 'cancel', 'ReservationControls.cancel', onCancelClick);
        });
      });

      describe('with reservation user permissions canModify and canDelete', () => {
        const userPermissions = { canModify: true, canDelete: true };
        const reservation = Reservation.build({ needManualConfirmation: false, state: 'confirmed', userPermissions });
        const buttons = getWrapper(reservation, isAdmin).find(Button);

        test('renders three buttons', () => {
          expect(buttons.length).toBe(3);
        });
        describe('the first button', () => {
          makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
        });
        describe('the second button', () => {
          makeButtonTests(buttons.at(1), 'edit', 'ReservationControls.edit', onEditClick);
        });
        describe('the third button', () => {
          makeButtonTests(buttons.at(2), 'cancel', 'ReservationControls.cancel', onCancelClick);
        });
      });
    });

    describe('with preliminary reservation in requested state', () => {
      const reservation = Reservation.build({ needManualConfirmation: true, state: 'requested' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      test('renders three buttons', () => {
        expect(buttons.length).toBe(3);
      });

      describe('the first button', () => {
        makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
      });

      describe('the second button', () => {
        makeButtonTests(buttons.at(1), 'edit', 'ReservationControls.edit', onEditClick);
      });

      describe('the third button', () => {
        makeButtonTests(buttons.at(2), 'cancel', 'ReservationControls.cancel', onCancelClick);
      });
    });

    describe('with preliminary reservation in cancelled state', () => {
      const reservation = Reservation.build({ needManualConfirmation: true, state: 'cancelled' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      test('renders one button', () => {
        expect(buttons.length).toBe(1);
      });

      describe('the button', () => {
        makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
      });
    });

    describe('with preliminary reservation in denied state', () => {
      const reservation = Reservation.build({ needManualConfirmation: true, state: 'denied' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      test('renders one button', () => {
        expect(buttons.length).toBe(1);
      });

      describe('the button', () => {
        makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
      });
    });

    describe('with preliminary reservation in confirmed state', () => {
      const reservation = Reservation.build({ needManualConfirmation: true, state: 'confirmed' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      test('renders two buttons', () => {
        expect(buttons.length).toBe(2);
      });

      describe('the first button', () => {
        makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
      });

      describe('the second button', () => {
        makeButtonTests(buttons.at(1), 'cancel', 'ReservationControls.cancel', onCancelClick);
      });
    });

    describe('with preliminary reservation in ready for payment state', () => {
      const reservation = Reservation.build({
        needManualConfirmation: true,
        state: constants.RESERVATION_STATE.READY_FOR_PAYMENT
      });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      test('renders three buttons', () => {
        expect(buttons.length).toBe(3);
      });

      describe('the first button', () => {
        makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
      });

      describe('the second button', () => {
        makeButtonTests(buttons.at(1), 'pay', 'ReservationControls.pay', onPayClick);
      });

      describe('the third button', () => {
        makeButtonTests(buttons.at(2), 'cancel', 'ReservationControls.cancel', onCancelClick);
      });
    });

    describe('with preliminary reservation in waiting for payment state', () => {
      const reservation = Reservation.build({
        needManualConfirmation: true,
        state: constants.RESERVATION_STATE.WAITING_FOR_PAYMENT
      });

      describe('when paymentUrlData is defined and its reservation id matches given reservation id', () => {
        const paymentUrlData = { paymentUrl: 'https://google.fi', reservationId: reservation.id };
        const buttons = getWrapper(reservation, isAdmin, paymentUrlData).find(Button);
        test('renders three buttons', () => {
          expect(buttons.length).toBe(3);
        });

        describe('the first button', () => {
          makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
        });

        describe('the second button', () => {
          makeButtonTests(buttons.at(1), 'pay', 'ReservationControls.pay', onPayClick);
        });

        describe('the 3rd button', () => {
          makeButtonTests(buttons.at(2), 'cancel', 'ReservationControls.cancel', onCancelClick);
        });
      });

      describe('when paymentUrlData is not defined', () => {
        const buttons = getWrapper(reservation, isAdmin).find(Button);
        test('renders one button', () => {
          expect(buttons.length).toBe(1);
        });

        describe('the first button', () => {
          makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
        });
      });
    });

    describe('with preliminary reservation in waiting for cash payment state', () => {
      describe('when user can modify', () => {
        const userPermissions = { canModify: true, canDelete: true };
        const reservation = Reservation.build({
          needManualConfirmation: true,
          state: constants.RESERVATION_STATE.WAITING_FOR_CASH_PAYMENT,
          userPermissions
        });
        const buttons = getWrapper(reservation, isAdmin).find(Button);

        test('renders three buttons', () => {
          expect(buttons.length).toBe(3);
        });

        describe('the first button', () => {
          makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
        });

        describe('the second button', () => {
          makeButtonTests(buttons.at(1), 'edit', 'ReservationControls.edit', onEditClick);
        });

        describe('the third button', () => {
          makeButtonTests(buttons.at(2), 'cancel', 'ReservationControls.cancel', onCancelClick);
        });
      });

      describe('when user can not modify', () => {
        const userPermissions = { canModify: false, canDelete: false };
        const reservation = Reservation.build({
          needManualConfirmation: true,
          state: constants.RESERVATION_STATE.WAITING_FOR_CASH_PAYMENT,
          userPermissions
        });
        const buttons = getWrapper(reservation, isAdmin).find(Button);

        test('renders two buttons', () => {
          expect(buttons.length).toBe(2);
        });

        describe('the first button', () => {
          makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
        });

        describe('the second button', () => {
          makeButtonTests(buttons.at(1), 'cancel', 'ReservationControls.cancel', onCancelClick);
        });
      });
    });
  });
});
