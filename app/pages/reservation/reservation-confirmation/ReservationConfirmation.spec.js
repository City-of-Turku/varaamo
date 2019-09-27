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

  describe('billing information header', () => {
    test('renders correct header when billingAddressStreet prop is given', () => {
      const reservation = Reservation.build({ billingAddressStreet: 'Katukatu 123' });
      const header = getWrapper({ reservation }).find('#billingInformationHeader');
      expect(header).toHaveLength(1);
      expect(header.text()).toBe('common.billingAddressLabel');
    });

    test('renders correct header when billingAddressStreet prop is not given', () => {
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

  test('renders Button with correct props', () => {
    const button = getWrapper().find(Button);
    expect(button).toHaveLength(1);
    expect(typeof button.prop('onClick')).toBe('function');
  });

  test('renders reserver details fields', () => {
    const reservation = Reservation.build({
      reserverName: 'reserver name',
      reserverId: 'reserver id',
      reserverPhoneNumber: '050 1234567',
      reserverEmailAddress: 'reserver email',
      eventSubject: 'event subject',
      eventDescription: 'event description',
      numberOfParticipants: 12,
      requireAssistance: true,
      comments: 'comments',
      reserverAddressStreet: 'reserver address street',
      reserverAddressZip: 'reserver address zip',
      reserverAddressCity: 'reserver address city',
      billingAddressStreet: 'billing address street',
      billingAddressZip: 'billing address zip',
      billingAddressCity: 'billing address city',
      reservationExtraQuestions: 'Extra information',
      user: User.build(),
    });
    const fields = getWrapper({ reservation }).find('.app-ReservationConfirmation__field');
    expect(fields).toHaveLength(16);
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
    const expectedPath = '/my-reservations';
    let instance;
    let historyMock;

    beforeAll(() => {
      instance = getWrapper().instance();
      historyMock = simple.mock(history, 'replace');
      instance.handleReservationsButton();
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls browserHistory replace with correct path', () => {
      expect(historyMock.callCount).toBe(1);
      expect(historyMock.lastCall.args).toEqual([expectedPath]);
    });
  });
});
