import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import PaymentFailed from './PaymentFailed';

describe('pages/reservation/payment/PaymentFailed', () => {
  const defaultProps = {
    resourceId: 'test-id'
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<PaymentFailed {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    test('wrapping div', () => {
      const div = getWrapper();
      expect(div).toHaveLength(1);
      expect(div.prop('className')).toBe('reservation-payment-failed');
    });

    test('h2 title', () => {
      const title = getWrapper().find('h2');
      expect(title).toHaveLength(1);
      expect(title.text()).toBe('payment.title');
    });

    test('p text', () => {
      const title = getWrapper().find('p');
      expect(title).toHaveLength(1);
      expect(title.text()).toBe('payment.text');
    });

    describe('return link', () => {
      test('is rendered when prop resourceId is defined', () => {
        const resourceId = 'test123';
        const link = getWrapper({ resourceId }).find('#payment-failed-return-link');
        expect(link).toHaveLength(1);
        expect(link.prop('className')).toBe('reservation-payment-failed-link');
        expect(link.prop('to')).toBe(`/resources/${resourceId}`);
      });

      test('is not rendered when prop resourceId is not defined', () => {
        const resourceId = undefined;
        const link = getWrapper({ resourceId }).find('#payment-failed-return-link');
        expect(link).toHaveLength(0);
      });
    });

    test('own reservations link', () => {
      const link = getWrapper().find('#payment-failed-own-reservations-link');
      expect(link).toHaveLength(1);
      expect(link.prop('className')).toBe('reservation-payment-failed-link');
      expect(link.prop('to')).toBe('/my-reservations');
    });
  });
});
