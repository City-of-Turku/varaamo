import React from 'react';
import { Glyphicon } from 'react-bootstrap';

import { shallowWithIntl } from 'utils/testUtils';
import QuantityInput from '../QuantityInput';

describe('reservation-products/extra-products/QuantityInput', () => {
  const defaultProps = {
    handleAdd: () => {},
    handleReduce: () => {},
    maxQuantity: 10,
    minQuantity: 0,
    quantity: 2,
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<QuantityInput {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    test('minus button', () => {
      const button = getWrapper().find('button.minus');
      expect(button).toHaveLength(1);
      expect(button.prop('aria-label')).toBe('ReservationProducts.button.removeOne');
      expect(button.prop('className')).toBe('quantity-button minus');
      expect(button.prop('disabled')).toBe(defaultProps.quantity === defaultProps.minQuantity);
      expect(button.prop('onClick')).toBe(defaultProps.handleReduce);
      expect(button.prop('type')).toBe('button');
    });

    test('Glyphicon minus', () => {
      const glyph = getWrapper().find('button.minus').find(Glyphicon);
      expect(glyph).toHaveLength(1);
      expect(glyph.prop('aria-hidden')).toBe('true');
      expect(glyph.prop('glyph')).toBe('minus');
    });

    test('plus button', () => {
      const button = getWrapper().find('button.plus');
      expect(button).toHaveLength(1);
      expect(button.prop('aria-label')).toBe('ReservationProducts.button.addOne');
      expect(button.prop('className')).toBe('quantity-button plus');
      expect(button.prop('disabled')).toBe(defaultProps.quantity === defaultProps.maxQuantity);
      expect(button.prop('onClick')).toBe(defaultProps.handleAdd);
      expect(button.prop('type')).toBe('button');
    });

    test('Glyphicon plus', () => {
      const glyph = getWrapper().find('button.plus').find(Glyphicon);
      expect(glyph).toHaveLength(1);
      expect(glyph.prop('aria-hidden')).toBe('true');
      expect(glyph.prop('glyph')).toBe('plus');
    });

    test('quantity span', () => {
      const span = getWrapper().find('span');
      expect(span).toHaveLength(1);
      expect(span.prop('aria-live')).toBe('polite');
      expect(span.prop('role')).toBe('status');
      expect(span.text()).toBe(defaultProps.quantity.toString());
    });
  });
});
