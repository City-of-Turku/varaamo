import React from 'react';
import { Table } from 'react-bootstrap';

import { shallowWithIntl } from 'utils/testUtils';
import OrderLine from 'utils/fixtures/OrderLine';
import Product from 'utils/fixtures/Product';
import ExtraProducts from '../ExtraProducts';
import ExtraProductTableRow from '../ExtraProductTableRow';

describe('reservation-products/extra-products/ExtraProducts', () => {
  const defaultProps = {
    currentLanguage: 'fi',
    changeProductQuantity: () => {},
    orderLines: [OrderLine.build({ product: Product.build() })]
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
      const heading = getWrapper().find(Table);
      expect(heading).toHaveLength(1);
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
      expect(extraProductTableRow).toHaveLength(1);
      expect(extraProductTableRow.prop('currentLanguage')).toBe(defaultProps.currentLanguage);
      expect(extraProductTableRow.prop('handleQuantityChange')).toBeDefined();
      expect(extraProductTableRow.prop('orderLine')).toBe(defaultProps.orderLines[0]);
    });
  });
});
