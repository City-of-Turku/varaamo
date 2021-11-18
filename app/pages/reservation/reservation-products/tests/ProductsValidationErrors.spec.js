import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import ProductsValidationErrors from '../ProductsValidationErrors';

describe('reservation-products/ProductsValidationErrors', () => {
  const defaultProps = {
    errorFields: ['error-1', 'error-2']
  };

  function getWrapper(props) {
    return shallowWithIntl(<ProductsValidationErrors {...defaultProps} {...props} />);
  }

  describe('renders', () => {
    test('nothing when prop errorFields is empty', () => {
      const wrapper = getWrapper({ errorFields: [] });
      expect(wrapper.isEmptyRender()).toBe(true);
    });

    test('wrapping div', () => {
      const div = getWrapper().find('div#products-page-validation-and-errors');
      expect(div).toHaveLength(1);
      expect(div.prop('role')).toBe('alert');
    });

    test('error label paragraph', () => {
      const label = getWrapper().find('p.validation-error-label');
      expect(label).toHaveLength(1);
      expect(label.text()).toBe('ReservationProducts.validation.label');
    });

    describe('error list', () => {
      const listWrapper = getWrapper().find('div.list');
      test('wrapping div', () => {
        expect(listWrapper).toHaveLength(1);
      });

      test('error list items', () => {
        const listItems = listWrapper.find('p');
        const { errorFields } = defaultProps;
        expect(listItems).toHaveLength(errorFields.length);
        listItems.forEach((item, index) => {
          expect(item.text()).toBe(errorFields[index]);
        });
      });
    });
  });
});
