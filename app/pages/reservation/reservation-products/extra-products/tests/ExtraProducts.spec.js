import React from 'react';
import { Table } from 'react-bootstrap';

import { shallowWithIntl } from 'utils/testUtils';
import OrderLine from 'utils/fixtures/OrderLine';
import Product from 'utils/fixtures/Product';
import ExtraProducts from '../ExtraProducts';
import ExtraProductTableRow from '../ExtraProductTableRow';
import MobileProduct from '../../MobileProduct';

describe('reservation-products/extra-products/ExtraProducts', () => {
  const defaultProps = {
    currentCustomerGroup: 'abc-cg',
    currentLanguage: 'fi',
    changeProductQuantity: () => {},
    orderLines: [
      OrderLine.build({ product: Product.build() }),
      OrderLine.build({ product: Product.build() })
    ]
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ExtraProducts {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    test('nothing when there are no extra products', () => {
      const orderLines = [];
      const wrapper = getWrapper({ orderLines });
      expect(wrapper.html()).toBe('');
    });

    test('wrapping div', () => {
      const div = getWrapper().find('.extra-products');
      expect(div).toHaveLength(1);
    });

    test('heading', () => {
      const heading = getWrapper().find('h3');
      expect(heading).toHaveLength(1);
      expect(heading.text()).toBe('ReservationProducts.heading.extra');
    });

    test('Table', () => {
      const table = getWrapper().find(Table);
      expect(table).toHaveLength(1);
      expect(table.prop('responsive')).toBe(true);
    });

    test('thead', () => {
      const thead = getWrapper().find('thead');
      expect(thead).toHaveLength(1);
    });

    test('table row', () => {
      const tableRow = getWrapper().find('tr');
      expect(tableRow).toHaveLength(1);
    });

    const tableHeadings = getWrapper().find('th');
    test('correct amount of table headings', () => {
      expect(tableHeadings).toHaveLength(4);
    });

    test('first table heading has correct data', () => {
      const first = tableHeadings.at(0);
      expect(first.text()).toBe('ReservationProducts.table.heading.name');
    });

    test('2nd table heading has correct data', () => {
      const second = tableHeadings.at(1);
      expect(second.prop('id')).toBe('extra-products-product-quantity');
      expect(second.text()).toBe('ReservationProducts.table.heading.quantity');
    });

    test('3rd table heading has correct data', () => {
      const third = tableHeadings.at(2);
      expect(third.prop('className')).toBe('no-whitespace-wrapping');
      expect(third.text()).toBe('ReservationProducts.table.heading.unitPrice');
    });

    test('4th table heading has correct data', () => {
      const fourth = tableHeadings.at(3);
      expect(fourth.text()).toBe('ReservationProducts.table.heading.total');
    });

    test('tbody', () => {
      const tbody = getWrapper().find('tbody');
      expect(tbody).toHaveLength(1);
    });

    test('ExtraProductTableRow', () => {
      const extraProductTableRow = getWrapper().find(ExtraProductTableRow);
      expect(extraProductTableRow).toHaveLength(2);
      extraProductTableRow.forEach((element, index) => {
        expect(element.prop('currentCustomerGroup')).toBe(defaultProps.currentCustomerGroup);
        expect(element.prop('currentLanguage')).toBe(defaultProps.currentLanguage);
        expect(element.prop('handleQuantityChange')).toBeDefined();
        expect(element.prop('orderLine')).toEqual(defaultProps.orderLines[index]);
      });
    });
    describe('MobileProducts', () => {
      test('container div exists', () => {
        const element = getWrapper().find('div.extra-mobile-list');
        expect(element).toHaveLength(1);
      });

      test('ul element exists', () => {
        const element = getWrapper().find('ul');
        expect(element).toHaveLength(1);
        // 1 child per product so in this case 2.
        expect(element.children()).toHaveLength(2);
      });

      test('MobileProduct for each product', () => {
        const elements = getWrapper().find(MobileProduct);
        expect(elements).toHaveLength(2);
        elements.forEach((element, index) => {
          expect(element.prop('currentCustomerGroup')).toBe(defaultProps.currentCustomerGroup);
          expect(element.prop('currentLanguage')).toBe(defaultProps.currentLanguage);
          expect(element.prop('handleChange')).toBeDefined();
          expect(element.prop('order')).toEqual(defaultProps.orderLines[index]);
        });
      });
    });
  });
});
