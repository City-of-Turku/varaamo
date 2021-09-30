import React from 'react';
import { Checkbox, Table } from 'react-bootstrap';

import { shallowWithIntl } from 'utils/testUtils';
import OrderLine from 'utils/fixtures/OrderLine';
import Product from 'utils/fixtures/Product';
import MandatoryProducts from '../MandatoryProducts';
import MandatoryProductTableRow from '../MandatoryProductTableRow';

describe('reservation-products/extra-products/ExtraProducts', () => {
  const defaultProps = {
    currentLanguage: 'fi',
    isStaff: false,
    onStaffSkipChange: () => {},
    skipProducts: false,
    orderLines: [OrderLine.build({ product: Product.build({ type: 'rent' }) })]
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<MandatoryProducts {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    test('nothing when there are no mandatory products', () => {
      const orderLines = [];
      const wrapper = getWrapper({ orderLines });
      expect(wrapper.html()).toBe('');
    });

    test('wrapping div', () => {
      const div = getWrapper().find('.mandatory-products');
      expect(div).toHaveLength(1);
    });

    test('heading', () => {
      const heading = getWrapper().find('h3');
      expect(heading).toHaveLength(1);
      expect(heading.text()).toBe('ReservationProducts.heading.mandatory');
    });

    describe('when prop isStaff is true', () => {
      const wrapper = getWrapper({ isStaff: true });

      test('staff skip Well', () => {
        const well = wrapper.find('.products-staff-skip');
        expect(well).toHaveLength(1);
      });

      test('checkbox', () => {
        const checkbox = wrapper.find(Checkbox);
        expect(checkbox).toHaveLength(1);
        expect(checkbox.prop('checked')).toBe(defaultProps.skipProducts);
        expect(checkbox.prop('onChange')).toBe(defaultProps.onStaffSkipChange);
      });
    });

    describe('when prop isStaff is false', () => {
      const wrapper = getWrapper({ isStaff: false });

      test('staff skip Well is not rended', () => {
        const well = wrapper.find('.products-staff-skip');
        expect(well).toHaveLength(0);
      });

      test('checkbox is not rendered', () => {
        const checkbox = wrapper.find(Checkbox);
        expect(checkbox).toHaveLength(0);
      });
    });

    test('Table', () => {
      const table = getWrapper().find(Table);
      expect(table).toHaveLength(1);
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
      expect(tableHeadings).toHaveLength(3);
    });

    test('first table heading has correct data', () => {
      const first = tableHeadings.at(0);
      expect(first.text()).toBe('ReservationProducts.table.heading.name');
    });

    test('2nd table heading has correct data', () => {
      const second = tableHeadings.at(1);
      expect(second.text()).toBe('ReservationProducts.table.heading.price');
    });

    test('3rd table heading has correct data', () => {
      const third = tableHeadings.at(2);
      expect(third.text()).toBe('ReservationProducts.table.heading.total');
    });

    test('tbody', () => {
      const tbody = getWrapper().find('tbody');
      expect(tbody).toHaveLength(1);
    });

    test('MandatoryProductTableRow', () => {
      const mandatoryProductTableRow = getWrapper().find(MandatoryProductTableRow);
      expect(mandatoryProductTableRow).toHaveLength(1);
      expect(mandatoryProductTableRow.prop('currentLanguage')).toBe(defaultProps.currentLanguage);
      expect(mandatoryProductTableRow.prop('orderLine')).toBe(defaultProps.orderLines[0]);
    });
  });
});
