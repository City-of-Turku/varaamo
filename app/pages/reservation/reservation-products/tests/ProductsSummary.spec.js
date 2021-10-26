import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import OrderLine from 'utils/fixtures/OrderLine';
import Product from 'utils/fixtures/Product';
import ProductsSummary from '../ProductsSummary';

describe('reservation-products/ProductsSummary', () => {
  const defaultProps = {
    order: {
      begin: '2021-09-24T11:00:00+03:00',
      end: '2021-09-24T11:30:00+03:00',
      order_lines: [OrderLine.build({ product: Product.build(), quantity: 1 })],
      price: '5.00'
    },
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ProductsSummary {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    test('wrapping div', () => {
      const div = getWrapper().find('div.products-summary');
      expect(div).toHaveLength(1);
    });

    test('heading', () => {
      const heading = getWrapper().find('h3');
      expect(heading).toHaveLength(1);
      expect(heading.text()).toBe('ReservationProducts.summary.heading');
    });

    const vatTotalTexts = getWrapper().find('p.vat-total');
    test('correct amount of vat total paragraphs', () => {
      // one for vat 0% and one for test 24% product
      expect(vatTotalTexts).toHaveLength(2);
    });

    test('taxless portion paragraph', () => {
      const taxless = vatTotalTexts.at(0);
      expect(taxless.text()).toBe('ReservationProducts.summary.totalTaxless');
    });

    test('tax portion paragraph', () => {
      const taxTotal = vatTotalTexts.at(1);
      expect(taxTotal.text()).toBe('ReservationProducts.summary.totalForTax');
    });

    test('total price paragraph', () => {
      const total = getWrapper().find('p.complete-total');
      expect(total).toHaveLength(1);
      expect(total.text()).toBe('ReservationProducts.summary.total');
    });
  });
});
