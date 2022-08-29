import constants from 'constants/AppConstants';

import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';
import Button from 'react-bootstrap/lib/Button';
import Row from 'react-bootstrap/lib/Row';

import ReservationDate from 'shared/reservation-date';
import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import User from 'utils/fixtures/User';
import { shallowWithIntl } from 'utils/testUtils';
import ReservationConfirmation from './ReservationConfirmation';

describe('pages/reservation/reservation-confirmation/ReservationConfirmation', () => {
  const history = {
    replace: () => {},
  };

  const defaultProps = {
    currentLanguage: 'fi',
    history,
    isEdited: false,
    isLoggedIn: false,
    reservation: Immutable(Reservation.build({ user: User.build() })),
    resource: Immutable(Resource.build()),
    user: Immutable(User.build()),
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ReservationConfirmation {...defaultProps} {...extraProps} />);
  }

  test('renders an Row element', () => {
    expect(getWrapper().find(Row)).toHaveLength(1);
  });

  test('renders correct header when prop isEdited is false', () => {
    const header = getWrapper({ isEdited: false }).find('.app-ReservationPage__header');
    expect(header).toHaveLength(1);
    expect(header.text()).toBe('ReservationConfirmation.reservationCreatedTitle');
  });

  test('renders correct header when prop isEdited is true', () => {
    const header = getWrapper({ isEdited: true }).find('.app-ReservationPage__header');
    expect(header).toHaveLength(1);
    expect(header.text()).toBe('ReservationConfirmation.reservationEditedTitle');
  });

  describe('billing information heading', () => {
    const billingFields = [
      { billingFirstName: 'First' },
      { billingLastName: 'Last' },
      { billingPhoneNumber: '1234567890' },
      { billingEmailAddress: 'test.tester123@testing.fi' },
      { billingAddressStreet: 'street 123' },
      { billingAddressZip: '123456' },
      { billingAddressCity: 'city abc' },
    ];
    test('renders correct heading when any of the billing field props are given', () => {
      billingFields.forEach((billingField) => {
        const reservation = Reservation.build(billingField);
        const header = getWrapper({ reservation }).find('#billingInformationHeader');
        expect(header).toHaveLength(1);
        expect(header.text()).toBe('common.payerInformationLabel');
      });
    });

    test('is not rendered when none of the billing field props are given', () => {
      const header = getWrapper().find('#billingInformationHeader');
      expect(header).toHaveLength(0);
    });
  });

  describe('extra information header', () => {
    test('renders correct header when reservationExtraQuestions prop is given', () => {
      const reservation = Reservation.build({ reservationExtraQuestions: 'Testing text' });
      const header = getWrapper({ reservation }).find('#reservationExtraQuestionsHeader');
      expect(header).toHaveLength(1);
      expect(header.text()).toBe('common.additionalInfo.heading');
    });

    test('renders correct header when reservationExtraQuestions prop is not given', () => {
      const header = getWrapper().find('#reservationExtraQuestionsHeader');
      expect(header).toHaveLength(0);
    });
  });

  test('renders ReservationDate with correct props', () => {
    const reservationDate = getWrapper().find(ReservationDate);
    expect(reservationDate).toHaveLength(1);
    expect(reservationDate.prop('beginDate')).toBe(defaultProps.reservation.begin);
    expect(reservationDate.prop('endDate')).toBe(defaultProps.reservation.end);
  });

  test('renders resource name', () => {
    const name = getWrapper().find('.app-ReservationConfirmation__resource-name');
    expect(name).toHaveLength(1);
    expect(name.text()).toBe(defaultProps.resource.name);
  });

  test('renders resource icon with correct props', () => {
    const resource = getWrapper().find('.app-ReservationConfirmation__resource-name');
    const icon = resource.find('img');
    expect(icon).toHaveLength(1);
    expect(icon.prop('alt')).toBe('');
  });

  test('renders reserverEmailAddress', () => {
    const reserverEmailAddress = 'reserver email address';
    const wrapper = getWrapper({
      reservation: Reservation.build({ reserverEmailAddress }),
    });
    const email = wrapper
      .find(FormattedHTMLMessage)
      .filter({ id: 'ReservationConfirmation.confirmationText' });
    expect(email).toHaveLength(1);
    expect(email.prop('values')).toEqual({ email: reserverEmailAddress });
  });

  describe('renders feedback link with correct props', () => {
    test('when currentLanguage is fi', () => {
      const link = getWrapper({ currentLanguage: 'fi' })
        .find(FormattedHTMLMessage)
        .filter({ id: 'ReservationConfirmation.feedbackText' });

      expect(link.length).toBe(1);
      expect(link.prop('values')).toEqual({ href: constants.FEEDBACK_URL.FI });
    });

    test('when currentLanguage is sv', () => {
      const link = getWrapper({ currentLanguage: 'sv' })
        .find(FormattedHTMLMessage)
        .filter({ id: 'ReservationConfirmation.feedbackText' });

      expect(link.length).toBe(1);
      expect(link.prop('values')).toEqual({ href: constants.FEEDBACK_URL.SV });
    });

    test('when currentLanguage is en', () => {
      const link = getWrapper({ currentLanguage: 'en' })
        .find(FormattedHTMLMessage)
        .filter({ id: 'ReservationConfirmation.feedbackText' });

      expect(link.length).toBe(1);
      expect(link.prop('values')).toEqual({ href: constants.FEEDBACK_URL.EN });
    });

    test('when resource has a defined reservation feedback url', () => {
      const testFeedbackUrl = 'https://test-feedback.fi';
      const resource = Resource.build({ reservationFeedbackUrl: testFeedbackUrl });
      const link = getWrapper({ currentLanguage: 'en', resource })
        .find(FormattedHTMLMessage)
        .filter({ id: 'ReservationConfirmation.feedbackText' });

      expect(link.length).toBe(1);
      expect(link.prop('values')).toEqual({ href: testFeedbackUrl });
    });
  });

  test('renders reservation.user.email', () => {
    const user = User.build({ email: 'user email' });
    const wrapper = getWrapper({
      reservation: Reservation.build({ user }),
    });
    const email = wrapper
      .find(FormattedHTMLMessage)
      .filter({ id: 'ReservationConfirmation.confirmationText' });
    expect(email).toHaveLength(1);
    expect(email.prop('values')).toEqual({ email: user.email });
  });

  test('renders user.email', () => {
    const user = User.build({ email: 'user email' });
    const wrapper = getWrapper({
      reservation: Reservation.build(),
      user,
    });
    const email = wrapper
      .find(FormattedHTMLMessage)
      .filter({ id: 'ReservationConfirmation.confirmationText' });
    expect(email).toHaveLength(1);
    expect(email.prop('values')).toEqual({ email: user.email });
  });

  describe('renders Button', () => {
    test('with correct props', () => {
      const button = getWrapper().find(Button);
      expect(button).toHaveLength(1);
      expect(typeof button.prop('onClick')).toBe('function');
      expect(button.prop('bsStyle')).toBe('primary');
      expect(button.prop('className')).toBe('app-ReservationConfirmation__button');
    });

    test('with correct text when isLoggedIn is false', () => {
      const isLoggedIn = false;
      const button = getWrapper({ isLoggedIn }).find(Button);
      expect(button.children().text()).toBe('ReservationConfirmation.returnToHomeButton');
    });

    test('with correct text when isLoggedIn is true', () => {
      const isLoggedIn = true;
      const button = getWrapper({ isLoggedIn }).find(Button);
      expect(button.children().text()).toBe('ReservationConfirmation.ownReservationButton');
    });
  });

  test('renders reserver details fields', () => {
    const reservation = Reservation.build({
      reserverName: 'reserver name',
      company: 'company name',
      reserverId: 'reserver id',
      reserverPhoneNumber: '050 1234567',
      reserverEmailAddress: 'reserver email',
      eventSubject: 'event subject',
      eventDescription: 'event description',
      numberOfParticipants: 12,
      requireAssistance: true,
      requireWorkstation: true,
      comments: 'comments',
      reserverAddressStreet: 'reserver address street',
      reserverAddressZip: 'reserver address zip',
      reserverAddressCity: 'reserver address city',
      billingFirstName: 'billing first name',
      billingLastName: 'billing last name',
      billingPhoneNumber: 'billing phone number',
      billingEmailAddress: 'billing email',
      billingAddressStreet: 'billing address street',
      billingAddressZip: 'billing address zip',
      billingAddressCity: 'billing address city',
      reservationExtraQuestions: 'Extra information',
      homeMunicipality: { id: 'city-id', name: { fi: 'city-fi', en: 'city-en', sv: 'city-sv' } },
      user: User.build(),
      order: {
        state: 'confirmed',
        customerGroupName: { fi: 'test-group-fi', en: 'test-group-en', sv: 'test-group-sv' },
        orderLines: {
          0: {
            product: {
              id: 'testproduct1',
              type: 'rent',
              price: {
                type: 'per_period', taxPercentage: '24', amount: '5.00', period: '01:00:00'
              }
            }
          }
        },
        quantity: 1,
        price: '2.50',
        paymentMethod: constants.PAYMENT_METHODS.ONLINE
      }
    });
    const fields = getWrapper({ reservation }).find('.app-ReservationConfirmation__field');
    expect(fields).toHaveLength(26);
  });

  describe('Button onClick', () => {
    let button;
    let instance;

    beforeAll(() => {
      const wrapper = getWrapper();
      button = wrapper.find(Button);
      instance = wrapper.instance();
      instance.handleReservationsButton = simple.mock();
    });

    afterEach(() => {
      instance.handleReservationsButton.reset();
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls handleReservationsButton', () => {
      expect(button).toHaveLength(1);
      expect(typeof button.prop('onClick')).toBe('function');
      button.prop('onClick')();
      expect(instance.handleReservationsButton.callCount).toBe(1);
    });
  });

  describe('handleReservationsButton', () => {
    let historyMock;

    afterEach(() => {
      simple.restore();
    });

    test('calls browserHistory replace with correct path when isLoggedIn is true', () => {
      const isLoggedIn = true;
      const expectedPath = '/my-reservations';
      const instance = getWrapper().instance();
      historyMock = simple.mock(history, 'replace');
      instance.handleReservationsButton(isLoggedIn);

      expect(historyMock.callCount).toBe(1);
      expect(historyMock.lastCall.args).toEqual([expectedPath]);
    });

    test('calls browserHistory replace with correct path when isLoggedIn is false', () => {
      const isLoggedIn = false;
      const expectedPath = '/';
      const instance = getWrapper().instance();
      historyMock = simple.mock(history, 'replace');
      instance.handleReservationsButton(isLoggedIn);

      expect(historyMock.callCount).toBe(1);
      expect(historyMock.lastCall.args).toEqual([expectedPath]);
    });
  });
});
