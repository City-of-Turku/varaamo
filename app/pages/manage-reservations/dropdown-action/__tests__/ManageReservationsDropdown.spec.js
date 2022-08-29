import constants from 'constants/AppConstants';

import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

import { shallowWithIntl } from 'utils/testUtils';
import Reservation from '../../../../utils/fixtures/Reservation';
import ManageReservationsDropdown from '../ManageReservationsDropdown';

describe('ManageReservationsDropdown', () => {
  const defaultProps = {
    onInfoClick: jest.fn(),
    reservation: Reservation.build(),
    onEditClick: jest.fn(),
    onEditReservation: jest.fn(),
    userCanCancel: false,
    userCanModify: false,
  };

  function getWrapper(props) {
    return shallowWithIntl(<ManageReservationsDropdown {...defaultProps} {...props} />);
  }

  describe('renders', () => {
    test('wrapping div', () => {
      const wrapper = getWrapper().find('.app-ManageReservationDropdown');
      expect(wrapper).toHaveLength(1);
    });

    test('DropdownButton', () => {
      const button = getWrapper().find(DropdownButton);
      expect(button).toHaveLength(1);
      expect(button.prop('id')).toBe(`ManageReservationDropdown-${defaultProps.reservation.id}`);
      expect(button.prop('pullRight')).toBe(true);
      expect(button.prop('title')).toBe('ManageReservationsList.actionsHeader');
    });

    describe('MenuItems', () => {
      describe('when userCanModify and userCanCancel are false', () => {
        test('only info MenuItem', () => {
          const userCanModify = false;
          const userCanCancel = false;
          const menuItem = getWrapper({ userCanModify, userCanCancel }).find(MenuItem);
          expect(menuItem).toHaveLength(1);
          expect(menuItem.prop('onClick')).toBe(defaultProps.onInfoClick);
          expect(menuItem.props().children).toBe('ManageReservationsList.actionLabel.information');
        });
      });

      describe('when userCanModify is true and userCanCancel is false', () => {
        const userCanModify = true;
        const userCanCancel = false;
        describe('and isRequestedReservation is true', () => {
          const state = constants.RESERVATION_STATE.REQUESTED;
          const reservation = Reservation.build({ state });
          test('MenuItems info, approve, deny and edit', () => {
            const menuItems = getWrapper(
              { userCanModify, userCanCancel, reservation }
            ).find(MenuItem);
            expect(menuItems).toHaveLength(4);

            expect(menuItems.at(0).prop('onClick')).toBe(defaultProps.onInfoClick);
            expect(menuItems.at(0).props().children).toBe('ManageReservationsList.actionLabel.information');

            expect(menuItems.at(1).prop('onClick')).toBeDefined();
            expect(menuItems.at(1).props().children).toBe('ManageReservationsList.actionLabel.approve');

            expect(menuItems.at(2).prop('onClick')).toBeDefined();
            expect(menuItems.at(2).props().children).toBe('ManageReservationsList.actionLabel.deny');

            expect(menuItems.at(3).prop('onClick')).toBeDefined();
            expect(menuItems.at(3).props().children).toBe('ManageReservationsList.actionLabel.edit');
          });
        });
        describe('and isRequestedReservation is false', () => {
          const state = constants.RESERVATION_STATE.CONFIRMED;
          const reservation = Reservation.build({ state });
          test('MenuItems info and edit', () => {
            const menuItems = getWrapper(
              { userCanModify, userCanCancel, reservation }
            ).find(MenuItem);
            expect(menuItems).toHaveLength(2);

            expect(menuItems.at(0).prop('onClick')).toBe(defaultProps.onInfoClick);
            expect(menuItems.at(0).props().children).toBe('ManageReservationsList.actionLabel.information');

            expect(menuItems.at(1).prop('onClick')).toBeDefined();
            expect(menuItems.at(1).props().children).toBe('ManageReservationsList.actionLabel.edit');
          });
        });
        describe('and isWaitingForCashPayment is true', () => {
          const state = constants.RESERVATION_STATE.WAITING_FOR_CASH_PAYMENT;
          const reservation = Reservation.build({ state });
          test('MenuItem info, confirmCashPayment and edit', () => {
            const menuItems = getWrapper(
              { userCanModify, userCanCancel, reservation }
            ).find(MenuItem);
            expect(menuItems).toHaveLength(3);

            expect(menuItems.at(0).prop('onClick')).toBe(defaultProps.onInfoClick);
            expect(menuItems.at(0).props().children).toBe('ManageReservationsList.actionLabel.information');

            expect(menuItems.at(1).prop('onClick')).toBeDefined();
            expect(menuItems.at(1).props().children).toBe('common.confirmCashPayment');

            expect(menuItems.at(2).prop('onClick')).toBeDefined();
            expect(menuItems.at(2).props().children).toBe('ManageReservationsList.actionLabel.edit');
          });
        });
        describe('and isWaitingForCashPayment is false', () => {
          const state = constants.RESERVATION_STATE.CONFIRMED;
          const reservation = Reservation.build({ state });
          test('MenuItem info, confirmCashPayment and edit', () => {
            const menuItems = getWrapper(
              { userCanModify, userCanCancel, reservation }
            ).find(MenuItem);
            expect(menuItems).toHaveLength(2);

            expect(menuItems.at(0).prop('onClick')).toBe(defaultProps.onInfoClick);
            expect(menuItems.at(0).props().children).toBe('ManageReservationsList.actionLabel.information');

            expect(menuItems.at(1).prop('onClick')).toBeDefined();
            expect(menuItems.at(1).props().children).toBe('ManageReservationsList.actionLabel.edit');
          });
        });
      });
      describe('when userCanModify is false and userCanCancel is true', () => {
        const userCanModify = false;
        const userCanCancel = true;

        test('MenuItems info and cancel', () => {
          const menuItems = getWrapper(
            { userCanModify, userCanCancel }
          ).find(MenuItem);
          expect(menuItems).toHaveLength(2);

          expect(menuItems.at(0).prop('onClick')).toBe(defaultProps.onInfoClick);
          expect(menuItems.at(0).props().children).toBe('ManageReservationsList.actionLabel.information');

          expect(menuItems.at(1).prop('onClick')).toBeDefined();
          expect(menuItems.at(1).props().children).toBe('ManageReservationsList.actionLabel.cancel');
        });
      });
    });
  });
});
