import React from 'react';
import { Table } from 'react-bootstrap';

import { shallowWithIntl } from 'utils/testUtils';
import ManageReservationsList from '../ManageReservationsList';
import Reservation from 'utils/fixtures/Reservation';
import ReservationDataRow from '../ReservationDataRow';


describe('ManageReservationsList', () => {
  const reservation = Reservation.build();
  const defaultProps = {
    reservations: [reservation],
    onInfoClick: jest.fn(),
    onEditClick: jest.fn(),
    onEditReservation: jest.fn(),
    locale: 'en',
  };

  function getWrapper(props) {
    return shallowWithIntl(<ManageReservationsList {...defaultProps} {...props} />);
  }
  describe('renders', () => {
    test('wrapping div', () => {
      const wrapper = getWrapper().find('.app-ManageReservationsList');
      expect(wrapper).toHaveLength(1);
    });

    test('Table', () => {
      const table = getWrapper().find(Table);
      expect(table).toHaveLength(1);
      expect(table.prop('className')).toBe('app-ManageReservationsList__table');
    });

    test('thead', () => {
      const tableHead = getWrapper().find('thead');
      expect(tableHead).toHaveLength(1);
    });

    test('table heading row', () => {
      const headingRow = getWrapper().find('tr');
      expect(headingRow).toHaveLength(1);
    });

    test('table headings with correct texts', () => {
      const tableHeadings = getWrapper().find('th');
      expect(tableHeadings).toHaveLength(9);
      expect(tableHeadings.at(0).text()).toBe('ManageReservationsList.nameHeader');
      expect(tableHeadings.at(1).text()).toBe('ManageReservationsList.emailHeader');
      expect(tableHeadings.at(2).text()).toBe('ManageReservationsList.resourceHeader');
      expect(tableHeadings.at(3).text()).toBe('ManageReservationsList.premiseHeader');
      expect(tableHeadings.at(4).text()).toBe('ManageReservationsList.dateAndTimeHeader');
      expect(tableHeadings.at(5).text()).toBe('ManageReservationsList.pinHeader');
      expect(tableHeadings.at(6).text()).toBe('common.comments');
      expect(tableHeadings.at(7).text()).toBe('ManageReservationsList.statusHeader');
      expect(tableHeadings.at(8).text()).toBe('ManageReservationsList.actionsHeader');
    });

    test('tbody', () => {
      const tableHead = getWrapper().find('tbody');
      expect(tableHead).toHaveLength(1);
    });

    test('ReservationDataRows', () => {
      const dataRows = getWrapper().find(ReservationDataRow);
      expect(dataRows).toHaveLength(defaultProps.reservations.length);
      defaultProps.reservations.forEach((rowReservation, index) => {
        const dataRow = dataRows.at(index);
        expect(dataRow.prop('locale')).toBe(defaultProps.locale);
        expect(dataRow.prop('onEditClick')).toBe(defaultProps.onEditClick);
        expect(dataRow.prop('onEditReservation')).toBe(defaultProps.onEditReservation);
        expect(dataRow.prop('onInfoClick')).toBe(defaultProps.onInfoClick);
        expect(dataRow.prop('reservation')).toBe(rowReservation);
      });
    });
  });
});
