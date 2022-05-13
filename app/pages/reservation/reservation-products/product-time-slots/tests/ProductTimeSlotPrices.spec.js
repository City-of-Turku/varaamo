import React from 'react';
import { Panel } from 'react-bootstrap';

import { shallowWithIntl } from 'utils/testUtils';
import OrderLine from 'utils/fixtures/OrderLine';
import Product from 'utils/fixtures/Product';
import TimeSlotPriceFixture from 'utils/fixtures/TimeSlotPriceFixture';
import ProductTimeSlotPrices from '../ProductTimeSlotPrices';
import { getTimeSlotMinMaxPrices } from '../../ReservationProductsUtils';
import { getPrettifiedPeriodUnits } from '../../../../../utils/timeUtils';
import TimeSlotPrice from '../TimeSlotPrice';

describe('reservation-products/product-time-slots/ProductTimeSlotPrices', () => {
  const defaultProps = {
    orderLine: OrderLine.build({
      product: Product.build({
        type: 'rent',
        price: {
          type: 'per_period', amount: '7.51', period: '01:00:00', tax_percentage: '24'
        }
      })
    }),
    timeSlotPrices: [TimeSlotPriceFixture.build(), TimeSlotPriceFixture.build()]
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ProductTimeSlotPrices {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    test('Panel', () => {
      const panel = getWrapper().find(Panel);
      expect(panel).toHaveLength(1);
      expect(panel.prop('className')).toBe('pricing-expandable-panel');
    });

    test('Panel heading', () => {
      const heading = getWrapper().find(Panel.Heading);
      expect(heading).toHaveLength(1);
    });

    test('Panel title', () => {
      const { price } = defaultProps.orderLine.product;
      const { min, max } = getTimeSlotMinMaxPrices(
        defaultProps.timeSlotPrices, price.amount
      );
      const title = getWrapper().find(Panel.Title);
      expect(title).toHaveLength(1);
      expect(title.prop('toggle')).toBe(true);
      expect(title.children().text()).toBe(
        `ReservationProducts.timeSlots.prices ${min}–${max} € / ${getPrettifiedPeriodUnits(price.period)}`
      );
    });

    test('Panel collapse', () => {
      const collapse = getWrapper().find(Panel.Collapse);
      expect(collapse).toHaveLength(1);
    });

    test('time slot price list', () => {
      const list = getWrapper().find('ul.time-slot-price-list');
      expect(list).toHaveLength(1);
    });

    test('TimeSlotPrice list items', () => {
      const timeSlots = getWrapper().find(TimeSlotPrice);
      expect(timeSlots).toHaveLength(2);
      timeSlots.forEach((timeSlot, index) => {
        expect(timeSlot.prop('begin')).toBe(defaultProps.timeSlotPrices[index].begin);
        expect(timeSlot.prop('end')).toBe(defaultProps.timeSlotPrices[index].end);
        expect(timeSlot.prop('id')).toBe(defaultProps.timeSlotPrices[index].id);
        expect(timeSlot.prop('period')).toBe(defaultProps.orderLine.product.price.period);
        expect(timeSlot.prop('price')).toBe(defaultProps.timeSlotPrices[index].price);
      });
    });

    test('default/otherwise price list item', () => {
      const listItem = getWrapper().find('ul.time-slot-price-list').find('li');
      expect(listItem).toHaveLength(1);
      expect(listItem.text()).toBe('ReservationProducts.timeSlots.otherwise:⠀7.51 € / 1h');
    });

    describe('when prop timeSlotPrices is an empty array', () => {
      test('renders null', () => {
        const component = getWrapper({ timeSlotPrices: [] });
        expect(component.isEmptyRender()).toBe(true);
      });
    });
  });
});
