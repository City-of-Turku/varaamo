import { shallow } from 'enzyme';
import { get } from 'lodash';
import React from 'react';

import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import User from 'utils/fixtures/User';
import { getLocalizedFieldValue } from '../../../../utils/languageUtils';
import ManageReservationsComment from '../../comment/ManageReservationsComment';
import ManageReservationsDropdown from '../../dropdown-action/ManageReservationsDropdown';
import ManageReservationsPincode from '../../pincode/ManageReservationsPincode';
import ManageReservationsStatus from '../../status/ManageReservationsStatus';
import { getDateAndTime, getNormalizedReservation } from '../listUtils';
import ReservationDataRow from '../ReservationDataRow';
import { canUserCancelReservation, canUserModifyReservation } from 'utils/reservationUtils';

describe('manage-reservation/list/ReservationDataRow', () => {
  const resource = Resource.build();
  const user = User.build({ displayName: 'Test Name' });
  const eventDescription = 'This is a description';
  const reserverName = 'Test Tester';
  const reserverEmailAddress = 'test@tester@gmail.com';
  const defaultProps = {
    locale: 'en',
    reservation: Reservation.build({
      resource,
      user,
      eventDescription,
      reserverName,
      reserverEmailAddress
    }),
    onInfoClick: jest.fn(),
    onEditClick: jest.fn(),
    onEditReservation: jest.fn(),
  };

  function getWrapper(props) {
    return shallow(<ReservationDataRow {...defaultProps} {...props} />);
  }
  describe('renders', () => {
    test('wrapping tr', () => {
      const wrapper = getWrapper().find('tr');
      expect(wrapper).toHaveLength(1);
    });

    test('correct amount of td', () => {
      const tableDatas = getWrapper().find('td');
      expect(tableDatas).toHaveLength(9);
    });

    test('first td with correct data', () => {
      const tableData = getWrapper().find('td').at(0);
      expect(tableData.props().children).toBe(get(defaultProps.reservation, 'reserverName'));
    });

    test('second td with correct data', () => {
      const tableData = getWrapper().find('td').at(1);
      expect(tableData.props().children).toBe(get(defaultProps.reservation, 'reserverEmailAddress') || '-');
    });

    test('third td with correct data', () => {
      const tableData = getWrapper().find('td').at(2);
      expect(tableData.props().children).toBe(getLocalizedFieldValue(
        get(defaultProps.reservation, 'resource.name'), defaultProps.locale
      ) || '-');
    });

    test('4th td with correct data', () => {
      const tableData = getWrapper().find('td').at(3);
      expect(tableData.props().children).toBe(getLocalizedFieldValue(
        get(defaultProps.reservation, 'resource.unit.name'), defaultProps.locale
      ) || '-');
    });

    test('5th td with correct data', () => {
      const tableData = getWrapper().find('td').at(4);
      expect(tableData.props().children).toBe(getDateAndTime(defaultProps.reservation));
    });

    test('6th td with correct data', () => {
      const tableData = getWrapper().find('td').at(5);
      const pincode = tableData.find(ManageReservationsPincode);
      expect(pincode).toHaveLength(1);
      expect(pincode.prop('reservation')).toBe(defaultProps.reservation);
    });

    test('7th td with correct data', () => {
      const tableData = getWrapper().find('td').at(6);
      const comment = tableData.find(ManageReservationsComment);
      expect(comment).toHaveLength(1);
      expect(comment.prop('comments')).toBe(defaultProps.reservation.comments);
    });

    test('8th td with correct data', () => {
      const tableData = getWrapper().find('td').at(7);
      const status = tableData.find(ManageReservationsStatus);
      expect(status).toHaveLength(1);
      expect(status.prop('reservation')).toBe(defaultProps.reservation);
    });

    test('9th td with correct data', () => {
      const tableData = getWrapper().find('td').at(8);
      const dropdown = tableData.find(ManageReservationsDropdown);
      expect(dropdown).toHaveLength(1);
      expect(dropdown.prop('onEditClick')).toBeDefined();
      expect(dropdown.prop('onEditReservation')).toBe(defaultProps.onEditReservation);
      expect(dropdown.prop('onInfoClick')).toBeDefined();
      expect(dropdown.prop('reservation')).toStrictEqual(
        getNormalizedReservation(defaultProps.reservation)
      );
      expect(dropdown.prop('userCanCancel')).toBe(canUserCancelReservation(defaultProps.reservation));
      expect(dropdown.prop('userCanModify')).toBe(canUserModifyReservation(defaultProps.reservation));
    });
  });
});
