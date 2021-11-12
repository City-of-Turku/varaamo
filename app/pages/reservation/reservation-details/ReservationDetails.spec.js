import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import ReservationDetails from './ReservationDetails';
import SingleReservationDetail from './SingleReservationDetail';

describe('pages/reservation/reservation-details/ReservationDetails', () => {
  const defaultProps = {
    customerGroupName: 'Test group',
    orderPrice: '',
    resourceName: 'test-resource-name',
    selectedTime: {
      begin: '2021-10-21T08:35:00.000Z',
      end: '2021-10-21T09:45:00.000Z',
    },
    unitName: 'test-unit-name',
  };

  const defaultReservationTime = '21.10.2021 11:35–12:45 (1h 10min)';

  function getWrapper(extraProps) {
    return shallowWithIntl(<ReservationDetails {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    test('wrapper', () => {
      const wrapper = getWrapper().find('.app-ReservationDetails');
      expect(wrapper).toHaveLength(1);
    });

    test('heading', () => {
      const heading = getWrapper().find('h2');
      expect(heading).toHaveLength(1);
      expect(heading.text()).toBe('ReservationPage.detailsTitle');
    });

    describe('SingleReservationDetails', () => {
      const details = getWrapper().find(SingleReservationDetail);

      test('correct amount', () => {
        expect(details).toHaveLength(5);
      });

      test('first detail', () => {
        const detail = details.at(0);
        expect(detail.prop('label')).toBe('ReservationDetails.resourceLabel');
        expect(detail.prop('value')).toBe(defaultProps.resourceName);
      });

      test('second detail', () => {
        const detail = details.at(1);
        expect(detail.prop('label')).toBe('ReservationDetails.unitLabel');
        expect(detail.prop('value')).toBe(defaultProps.unitName);
      });

      test('third detail', () => {
        const detail = details.at(2);
        expect(detail.prop('label')).toBe('common.customerGroup');
        expect(detail.prop('value')).toBe(defaultProps.customerGroupName);
      });

      test('fourth detail', () => {
        const detail = details.at(3);
        expect(detail.prop('label')).toBe('common.priceTotalLabel');
        expect(detail.prop('value')).toBe(defaultProps.orderPrice);
      });

      test('fifth detail', () => {
        const detail = details.at(4);
        expect(detail.prop('label')).toBe('ReservationPage.detailsTime');
        expect(detail.prop('value')).toBe(defaultReservationTime);
      });
    });
  });
});
