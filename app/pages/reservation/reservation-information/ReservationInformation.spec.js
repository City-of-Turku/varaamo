import constants from 'constants/AppConstants';

import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';
import { camelCase } from 'lodash';

import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import User from 'utils/fixtures/User';
import ProductCustomerGroup from 'utils/fixtures/ProductCustomerGroup';
import CustomerGroup from 'utils/fixtures/CustomerGroup';
import { shallowWithIntl } from 'utils/testUtils';
import { hasPayment } from 'utils/reservationUtils';
import ReservationInformation from './ReservationInformation';
import ReservationInformationForm from './ReservationInformationForm';
import { getPaymentTermsAndConditions } from 'utils/resourceUtils';
import ReservationDetails from '../reservation-details/ReservationDetails';

describe('pages/reservation/reservation-information/ReservationInformation', () => {
  const defaultProps = {
    isAdmin: false,
    isEditing: false,
    isMakingReservations: false,
    isStaff: false,
    currentCustomerGroup: '',
    currentPaymentMethod: '',
    onBack: simple.stub(),
    onCancel: simple.stub(),
    onConfirm: simple.stub(),
    openResourcePaymentTermsModal: simple.stub(),
    openResourceTermsModal: simple.stub(),
    order: {},
    reservation: Immutable(Reservation.build()),
    resource: Immutable(Resource.build()),
    selectedTime: {
      begin: '2016-10-10T10:00:00+03:00',
      end: '2016-10-10T11:00:00+03:00',
    },
    unit: Immutable(Unit.build()),
    user: Immutable(User.build()),
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ReservationInformation {...defaultProps} {...extraProps} />);
  }

  test('renders info texts when needManualConfirmation is true', () => {
    const resource = Resource.build({
      needManualConfirmation: true,
    });
    const infoTexts = getWrapper({ resource }).find('.app-ReservationInformation__info-texts');
    expect(infoTexts).toHaveLength(1);
    expect(infoTexts.text()).toContain('ConfirmReservationModal.priceInfo');
  });

  test('does not render info texts when needManualConfirmation is false', () => {
    const resource = Resource.build({
      needManualConfirmation: false,
    });
    const infoTexts = getWrapper({ resource }).find('.app-ReservationInformation__info-texts');
    expect(infoTexts).toHaveLength(0);
  });

  test('renders an ReservationInformationForm element', () => {
    const resource = Resource.build({
      paymentTerms: { fi: 'testimaksuehdot', en: 'test payment terms' }
    });
    const form = getWrapper({ resource }).find(ReservationInformationForm);
    expect(form).toHaveLength(1);
    expect(form.prop('hasPayment')).toBe(!defaultProps.isEditing && hasPayment(defaultProps.order));
    expect(form.prop('isEditing')).toBe(defaultProps.isEditing);
    expect(form.prop('isMakingReservations')).toBe(defaultProps.isMakingReservations);
    expect(form.prop('onBack')).toBe(defaultProps.onBack);
    expect(form.prop('onCancel')).toBe(defaultProps.onCancel);
    expect(form.prop('openResourcePaymentTermsModal')).toBe(defaultProps.openResourcePaymentTermsModal);
    expect(form.prop('openResourceTermsModal')).toBe(defaultProps.openResourceTermsModal);
    expect(form.prop('paymentTermsAndConditions')).toBe(getPaymentTermsAndConditions(resource));
    expect(form.prop('resource')).toBe(resource);
    expect(form.prop('user')).toBe(defaultProps.user);
  });

  test('renders text header', () => {
    const header = getWrapper().find('.reservationInformation__Header');
    expect(header).toHaveLength(1);
    expect(header.text()).toBe('ReservationPhase.informationTitle');
  });

  test('renders ReservationDetails', () => {
    const cgA = CustomerGroup.build();
    const cgB = CustomerGroup.build();
    const pcgA = ProductCustomerGroup.build({ customerGroup: cgA });
    const pcgB = ProductCustomerGroup.build({ customerGroup: cgB });
    const resource = Resource.build({
      products: [
        { id: 'test1', productCustomerGroups: [pcgA, pcgB] },
        { id: 'test2', productCustomerGroups: [pcgB] }
      ]
    });
    const order = {
      order_lines: [{
        product: {
          price: { amount: '3.50', period: '01:00:00', type: 'per_period' },
          quantity: 1,
          type: 'rent'
        }
      }],
      price: '3.50'
    };
    const currentCustomerGroup = cgB.id;
    const currentPaymentMethod = constants.PAYMENT_METHODS.ONLINE;
    const details = getWrapper({
      currentCustomerGroup, currentPaymentMethod, resource, order
    }).find(ReservationDetails);
    expect(details).toHaveLength(1);
    expect(details.prop('customerGroupName')).toBe(cgB.name);
    expect(details.prop('orderPrice')).toBe(`${order.price} €`);
    expect(details.prop('paymentMethod')).toBe(`common.paymentMethod.${currentPaymentMethod}`);
    expect(details.prop('selectedTime')).toBe(defaultProps.selectedTime);
    expect(details.prop('resourceName')).toBe(resource.name);
    expect(details.prop('unitName')).toBe(defaultProps.unit.name);
  });

  describe('onConfirm', () => {
    test('calls prop onConfirm with correct values', () => {
      const value = 'some value';
      const onConfirm = simple.mock();
      const wrapper = getWrapper({ onConfirm });
      const instance = wrapper.instance();
      instance.onConfirm(value);

      expect(onConfirm.callCount).toBe(1);
      expect(onConfirm.lastCall.args).toEqual([value]);
    });
  });

  describe('getFormFields', () => {
    const resource = Resource.build({
      needManualConfirmation: true,
      supportedReservationExtraFields: ['some_field_1', 'some_field_2'],
    });
    const supportedFields = ['someField1', 'someField2'];

    test('returns supportedReservationExtraFields', () => {
      const wrapper = getWrapper({ resource });
      const instance = wrapper.instance();
      const actual = instance.getFormFields();

      expect(actual).toEqual(supportedFields);
    });

    test(
      'returns supportedReservationExtraFields and admin fields when is admin',
      () => {
        const wrapper = getWrapper({ isAdmin: true, resource });
        const instance = wrapper.instance();
        const actual = instance.getFormFields();
        // const adminFields = ['comments',
        // 'reserverName', 'reserverEmailAddress', 'reserverPhoneNumber'];
        const adminFields = ['comments'];

        expect(actual).toEqual([...supportedFields, ...adminFields]);
      }
    );

    /* Field staffEvent hidden until it is needed again
    test(
      'returns supportedReservationExtraFields and staffEvent when
       needManualConfirmation and is staff',
      () => {
        const wrapper = getWrapper({ isStaff: true, resource });
        const instance = wrapper.instance();
        const actual = instance.getFormFields();

        expect(actual).toEqual([...supportedFields, 'staffEvent']);
      }
    );
    */

    test('returns supportedReservationExtraFields and termsAndConditions', () => {
      const termsAndConditions = 'some terms and conditions';
      const wrapper = getWrapper({ resource });
      const instance = wrapper.instance();
      const actual = instance.getFormFields(termsAndConditions);

      expect(actual).toEqual([...supportedFields, 'termsAndConditions']);
    });

    describe('billing fields', () => {
      const resourceWithBilling = Resource.build({
        needManualConfirmation: true,
        supportedReservationExtraFields: [...constants.RESERVATION_BILLING_FIELDS, 'some_field_1', 'some_field_2'],
      });

      const order = { quantity: 1, price: 3.50, };
      const billingFields = constants.RESERVATION_BILLING_FIELDS.map(value => camelCase(value));

      test('are not returned when reservation has no payment', () => {
        const expectedFields = ['someField1', 'someField2'];
        const wrapper = getWrapper({ resource: resourceWithBilling });
        const instance = wrapper.instance();
        const actual = instance.getFormFields();
        expect(actual).toEqual(expectedFields);
      });

      test('are returned when new reservation has a payment', () => {
        const expectedFields = [...billingFields, 'someField1', 'someField2'];
        const wrapper = getWrapper({ resource: resourceWithBilling, order });
        const instance = wrapper.instance();
        const actual = instance.getFormFields();
        expect(actual).toEqual(expectedFields);
      });

      test('are returned when old reservation has a payment', () => {
        const oldReservation = Reservation.build({ order });
        const expectedFields = [...billingFields, 'someField1', 'someField2'];
        const wrapper = getWrapper({ resource: resourceWithBilling, reservation: oldReservation });
        const instance = wrapper.instance();
        const actual = instance.getFormFields();
        expect(actual).toEqual(expectedFields);
      });
    });
  });

  describe('getFormInitialValues', () => {
    const reservation = Reservation.build({
      someField1: 'some value 1',
      someField2: 'some value 2',
      someField3: null,
      someField4: { id: 'some-id', name: { fi: 'text-fi', en: 'text-en', sv: 'text-sv' } }
    });
    const resource = Resource.build({
      requiredReservationExtraFields: ['some_field_1'],
      supportedReservationExtraFields: ['some_field_1', 'some_field_2', 'some_field_3', 'some_field_4'],
    });

    test('returns correct form values', () => {
      const expected = {
        someField1: 'some value 1',
        someField2: 'some value 2',
        someField4: 'some-id',
      };
      const wrapper = getWrapper({ reservation, resource });
      const instance = wrapper.instance();
      const actual = instance.getFormInitialValues();

      expect(actual).toEqual(expected);
    });

    test('returns staffEvent false when is editing', () => {
      const expected = {
        someField1: 'some value 1',
        someField2: 'some value 2',
        someField4: 'some-id',
        staffEvent: false,
      };
      const wrapper = getWrapper({ isEditing: true, reservation, resource });
      const instance = wrapper.instance();
      const actual = instance.getFormInitialValues();

      expect(actual).toEqual(expected);
    });

    test(
      'returns staffEvent true when is editing and reservation supportedReservationExtraFields are empty but not requiredReservationExtraFields',
      () => {
        const reservation2 = Reservation.build();
        const expected = { staffEvent: true };
        const wrapper = getWrapper({ isEditing: true, reservation: reservation2, resource });
        const instance = wrapper.instance();
        const actual = instance.getFormInitialValues();

        expect(actual).toEqual(expected);
      }
    );

    test('returns InitialValues from user when no reservation', () => {
      const user = User.build({
        displayName: 'First Last',
        email: 'em@il.com',
      });
      const wrapper = getWrapper({ user, reservation: null });
      const instance = wrapper.instance();
      const actual = instance.getFormInitialValues();
      const expectedInfo = {
        reserverName: 'First Last',
        reserverEmailAddress: 'em@il.com'
      };
      expect(instance.props.reservation).toBe(null);
      expect(actual).toEqual(expectedInfo);
    });
  });

  describe('getFormInitialValuesFromUser', () => {
    test('returns object with both values if displayName and email exist', () => {
      const user = User.build({
        displayName: 'Etunimi Sukunimi',
        email: 'sähkö@posti.fi',
      });
      const expected = {
        reserverName: user.displayName,
        reserverEmailAddress: user.email,
      };
      const wrapper = getWrapper({ user });
      const instance = wrapper.instance();
      expect(instance.props.user.displayName).toBeDefined();
      expect(instance.props.user.email).toBeDefined();
      const actual = instance.getFormInitialValuesFromUser();
      expect(actual).toEqual(expected);
    });

    test('returns object with reserverEmailAddress if displayName doesnt exist', () => {
      const user = User.build({
        email: 'sähkö@posti.fi'
      });
      const expected = {
        reserverEmailAddress: user.email
      };
      const wrapper = getWrapper({ user });
      const instance = wrapper.instance();
      expect(instance.props.user.displayName).toBeUndefined();
      expect(instance.props.user.email).toBeDefined();
      const actual = instance.getFormInitialValuesFromUser();
      expect(actual).toEqual(expected);
    });

    test('returns object with reserverName if email doesnt exist', () => {
      const user = User.build({
        displayName: 'Etunimi Sukunimi'
      });
      const expected = {
        reserverName: user.displayName
      };
      const wrapper = getWrapper({ user });
      const instance = wrapper.instance();
      expect(instance.props.user.displayName).toBeDefined();
      expect(instance.props.user.email).toBeUndefined();
      const actual = instance.getFormInitialValuesFromUser();
      expect(actual).toEqual(expected);
    });

    test('returns empty object if displayName and email dont exist', () => {
      const user = User.build({});
      const wrapper = getWrapper({ user });
      const instance = wrapper.instance();
      expect(instance.props.user.displayName).toBeUndefined();
      expect(instance.props.user.email).toBeUndefined();
      const actual = instance.getFormInitialValuesFromUser();
      expect(actual).toEqual({});
    });
  });

  describe('getRequiredFormFields', () => {
    test('returns correct required form fields', () => {
      const resource = Resource.build({
        requiredReservationExtraFields: ['some_field_1', 'some_field_2'],
      });
      const actual = getWrapper().instance().getRequiredFormFields(resource);

      expect(actual).toEqual(['someField1', 'someField2']);
    });

    test('returns required form fields and termsAndConditions', () => {
      const resource = Resource.build({
        requiredReservationExtraFields: ['some_field_1', 'some_field_2'],
      });
      const instance = getWrapper().instance();
      const actual = instance.getRequiredFormFields(resource, 'terms and conditions');

      expect(actual).toEqual(['someField1', 'someField2', 'termsAndConditions']);
    });
  });
});
