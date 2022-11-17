import { decamelizeKeys } from 'humps';
import React from 'react';
import { Well } from 'react-bootstrap';

import OrderLine from 'utils/fixtures/OrderLine';
import Product from 'utils/fixtures/Product';
import { shallowWithIntl } from 'utils/testUtils';
import constants from '../../../constants/AppConstants';
import ReservationOrderInfo from './ReservationOrderInfo';


describe('shared/modals/reservation-info/ReservationOrderInfo', () => {
  const defaultProps = {
    currentLanguage: 'fi',
    order: {
      begin: '2021-09-24T11:00:00+03:00',
      end: '2021-09-24T11:30:00+03:00',
      orderLines: [decamelizeKeys(OrderLine.build({ product: Product.build(), quantity: 1 }))],
      price: '5.00',
      paymentMethod: constants.PAYMENT_METHODS.ONLINE,
    },
    renderHeading: () => {},
    renderInfoRow: () => {},
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<ReservationOrderInfo {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    test('wrapper Well', () => {
      const well = getWrapper().find(Well);
      expect(well).toHaveLength(1);
      expect(well.prop('id')).toBe('reservation-order-info');
    });

    test('hr', () => {
      const separator = getWrapper().find('hr');
      expect(separator).toHaveLength(1);
    });

    describe('calls renderHeading', () => {
      const renderHeading = jest.fn();
      afterEach(() => {
        renderHeading.mockClear();
      });

      test('for heading', () => {
        getWrapper({ renderHeading });
        expect(renderHeading).toHaveBeenCalledWith('common.orderDetailsLabel');
      });
    });

    describe('calls renderInfoRow', () => {
      const renderInfoRow = jest.fn();
      afterEach(() => {
        renderInfoRow.mockClear();
      });

      test('for order line', () => {
        getWrapper({ renderInfoRow });
        expect(renderInfoRow).toHaveBeenCalledWith(
          defaultProps.order.orderLines[0].product.name[defaultProps.currentLanguage],
          '1 common.unitPieces, common.total common.priceWithVAT'
        );
      });

      test('for taxless total', () => {
        getWrapper({ renderInfoRow });
        expect(renderInfoRow).toHaveBeenCalledWith('common.taxlessTotal', '0.00 €');
      });

      test('for taxes total', () => {
        getWrapper({ renderInfoRow });
        expect(renderInfoRow).toHaveBeenCalledWith('common.taxesTotal', '0.00 €');
      });

      test('for total price', () => {
        getWrapper({ renderInfoRow });
        expect(renderInfoRow).toHaveBeenCalledWith('common.priceTotalLabel', `${defaultProps.order.price} €`);
      });

      describe('when payment method exists', () => {
        test('for payment method', () => {
          getWrapper({ renderInfoRow });
          expect(renderInfoRow).toHaveBeenCalledWith('common.paymentMethod', 'common.paymentMethod.online');
          expect(renderInfoRow).not.toHaveBeenCalledWith('common.paymentMethod', 'common.paymentMethod.cash');
        });
      });

      describe('when payment method does not exist', () => {
        const order = {
          begin: '2021-09-24T11:00:00+03:00',
          end: '2021-09-24T11:30:00+03:00',
          orderLines: [decamelizeKeys(OrderLine.build({ product: Product.build(), quantity: 1 }))],
          price: '5.00',
        };
        test('not for payment method', () => {
          getWrapper({ renderInfoRow, order });
          expect(renderInfoRow).not.toHaveBeenCalledWith('common.paymentMethod', 'common.paymentMethod.online');
          expect(renderInfoRow).not.toHaveBeenCalledWith('common.paymentMethod', 'common.paymentMethod.cash');
        });
      });
    });
  });
});
