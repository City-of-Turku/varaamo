import React from 'react';

import { shallowWithIntl } from '../../../../utils/testUtils';
import MobileProduct from '../MobileProduct';
import OrderLine from 'utils/fixtures/OrderLine';
import Product from 'utils/fixtures/Product';
import { getPrettifiedPeriodUnits } from '../../../../utils/timeUtils';
import QuantityInput from '../extra-products/QuantityInput';


describe('reservation-products/MobileProduct', () => {
  const defaultProps = {
    order: {},
    handleChange: jest.fn(),
    currentLanguage: 'fi',
  };
  function getWrapper(props) {
    return shallowWithIntl(<MobileProduct {...defaultProps} {...props} />);
  }
  describe('MobileProduct', () => {
    test('when order.product is mandatory and product.price type is fixed', () => {
      const rentProduct = Product.build({
        type: 'rent',
        price: {
          type: 'fixed', tax_percentage: '24.00', amount: '8.00'
        }
      });
      const wrapper = getWrapper(
        {
          order: OrderLine.build({
            product: rentProduct,
            price: '8.00',
            quantity: 1
          })
        }
      );
      const expectedValues = [
        rentProduct.name[defaultProps.currentLanguage],
        `ReservationProducts.table.heading.price: ${rentProduct.price.amount} €`,
        `ReservationProducts.table.heading.total: ${rentProduct.price.amount} € ReservationProducts.price.includesVat`,
      ];
      expect(wrapper.find('p')).toHaveLength(3);
      wrapper.find('p').forEach((element, index) => {
        expect(element.text()).toEqual(expectedValues[index]);
      });
    });

    test('when order.product is mandatory and product.price type is per_period', () => {
      // This is a 2.5h reservation.
      // order.quantity * order.product.price.period = 2.5h
      // order.quantity * order.product.amount = order.price
      const rentProduct = Product.build({
        type: 'rent',
        price: {
          type: 'per_period', tax_percentage: '24.00', amount: '10.00', period: '00:30:00'
        }
      });
      const orderPrice = '50.00';
      // eslint-disable-next-line max-len
      const orderQuantity = Number.parseInt(orderPrice, 10) / Number.parseInt(rentProduct.price.amount, 10);

      const wrapper = getWrapper(
        {
          order: OrderLine.build({
            product: rentProduct,
            price: orderPrice,
            quantity: orderQuantity,
          })
        }
      );
      const expectedValues = [
        rentProduct.name[defaultProps.currentLanguage],
        `ReservationProducts.table.heading.price: ${rentProduct.price.amount} € / ${getPrettifiedPeriodUnits(rentProduct.price.period)}`,
        `ReservationProducts.table.heading.total: ${orderPrice} € ReservationProducts.price.includesVat`,
      ];
      expect(wrapper.find('p')).toHaveLength(3);
      wrapper.find('p').forEach((element, index) => {
        expect(element.text()).toEqual(expectedValues[index]);
      });
    });

    test('when order.product is extra', () => {
      const extraProduct = Product.build({
        type: 'extra',
        price: {
          type: 'fixed', tax_percentage: '20.00', amount: '15.00'
        },
        max_quantity: 10,
      });
      const orderPrice = '45.00';
      // eslint-disable-next-line max-len
      const orderQuantity = Number.parseInt(orderPrice, 10) / Number.parseInt(extraProduct.price.amount, 10);

      const wrapper = getWrapper(
        {
          order: OrderLine.build({
            product: extraProduct,
            price: orderPrice,
            quantity: orderQuantity
          })
        }
      );
      const expectedValues = [
        extraProduct.name[defaultProps.currentLanguage],
        `ReservationProducts.table.heading.unitPrice: ${extraProduct.price.amount} €`,
        `ReservationProducts.table.heading.total: ${orderPrice} € ReservationProducts.price.includesVat`,
      ];
      expect(wrapper.find('p')).toHaveLength(3);
      wrapper.find('p').forEach((element, index) => {
        expect(element.text()).toEqual(expectedValues[index]);
      });

      expect(wrapper.find('div.extra-mobile-quantity-input')).toHaveLength(1);
      expect(wrapper.find(QuantityInput)).toHaveLength(1);
      const quantityElement = wrapper.find(QuantityInput);
      expect(quantityElement.prop('handleAdd')).toBeDefined();
      expect(quantityElement.prop('handleReduce')).toBeDefined();
      expect(quantityElement.prop('maxQuantity')).toEqual(extraProduct.max_quantity);
      expect(quantityElement.prop('quantity')).toEqual(orderQuantity);
    });
  });
});
