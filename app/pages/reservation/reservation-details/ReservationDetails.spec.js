import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import ReservationDetails from './ReservationDetails';

describe('pages/reservation/reservation-details/ReservationDetails', () => {
  const defaultProps = {
    orderPrice: '',
    resourceName: 'test-resource-name',
    unitName: 'test-unit-name',
  };

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

    describe('correct details fields', () => {
      const orderPrice = '3.50 €';
      const selectedTime = {
        begin: '2021-10-21T08:35:00.000Z',
        end: '2021-10-21T09:45:00.000Z',
      };
      const reservationTime = '21.10.2021 11:35–12:45 (1h 10min)';

      test('when orderPrice and selectedTime are not defined', () => {
        const wrapper = getWrapper();
        const labels = wrapper.find('.app-ReservationDetails__label');
        const values = wrapper.find('.app-ReservationDetails__value');

        expect(labels).toHaveLength(2);
        expect(values).toHaveLength(2);

        expect(labels.at(0).text()).toBe('ReservationDetails.resourceLabel');
        expect(labels.at(1).text()).toBe('ReservationDetails.unitLabel');

        expect(values.at(0).text()).toBe(defaultProps.resourceName);
        expect(values.at(1).text()).toBe(defaultProps.unitName);
      });

      test('when orderPrice is defined and selectedTime is not defined', () => {
        const wrapper = getWrapper({ orderPrice });
        const labels = wrapper.find('.app-ReservationDetails__label');
        const values = wrapper.find('.app-ReservationDetails__value');

        expect(labels).toHaveLength(3);
        expect(values).toHaveLength(3);

        expect(labels.at(0).text()).toBe('ReservationDetails.resourceLabel');
        expect(labels.at(1).text()).toBe('ReservationDetails.unitLabel');
        expect(labels.at(2).text()).toBe('common.priceTotalLabel');

        expect(values.at(0).text()).toBe(defaultProps.resourceName);
        expect(values.at(1).text()).toBe(defaultProps.unitName);
        expect(values.at(2).text()).toBe(orderPrice);
      });

      test('when orderPrice is not defined and selectedTime is defined', () => {
        const wrapper = getWrapper({ selectedTime });
        const labels = wrapper.find('.app-ReservationDetails__label');
        const values = wrapper.find('.app-ReservationDetails__value');

        expect(labels).toHaveLength(3);
        expect(values).toHaveLength(3);

        expect(labels.at(0).text()).toBe('ReservationDetails.resourceLabel');
        expect(labels.at(1).text()).toBe('ReservationDetails.unitLabel');
        expect(labels.at(2).text()).toBe('ReservationPage.detailsTime');

        expect(values.at(0).text()).toBe(defaultProps.resourceName);
        expect(values.at(1).text()).toBe(defaultProps.unitName);
        expect(values.at(2).text()).toBe(reservationTime);
      });

      test('when orderPrice and selectedTime are defined', () => {
        const wrapper = getWrapper({ orderPrice, selectedTime });
        const labels = wrapper.find('.app-ReservationDetails__label');
        const values = wrapper.find('.app-ReservationDetails__value');

        expect(labels).toHaveLength(4);
        expect(values).toHaveLength(4);

        expect(labels.at(0).text()).toBe('ReservationDetails.resourceLabel');
        expect(labels.at(1).text()).toBe('ReservationDetails.unitLabel');
        expect(labels.at(2).text()).toBe('common.priceTotalLabel');
        expect(labels.at(3).text()).toBe('ReservationPage.detailsTime');

        expect(values.at(0).text()).toBe(defaultProps.resourceName);
        expect(values.at(1).text()).toBe(defaultProps.unitName);
        expect(values.at(2).text()).toBe(orderPrice);
        expect(values.at(3).text()).toBe(reservationTime);
      });
    });
  });
});
