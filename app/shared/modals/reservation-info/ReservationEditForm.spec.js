import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import Immutable from 'seamless-immutable';
import { Field, Fields } from 'redux-form';

import Reservation, { UniversalData } from 'utils/fixtures/Reservation';
import Resource, { UniversalField } from 'utils/fixtures/Resource';
import User from 'utils/fixtures/User';
import { shallowWithIntl } from 'utils/testUtils';
import { UnconnectedReservationEditForm as ReservationEditForm } from './ReservationEditForm';
import ReservationOrderInfo from './ReservationOrderInfo';
import constants from '../../../constants/AppConstants';
import { formatDateTime } from '../../../utils/timeUtils';

describe('shared/modals/reservation-info/ReservationEditForm', () => {
  const resource = Resource.build({ universalField: [UniversalField.build()] });
  const reservation = Reservation.build({
    billingAddressCity: 'New York',
    billingAddressStreet: 'Billing Street 11',
    billingAddressZip: '99999',
    company: 'company name',
    reserverId: '112233-123A',
    comments: 'Just some comments.',
    eventDescription: 'Jedi mind tricks',
    eventSubject: 'Jedi Party',
    numberOfParticipants: 12,
    reserverAddressCity: 'Mos Eisley',
    reserverAddressStreet: 'Cantina street 3B',
    reserverAddressZip: '11111',
    reserverEmailAddress: 'luke@sky.com',
    reserverName: 'Luke Skywalker',
    reserverPhoneNumber: '1234567',
    resource: resource.id,
    requireAssistance: undefined,
    requireWorkstation: undefined,
    reservationExtraQuestions: undefined,
    universalData: UniversalData.build(),
  });
  const defaultProps = {
    currentLanguage: 'fi',
    handleSubmit: () => null,
    isAdmin: true,
    isEditing: false,
    isLargerFontSize: false,
    isSaving: false,
    isStaff: false,
    onCancelEditClick: () => null,
    onStartEditClick: () => null,
    reservation: Immutable(reservation),
    reservationIsEditable: false,
    resource: Immutable(resource),
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<ReservationEditForm {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    test('renders a Form component', () => {
      expect(getWrapper().find(Form)).toHaveLength(1);
    });

    describe('reservation data', () => {
      function getData(props) {
        return getWrapper(props).find(Form).html();
      }

      describe('comments', () => {
        test('are not rendered if user is not an admin', () => {
          const props = {
            isAdmin: false,
            reservationIsEditable: false,
          };
          expect(getData(props)).not.toContain(reservation.comments);
        });

        test('are not rendered if reservation is editable', () => {
          const props = {
            isAdmin: true,
            reservationIsEditable: true,
          };
          expect(getData(props)).not.toContain(reservation.comments);
        });

        test('are rendered if user is admin and reservation is not editable', () => {
          const props = {
            isAdmin: true,
            reservationIsEditable: false,
          };
          expect(getData(props)).toContain(reservation.comments);
        });
      });

      test('renders eventDescription', () => {
        expect(getData()).toContain(reservation.eventDescription);
      });

      test('renders eventSubject', () => {
        expect(getData()).toContain(reservation.eventSubject);
      });

      test('renders numberOfParticipants', () => {
        expect(getData()).toContain(reservation.numberOfParticipants);
      });

      test('renders reserverAddressCity', () => {
        expect(getData()).toContain(reservation.reserverAddressCity);
      });

      test('renders reserverAddressStreet', () => {
        expect(getData()).toContain(reservation.reserverAddressStreet);
      });

      test('renders reserverAddressZip', () => {
        expect(getData()).toContain(reservation.reserverAddressZip);
      });

      test('renders reserverEmailAddress', () => {
        expect(getData()).toContain(reservation.reserverEmailAddress);
      });

      test('renders company', () => {
        expect(getData()).toContain(reservation.company);
      });

      describe('reserverId', () => {
        test('is rendered if user has staff rights', () => {
          expect(getData({ isStaff: true })).toContain(reservation.reserverId);
        });

        test('is not rendered if user does not have staff rights', () => {
          expect(getData({ isStaff: false })).not.toContain(reservation.reserverId);
        });
      });

      test('renders reserverName', () => {
        expect(getData()).toContain(reservation.reserverName);
      });

      describe('customer group', () => {
        test('when reservation order has customer group name', () => {
          const order = { customerGroupName: { fi: 'name-fi', en: 'name-en', sv: 'name-sv' } };
          const reservationA = Reservation.build({ order });
          const cgName = order.customerGroupName[defaultProps.currentLanguage];
          const data = getData({ reservation: reservationA });
          expect(data).toContain('common.customerGroup');
          expect(data).toContain(cgName);
        });

        test('when reservation order has no customer group name', () => {
          const order = 'test-id';
          const reservationA = Reservation.build({ order });
          expect(getData({ reservation: reservationA })).not.toContain('common.customerGroup');
        });

        test('when reservation has no order', () => {
          const order = undefined;
          const reservationA = Reservation.build({ order });
          expect(getData({ reservation: reservationA })).not.toContain('common.customerGroup');
        });
      });

      test('renders reserverPhoneNumber', () => {
        expect(getData()).toContain(reservation.reserverPhoneNumber);
      });

      describe('user name and email', () => {
        const user = User.build({
          displayName: 'display name',
          email: 'some@email.com',
        });
        const userReservation = Reservation.build({
          reserverName: null,
          reserverEmailAddress: null,
          user,
        });
        describe('when user is staff', () => {
          const isStaff = true;
          test('renders reservation user name when reserverName is empty', () => {
            expect(getData({ reservation: userReservation, isStaff })).toContain(user.displayName);
          });

          test('renders reservation user email when reserverEmailAddress is empty', () => {
            expect(getData({ reservation: userReservation, isStaff })).toContain(user.email);
          });
        });
        describe('when user is not staff', () => {
          const isStaff = false;
          test('does not render reservation user name when reserverName is empty', () => {
            expect(getData({ reservation: userReservation, isStaff }))
              .not.toContain(user.displayName);
          });

          test('does not render reservation user email when reserverEmailAddress is empty', () => {
            expect(getData({ reservation: userReservation, isStaff })).not.toContain(user.email);
          });
        });
      });

      describe('reservation type', () => {
        const reservationA = Reservation.build(
          { type: constants.RESERVATION_TYPE.BLOCKED_VALUE }
        );
        const reservationB = Reservation.build(
          { type: constants.RESERVATION_TYPE.NORMAL_VALUE }
        );

        describe('when user is staff', () => {
          const isStaff = true;

          test('renders reservation type correctly', () => {
            expect(getData({ reservation: reservationA, isStaff })).toContain('ReservationType.blocked');
            expect(getData({ reservation: reservationB, isStaff })).toContain('ReservationType.normal');
          });
        });

        describe('when user is not staff', () => {
          const isStaff = false;

          test('does not render reservation type', () => {
            expect(getData({ reservation: reservationA, isStaff })).not.toContain('ReservationType.blocked');
            expect(getData({ reservation: reservationB, isStaff })).not.toContain('ReservationType.normal');
          });
        });
      });

      describe('reservation created at', () => {
        const reservationA = Reservation.build({ createdAt: '2023-11-20T15:00:00' });
        const reservationB = Reservation.build();

        describe('when user is staff', () => {
          const isStaff = true;

          test('is not rendered when created at is not included in reservation', () => {
            expect(getData({ reservation: reservationB, isStaff })).not.toContain('common.reservationCreatedAt');
          });
          test('is rendered when created at is included in reservation', () => {
            expect(getData({ reservation: reservationA, isStaff })).toContain('common.reservationCreatedAt');
            expect(getData({ reservation: reservationA, isStaff })).toContain(formatDateTime(reservationA.createdAt, 'LLLL'));
          });
        });

        describe('when user is not staff', () => {
          const isStaff = false;

          test('is not rendered', () => {
            expect(getData({ reservation: reservationB, isStaff })).not.toContain('common.reservationCreatedAt');
            expect(getData({ reservation: reservationA, isStaff })).not.toContain('common.reservationCreatedAt');
          });
        });
      });

      describe('requires assistance', () => {
        test('is rendered if reservation supports it', () => {
          const userReservation = Reservation.build({
            requireAssistance: false
          });
          expect(getData({ reservation: userReservation })).toContain('common.requireAssistanceLabel');
        });

        test('is not rendered if reservation doesnt support it', () => {
          const userReservation = Reservation.build({
            requireAssistance: undefined
          });
          expect(getData({ reservation: userReservation })).not.toContain('common.requireAssistanceLabel');
        });
      });

      describe('requires workstation', () => {
        test('is rendered if reservation supports it', () => {
          const userReservation = Reservation.build({
            requireWorkstation: false
          });
          expect(getData({ reservation: userReservation })).toContain('common.requireWorkstationLabel');
        });

        test('is not rendered if reservation doesnt support it', () => {
          const userReservation = Reservation.build({
            requireWorkstation: undefined
          });
          expect(getData({ reservation: userReservation })).not.toContain('common.requireWorkstationLabel');
        });
      });

      describe('private event', () => {
        test('is rendered if reservation supports it', () => {
          const userReservation = Reservation.build({
            privateEvent: false
          });
          expect(getData({ reservation: userReservation })).toContain('common.privateEventLabel');
        });

        test('is not rendered if reservation doesnt support it', () => {
          const userReservation = Reservation.build({
            privateEvent: undefined
          });
          expect(getData({ reservation: userReservation })).not.toContain('common.privateEventLabel');
        });
      });

      describe('reservation extra questions', () => {
        test('is rendered if reservation supports it', () => {
          const userReservation = Reservation.build({
            reservationExtraQuestions: 'extra question string'
          });
          expect(getData({ reservation: userReservation }))
            .toContain('common.additionalInfo.label');
        });
        test('is not rendered if reservation doesnt support it', () => {
          expect(getData()).not.toContain('common.additionalInfo.label');
        });
      });

      describe('home municipality', () => {
        test('is rendered if reservation supports it', () => {
          const userReservation = Reservation.build({
            homeMunicipality: 'test'
          });
          expect(getData({ reservation: userReservation }))
            .toContain('common.homeMunicipality');
        });
        test('is not rendered if reservation doesnt support it', () => {
          expect(getData()).not.toContain('common.homeMunicipality');
        });
      });

      describe('ReservationOrderInfo', () => {
        test('when reservation has order with price info', () => {
          const userReservation = Reservation.build({
            order: {
              orderLines: [{
                product: {
                  price: { amount: '3.50', period: '01:00:00', type: 'per_period' },
                  quantity: 1,
                  type: 'rent'
                }
              }],
              price: '3.50'
            }
          });

          const wrapper = getWrapper({ reservation: userReservation });
          const instance = wrapper.instance();
          const orderInfo = wrapper.find(ReservationOrderInfo);
          expect(orderInfo).toHaveLength(1);
          expect(orderInfo.prop('currentLanguage')).toBe(defaultProps.currentLanguage);
          expect(orderInfo.prop('order')).toBe(userReservation.order);
          expect(orderInfo.prop('renderHeading')).toBe(instance.renderHeading);
          expect(orderInfo.prop('renderInfoRow')).toBe(instance.renderInfoRow);
        });

        describe('when reservation does not have an order', () => {
          const userReservation = Reservation.build({ order: null });
          test('ReservationOrderInfo is not rendered', () => {
            const orderInfo = getWrapper({ reservation: userReservation })
              .find(ReservationOrderInfo);
            expect(orderInfo).toHaveLength(0);
          });
        });
      });
      describe('Reservation UniversalData', () => {
        describe('is rendered if it exists', () => {
          test('label is correct', () => {
            expect(getData()).toContain(reservation.universalData.field.label);
          });
          test('selected option text is correct', () => {
            const expectedText = reservation.universalData.field.options
              .find(
                option => option.id === Number
                  .parseInt(reservation.universalData.selectedOption, 10)
              ).text;
            expect(getData()).toContain(expectedText);
            expect(getData()).toEqual(expect.stringContaining(expectedText));
          });
        });
        describe('is not rendered if it doesnt exist', () => {
          test('label and selected option text is not rendered', () => {
            const plainReservation = Reservation.build();
            const plainResource = Resource.build();
            const plainData = getData({ reservation: plainReservation, resource: plainResource });
            const { reservation: defaultReservation } = defaultProps;
            expect(plainData).not.toContain(defaultReservation.universalData.field.label);
            const textValues = defaultReservation.universalData.field.options.map(opt => opt.text);
            expect(plainData).toEqual(expect.not.stringContaining(textValues[0]));
          });
        });
      });
    });

    describe('form fields', () => {
      describe('when editing', () => {
        function getFormField(name) {
          return getWrapper({ isEditing: true }).find(Field).filter({ name });
        }

        test('renders a text field for eventSubject', () => {
          const field = getFormField('eventSubject');
          expect(field).toHaveLength(1);
          expect(field.prop('type')).toBe('text');
        });

        test('renders a textarea field for eventDescription', () => {
          const field = getFormField('eventDescription');
          expect(field).toHaveLength(1);
          expect(field.prop('type')).toBe('textarea');
          expect(field.prop('controlProps')).toEqual({ maxLength: '256' });
        });

        test('renders a number field for numberOfParticipants', () => {
          const field = getFormField('numberOfParticipants');
          expect(field).toHaveLength(1);
          expect(field.prop('type')).toBe('number');
        });

        test('renders ReservationTimeControls', () => {
          const timeControls = getWrapper({ isEditing: true })
            .find(Fields)
            .filter({ names: ['begin', 'end'] });
          expect(timeControls).toHaveLength(1);
        });
      });

      describe('when not editing', () => {
        test('does not render any form fields', () => {
          expect(getWrapper({ isEditing: false }).find(Field)).toHaveLength(0);
          expect(getWrapper({ isEditing: false }).find(Fields)).toHaveLength(0);
        });
      });
    });

    describe('form controls', () => {
      function getFormControls(props) {
        return getWrapper(props).find('.form-controls');
      }

      test('are not rendered if user is not an admin', () => {
        const props = {
          isAdmin: false,
          reservationIsEditable: true,
        };
        expect(getFormControls(props)).toHaveLength(0);
      });

      test('are not rendered if reservation is not editable', () => {
        const props = {
          isAdmin: true,
          reservationIsEditable: false,
        };
        expect(getFormControls(props)).toHaveLength(0);
      });

      test('are rendered if user is admin and reservation is editable', () => {
        const props = {
          isAdmin: true,
          reservationIsEditable: true,
        };
        expect(getFormControls(props)).toHaveLength(1);
      });

      describe('edit button', () => {
        function getEditButton(props) {
          const onStartEditClick = () => null;
          const defaults = {
            isAdmin: true,
            onStartEditClick,
            reservationIsEditable: true,
          };
          const wrapper = getFormControls({ ...defaults, ...props });
          return wrapper.find(Button).filter({ onClick: onStartEditClick });
        }

        test('is rendered if isEditing is false', () => {
          expect(getEditButton({ isEditing: false })).toHaveLength(1);
        });

        test('is not rendered if isEditing is true', () => {
          expect(getEditButton({ isEditing: true })).toHaveLength(0);
        });
      });

      describe('cancel button', () => {
        function getEditButton(props) {
          const onCancelEditClick = () => null;
          const defaults = {
            isAdmin: true,
            onCancelEditClick,
            reservationIsEditable: true,
          };
          const wrapper = getFormControls({ ...defaults, ...props });
          return wrapper.find(Button).filter({ onClick: onCancelEditClick });
        }

        test('is rendered if isEditing is true', () => {
          expect(getEditButton({ isEditing: true })).toHaveLength(1);
        });

        test('is not rendered if isEditing is false', () => {
          expect(getEditButton({ isEditing: false })).toHaveLength(0);
        });
      });

      describe('save button', () => {
        function getSaveButton(props) {
          const defaults = {
            isAdmin: true,
            reservationIsEditable: true,
          };
          const wrapper = getFormControls({ ...defaults, ...props });
          return wrapper.find(Button).filter({ type: 'submit' });
        }

        test('is rendered if isEditing is true', () => {
          expect(getSaveButton({ isEditing: true })).toHaveLength(1);
        });

        test('is not rendered if isEditing is false', () => {
          expect(getSaveButton({ isEditing: false })).toHaveLength(0);
        });
      });
    });
  });
});
