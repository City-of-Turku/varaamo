import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import { getLocalizedFieldValue } from 'utils/languageUtils';
import { getPrettifiedPeriodUnits } from 'utils/timeUtils';
import MandatoryProductTableRow from '../MandatoryProductTableRow';
import OrderLine from 'utils/fixtures/OrderLine';
import Product from 'utils/fixtures/Product';

describe('reservation-products/mandatory-products/MandatoryProductTableRow', () => {
  const defaultProps = {
    currentLanguage: 'fi',
    handleQuantityChange: () => {},
    orderLine: OrderLine.build({ product: Product.build({ type: 'rent' }) })
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<MandatoryProductTableRow {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    test('wrapping tr', () => {
      const tableRow = getWrapper().find('tr');
      expect(tableRow).toHaveLength(1);
    });

    const tableDatas = getWrapper().find('td');
    test('correct amount of table data', () => {
      expect(tableDatas).toHaveLength(3);
    });

    test('first table data has correct data', () => {
      const first = tableDatas.at(0);
      expect(first.text()).toBe(getLocalizedFieldValue(
        defaultProps.orderLine.product.name, defaultProps.currentLanguage, true
      ));
    });

    test('second table data has correct data', () => {
      const second = tableDatas.at(1);
      const basePrice = defaultProps.orderLine.product.price.amount;
      const type = defaultProps.orderLine.product.price.type;
      const period = defaultProps.orderLine.product.price.period;
      expect(second.text()).toBe(`${basePrice} €${type !== 'fixed' ? ` / ${getPrettifiedPeriodUnits(period)}` : ''}`);
    });

    test('third table data has correct data', () => {
      const third = tableDatas.at(2);
      const totalPrice = defaultProps.orderLine.price;
      expect(third.text()).toBe(`${totalPrice} € ReservationProducts.price.includesVat`);
    });
  });
});
