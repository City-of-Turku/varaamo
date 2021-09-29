import OrderLine from 'utils/fixtures/OrderLine';
import Product from 'utils/fixtures/Product';
import {
  calculateTax, compareTaxPercentages, getOrderTaxTotals, getProductsOfType,
  getRoundedVat, getSortedTaxPercentages, roundPriceToTwoDecimals, getPrettifiedPeriodUnits
} from '../ReservationProductsUtils';

describe('reservation-products/ReservationProductsUtils', () => {
  describe('getRoundedVat', () => {
    test('returns rounded number', () => {
      expect(getRoundedVat('10.00')).toBe(10);
      expect(getRoundedVat(12.00)).toBe(12);
      expect(getRoundedVat('0.00')).toBe(0);
    });
  });

  describe('roundPriceToTwoDecimals', () => {
    test('returns number rounded to two decimals', () => {
      expect(roundPriceToTwoDecimals(3.333333)).toBe('3.33');
      expect(roundPriceToTwoDecimals(142.236)).toBe('142.24');
      expect(roundPriceToTwoDecimals(1)).toBe('1.00');
      expect(roundPriceToTwoDecimals('1')).toBe('1.00');
    });
  });

  describe('getProductsOfType', () => {
    test('returns a filtered array of orderlines of given type', () => {
      const orderLineA = { product: { type: 'rent' } };
      const orderLineB = { product: { type: 'rent' } };
      const orderLineC = { product: { type: 'extra' } };
      const orderLines = [orderLineA, orderLineB, orderLineC];
      expect(getProductsOfType(orderLines, 'rent')).toStrictEqual([orderLineA, orderLineB]);
      expect(getProductsOfType(orderLines, 'extra')).toStrictEqual([orderLineC]);
      expect(getProductsOfType(orderLines, 'abc')).toStrictEqual([]);
    });
  });

  describe('calculateTax', () => {
    test('returns the tax portion of the given price with given tax percentage', () => {
      expect(calculateTax(10, 50)).toBe(5);
      expect(calculateTax(10, 100)).toBe(10);
      expect(calculateTax(10, 0)).toBe(0);
      expect(calculateTax(10, 10)).toBe(1);
      expect(calculateTax(10, 5)).toBe(0.5);
      expect(calculateTax(20, 5)).toBe(1);
    });
  });

  describe('getOrderTaxTotals', () => {
    const productA = Product.build({ price: { type: 'fixed', tax_percentage: '24.00', amount: '10.00' } });
    const productB = Product.build({ price: { type: 'fixed', tax_percentage: '24.00', amount: '5.00' } });
    const productC = Product.build({ price: { type: 'fixed', tax_percentage: '14.00', amount: '14.00' } });
    const productD = Product.build({ price: { type: 'fixed', tax_percentage: '0.00', amount: '13.50' } });

    describe('returns correct tax breakdown', () => {
      test('when order lines contains no selected products', () => {
        const orderLineA = OrderLine.build({ product: productA, quantity: 0 });
        const orderLineB = OrderLine.build({ product: productB, quantity: 0 });
        const expected = { nonZeroTaxes: {}, zeroTax: { taxPercentage: 0, totalPrice: '0.00' } };
        expect(getOrderTaxTotals([orderLineA, orderLineB])).toStrictEqual(expected);
      });

      test('when order lines contains only one selected products tax type', () => {
        const orderLineA = OrderLine.build({
          product: productA,
          quantity: 2,
          price: productA.price.amount * 2
        });

        const orderLineB = OrderLine.build({
          product: productB,
          quantity: 1,
          price: productB.price.amount
        });

        const expected = {
          nonZeroTaxes: {
            '24.00': {
              taxPercentage: '24.00',
              totalPrice: '6.00',
            },
          },
          zeroTax: {
            taxPercentage: 0,
            totalPrice: '19.00',
          },
        };
        expect(getOrderTaxTotals([orderLineA, orderLineB])).toStrictEqual(expected);
      });

      test('when order lines contains multiple selected product tax types', () => {
        const orderLineA = OrderLine.build({
          product: productA,
          quantity: 2,
          price: productA.price.amount * 2
        });

        const orderLineB = OrderLine.build({
          product: productB,
          quantity: 1,
          price: productB.price.amount
        });

        const orderLineC = OrderLine.build({
          product: productC,
          quantity: 1,
          price: productC.price.amount
        });

        const expected = {
          nonZeroTaxes: {
            '14.00': {
              taxPercentage: '14.00',
              totalPrice: '1.96',
            },
            '24.00': {
              taxPercentage: '24.00',
              totalPrice: '6.00',
            },
          },
          zeroTax: {
            taxPercentage: 0,
            totalPrice: '31.04',
          },
        };
        expect(getOrderTaxTotals([orderLineA, orderLineB, orderLineC])).toStrictEqual(expected);
      });

      test('when order lines contains only zero tax products', () => {
        const orderLineD = OrderLine.build({
          product: productD,
          quantity: 2,
          price: productD.price.amount * 2
        });

        const expected = { nonZeroTaxes: {}, zeroTax: { taxPercentage: 0, totalPrice: '27.00' } };
        expect(getOrderTaxTotals([orderLineD])).toStrictEqual(expected);
      });
    });
  });

  describe('compareTaxPercentages', () => {
    const taxA = { taxPercentage: 14 };
    const taxB = { taxPercentage: 24 };
    const taxC = { taxPercentage: 14 };
    test('returns -1 when first tax is smaller than second tax', () => {
      expect(compareTaxPercentages(taxA, taxB)).toBe(-1);
    });

    test('returns 1 when first tax is larger than second tax', () => {
      expect(compareTaxPercentages(taxB, taxC)).toBe(1);
    });

    test('returns 0 when first tax is equal to second tax', () => {
      expect(compareTaxPercentages(taxA, taxC)).toBe(0);
    });
  });

  describe('getSortedTaxPercentages', () => {
    const taxA = { taxPercentage: 14 };
    const taxB = { taxPercentage: 24 };
    const taxC = { taxPercentage: 14 };
    const taxD = { taxPercentage: 0 };
    test('returns given tax percentages from smallert to largest', () => {
      expect(getSortedTaxPercentages([taxA, taxB, taxC, taxD]))
        .toStrictEqual([taxD, taxA, taxC, taxB]);
    });
  });

  describe('getPrettifiedPeriodUnits', () => {
    test('returns correct string', () => {
      expect(getPrettifiedPeriodUnits('1:30:00')).toBe('1h 30min');
      expect(getPrettifiedPeriodUnits('2:00:00')).toBe('2h');
      expect(getPrettifiedPeriodUnits('0:25:00')).toBe('25min');
      expect(getPrettifiedPeriodUnits('0:00:00')).toBe('');
    });
  });
});
