import { shallow } from 'enzyme';
import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import ConfirmReservationModal from './ConfirmReservationModal';
import {
  UnconnectedReservationConfirmationContainer as ReservationConfirmationContainer,
} from './ReservationConfirmationContainer';
import constants from '../../constants/AppConstants';

describe('pages/resource/reservation-calendar/ReservationConfirmationContainer', () => {
  const resource = Resource.build({ needManualConfirmation: false });
  const defaultProps = {
    actions: {
      cancelReservationEdit: simple.stub(),
      closeConfirmReservationModal: simple.stub(),
      deleteReservation: simple.stub(),
      openConfirmReservationModal: simple.stub(),
      postReservation: simple.stub(),
      postRecurringReservations: simple.stub(),
      putReservation: simple.stub(),
      removeReservation: simple.stub(),
    },
    confirmReservationModalIsOpen: false,
    currentLanguage: 'fi',
    isMakingReservations: false,
    isStaff: false,
    params: { id: resource.id },
    recurringReservations: [Reservation.build()],
    reservationsToEdit: [],
    resource: Immutable(resource),
    selectedReservations: Immutable([
      Reservation.build(),
      Reservation.build(),
    ]),
    reservationType: constants.RESERVATION_TYPE.NORMAL_VALUE,
  };

  function getWrapper(extraProps) {
    return shallow(<ReservationConfirmationContainer {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    describe('ConfirmReservationModal', () => {
      test('is rendered', () => {
        const modal = getWrapper().find(ConfirmReservationModal);

        expect(modal.length).toBe(1);
      });

      test('gets correct props', () => {
        const wrapper = getWrapper();
        const actualProps = wrapper.find(ConfirmReservationModal).props();

        expect(actualProps.isEditing).toBeDefined();
        expect(actualProps.isMakingReservations).toBe(defaultProps.isMakingReservations);
        expect(actualProps.isPreliminaryReservation)
          .toBe(defaultProps.resource.needManualConfirmation);
        expect(actualProps.isStaff).toBeDefined();
        expect(actualProps.onCancel).toBe(defaultProps.actions.cancelReservationEdit);
        expect(actualProps.onClose).toBe(defaultProps.actions.closeConfirmReservationModal);
        expect(actualProps.onConfirm).toBe(wrapper.instance().handleReservation);
        expect(actualProps.onRemoveReservation).toBe(defaultProps.actions.removeReservation);
        expect(actualProps.recurringReservations).toEqual(defaultProps.recurringReservations);
        expect(actualProps.reservationsToEdit).toEqual(defaultProps.reservationsToEdit);
        expect(actualProps.selectedReservations).toEqual(defaultProps.selectedReservations);
        expect(actualProps.show).toBe(defaultProps.confirmReservationModalIsOpen);
        expect(actualProps.reservationType).toBe(defaultProps.reservationType);
      });
    });
  });

  describe('handleEdit', () => {
    test('edits the selected reservation', () => {
      const reservationsToEdit = [Reservation.build({ comments: 'some comment' })];
      const instance = getWrapper({ reservationsToEdit }).instance();
      const newValues = { begin: 'foo', end: 'bar', comments: '' };
      instance.handleEdit(newValues);
      const expectedArgs = [{ ...reservationsToEdit[0], ...newValues, comments: '-' }];
      expect(defaultProps.actions.putReservation.callCount).toBe(1);
      expect(defaultProps.actions.putReservation.lastCall.args).toEqual(expectedArgs);
    });
  });

  describe('handleReservation', () => {
    describe('when no recurringReservations', () => {
      const selectedReservations = [
        Reservation.build({
          begin: '2018-01-30T13:00:00+02:00',
          end: '2018-01-30T13:30:00+02:00',
          resource: resource.id,
          preferredLanguage: defaultProps.currentLanguage,
        }),
      ];

      const recurringReservations = [];
      const instance = getWrapper({ recurringReservations, selectedReservations }).instance();
      const values = { comment: 'this is an added vlaue' };
      beforeAll(() => {
        defaultProps.actions.postReservation.reset();
        defaultProps.actions.postRecurringReservations.reset();
        instance.handleReservation();
      });

      test('postReservation is called', () => {
        expect(defaultProps.actions.postReservation.callCount).toBe(1);
      });

      test('postRecurringReservations is not called', () => {
        expect(defaultProps.actions.postRecurringReservations.callCount).toBe(0);
      });

      test('postReservation called with correct props', () => {
        const args = defaultProps.actions.postReservation.lastCall.args;
        expect(args[0]).toEqual(selectedReservations[0]);
      });

      test('adds added values to the reservation', () => {
        instance.handleReservation(values);
        const args = defaultProps.actions.postReservation.lastCall.args;
        expect(args[0].comment).toBe(values.comment);
      });
    });
    describe('when recurringReservations.length > 0', () => {
      const recurringReservations = [
        Reservation.build({
          begin: '2018-01-29T13:00:00+02:00',
          end: '2018-01-29T13:30:00+02:00',

        }),
        Reservation.build({
          begin: '2018-01-30T13:00:00+02:00',
          end: '2018-01-30T13:30:00+02:00',

        }),
        Reservation.build({
          begin: '2018-01-31T13:00:00+02:00',
          end: '2018-01-31T13:30:00+02:00',

        }),
      ];
      const selectedReservations = [
        Reservation.build({
          begin: '2018-01-28T13:00:00+02:00',
          end: '2018-01-28T13:30:00+02:00',
          resource: resource.id,
          preferredLanguage: defaultProps.currentLanguage,
        }),
      ];
      const instance = getWrapper({ recurringReservations, selectedReservations }).instance();
      const values = { additional_info: 'this is very important' };
      beforeAll(() => {
        defaultProps.actions.postReservation.reset();
        defaultProps.actions.postRecurringReservations.reset();
        instance.handleReservation();
      });

      test('postRecurringReservations is called', () => {
        expect(defaultProps.actions.postRecurringReservations.callCount).toBe(1);
      });

      test('postReservation is not called', () => {
        expect(defaultProps.actions.postReservation.callCount).toBe(0);
      });

      test('postRecurringReservations is called with correct props', () => {
        const args = defaultProps.actions.postRecurringReservations.lastCall.args;
        const reservationStack = [...selectedReservations, ...recurringReservations];
        expect(args[0]).toStrictEqual({
          reservationStack,
          resource: resource.id,
          preferredLanguage: defaultProps.currentLanguage,
        });
      });

      test('postRecurringReservations adds added values to reservations', () => {
        instance.handleReservation(values);
        const args = defaultProps.actions.postRecurringReservations.lastCall.args;
        const reservationStack = [...selectedReservations, ...recurringReservations];
        expect(args[0]).toStrictEqual({
          reservationStack,
          ...values,
          resource: resource.id,
          preferredLanguage: defaultProps.currentLanguage,
        });
      });
    });
  });
});
