import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import Reservation from 'utils/fixtures/Reservation';
import PageResultsText from '../PageResultsText';

describe('PageResultsText', () => {
  const defaultProps = {
    currentPage: 0,
    pageSize: 10,
    reservations: [],
    totalReservations: 0,
    filteredReservations: [],
  };

  function getWrapper(props) {
    return shallowWithIntl(<PageResultsText {...defaultProps} {...props} />);
  }

  describe('renders', () => {
    test('wrapping span', () => {
      const wrapper = getWrapper().find('span');
      expect(wrapper).toHaveLength(1);
      expect(wrapper.prop('role')).toBe('status');
    });

    test('correct text when there are no reservations', () => {
      const wrapper = getWrapper().find('span');
      expect(wrapper.prop('children')).toBe('ManageReservationsPage.noSearchResults');
    });

    test('correct text when there are no reservations left outside of filtered reservations', () => {
      const reservation = Reservation.build();
      const wrapper = getWrapper({
        reservations: [reservation],
        filteredReservations: [reservation],
        totalReservations: 1,
      }).find('span');

      expect(wrapper.prop('children')).toBe('ManageReservationsPage.searchResults');
    });

    test('correct text when there are reservations left outside of filtered reservations', () => {
      const reservation = Reservation.build();
      const wrapper = getWrapper({
        reservations: [reservation],
        filteredReservations: [],
        totalReservations: 1,
      }).find('span');

      expect(wrapper.prop('children')).toBe(
        'ManageReservationsPage.searchResults (ManageReservationsPage.searchResultsHidden)'
      );
    });
  });
});
