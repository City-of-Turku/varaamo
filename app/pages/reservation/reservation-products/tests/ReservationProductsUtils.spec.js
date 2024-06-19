import OrderLine from 'utils/fixtures/OrderLine';
import Product from 'utils/fixtures/Product';
import CustomerGroup from 'utils/fixtures/CustomerGroup';
import ProductCustomerGroup from 'utils/fixtures/ProductCustomerGroup';
import Resource from 'utils/fixtures/Resource';
import TimeSlotPriceFixture from 'utils/fixtures/TimeSlotPriceFixture';
import {
  calculateTax, compareTaxPercentages, getAllowedCustomerGroups, getOrderTaxTotals,
  getParsedVat,
  getProductsOfType, getRoundedVat, getSortedTaxPercentages, getTimeSlotMinMaxPrices,
  getTimeSlotsForCustomerGroup, getUniqueCustomerGroups,
  isCustomerGroupInProductCustomerGroups, roundPriceToTwoDecimals
} from '../ReservationProductsUtils';

describe('reservation-products/ReservationProductsUtils', () => {
  describe('getRoundedVat', () => {
    test('returns rounded number', () => {
      expect(getRoundedVat('10.00')).toBe(10);
      expect(getRoundedVat(12.00)).toBe(12);
      expect(getRoundedVat('0.00')).toBe(0);
    });
  });

  describe('getParsedVat', () => {
    test('returns parsed vat number', () => {
      expect(getParsedVat('10.00')).toBe(10);
      expect(getParsedVat(12.00)).toBe(12);
      expect(getParsedVat(12.10)).toBe(12.1);
      expect(getParsedVat(12.13)).toBe(12.13);
      expect(getParsedVat('25.50')).toBe(25.5);
      expect(getParsedVat(25.50)).toBe(25.5);
      expect(getParsedVat('0.00')).toBe(0);
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
      expect(calculateTax(10, 50)).toBe(10 - (10 / 1.5));
      expect(calculateTax(10, 100)).toBe(10 - (10 / 2));
      expect(calculateTax(10, 0)).toBe(0);
      expect(calculateTax(10, 10)).toBe(10 - (10 / 1.1));
      expect(calculateTax(10, 5)).toBe(10 - (10 / 1.05));
      expect(calculateTax(20, 5)).toBe(20 - (20 / 1.05));
      expect(calculateTax(8, 24)).toBe(8 - (8 / 1.24));
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

        const totalPriceWithTax = Number(orderLineA.price) + Number(orderLineB.price);
        const taxes = calculateTax(totalPriceWithTax, 24).toFixed(2);

        const expected = {
          nonZeroTaxes: {
            '24.00': {
              taxPercentage: '24.00',
              totalPrice: taxes,
            },
          },
          zeroTax: {
            taxPercentage: 0,
            totalPrice: (totalPriceWithTax - taxes).toFixed(2),
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

        const totalPriceWithTax14 = Number(orderLineC.price);
        const taxes14 = calculateTax(totalPriceWithTax14, 14).toFixed(2);

        const totalPriceWithTax24 = Number(orderLineA.price) + Number(orderLineB.price);
        const taxes24 = calculateTax(totalPriceWithTax24, 24).toFixed(2);

        const expected = {
          nonZeroTaxes: {
            '14.00': {
              taxPercentage: '14.00',
              totalPrice: taxes14,
            },
            '24.00': {
              taxPercentage: '24.00',
              totalPrice: taxes24,
            },
          },
          zeroTax: {
            taxPercentage: 0,
            totalPrice: (totalPriceWithTax14 - taxes14 + totalPriceWithTax24 - taxes24).toFixed(2),
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

  describe('getUniqueCustomerGroups', () => {
    describe('returns correct array', () => {
      test('when there are no customer groups in resource products', () => {
        const productA = Product.build({ productCustomerGroups: [] });
        const resourceA = Resource.build({ products: [productA] });
        expect(getUniqueCustomerGroups(resourceA)).toStrictEqual([]);
      });

      test('when there are customer groups in resource products', () => {
        const customerGroupA = CustomerGroup.build();
        const customerGroupB = CustomerGroup.build();
        const pcgA = ProductCustomerGroup.build({ customerGroup: customerGroupA });
        const pcgB = ProductCustomerGroup.build({ customerGroup: customerGroupB });
        const productA = Product.build({ productCustomerGroups: [pcgA, pcgB] });
        const productB = Product.build({ productCustomerGroups: [pcgA, pcgB] });
        const resourceA = Resource.build({ products: [productA, productB] });
        expect(getUniqueCustomerGroups(resourceA)).toStrictEqual([customerGroupA, customerGroupB]);
      });
    });
  });

  describe('getAllowedCustomerGroups', () => {
    describe('returns correct array', () => {
      test('when given customer groups is an empty array', () => {
        expect(getAllowedCustomerGroups([], '')).toStrictEqual([]);
      });

      test('when given customer groups have no customer group restrictions', () => {
        const customerGroupA = CustomerGroup.build();
        const customerGroupB = CustomerGroup.build();
        const loginMethod = 'test-amr';
        expect(getAllowedCustomerGroups(
          [customerGroupA, customerGroupB], loginMethod
        )).toStrictEqual([customerGroupA, customerGroupB]);
      });

      const loginMethodA = 'test-amr-a';
      const loginMethodB = 'test-amr-b';
      const customerGroupA = CustomerGroup.build(
        { onlyForLoginMethods: [{ loginMethodId: loginMethodA }, { loginMethodId: loginMethodB }] }
      );
      const customerGroupB = CustomerGroup.build(
        { onlyForLoginMethods: [{ loginMethodId: loginMethodA }] }
      );
      const customerGroupC = CustomerGroup.build(
        { onlyForLoginMethods: [{ loginMethodId: loginMethodB }] }
      );
      const customerGroupD = CustomerGroup.build();
      test.each([
        [loginMethodA, [customerGroupA, customerGroupB, customerGroupD]],
        [loginMethodB, [customerGroupA, customerGroupC, customerGroupD]],
        ['', [customerGroupD]],
      ])('when customer groups have login method restrictions', (loginMethod, expectedResult) => {
        expect(getAllowedCustomerGroups(
          [customerGroupA, customerGroupB, customerGroupC, customerGroupD], loginMethod
        )).toStrictEqual(expectedResult);
      });
    });
  });

  describe('isCustomerGroupInProductCustomerGroups', () => {
    test('returns true when customer group is in product customer groups', () => {
      const customerGroupA = CustomerGroup.build();
      const customerGroupB = CustomerGroup.build();
      const pcgA = ProductCustomerGroup.build({ customer_group: customerGroupA });
      const pcgB = ProductCustomerGroup.build({ customer_group: customerGroupB });
      expect(isCustomerGroupInProductCustomerGroups(customerGroupA.id, [pcgA, pcgB])).toBe(true);
    });

    test('returns false when customer group is not in product customer groups', () => {
      const customerGroupA = CustomerGroup.build();
      const customerGroupB = CustomerGroup.build();
      const pcgA = ProductCustomerGroup.build({ customer_group: customerGroupA });
      const pcgB = ProductCustomerGroup.build({ customer_group: customerGroupB });
      expect(isCustomerGroupInProductCustomerGroups('bad-cg-id', [pcgA, pcgB])).toBe(false);
    });
  });

  describe('getTimeSlotsForCustomerGroup', () => {
    describe('returns correct time slots and their prices', () => {
      test('when customer group is not defined', () => {
        const timeSlots = [TimeSlotPriceFixture.build(), TimeSlotPriceFixture.build()];
        expect(getTimeSlotsForCustomerGroup('', [], timeSlots)).toBe(timeSlots);
      });

      test('when customer group is defined and found in all time slots', () => {
        const customerGroupA = CustomerGroup.build();
        const customerGroupB = CustomerGroup.build();
        const pcgB = ProductCustomerGroup.build({ customer_group: customerGroupB });
        const timeSlots = [
          TimeSlotPriceFixture.build({
            customer_group_time_slot_prices: [{
              customer_group: customerGroupA,
              price: '31.00'
            },
            {
              customer_group: customerGroupB,
              price: '123.00'
            }]
          }),
          TimeSlotPriceFixture.build({
            customer_group_time_slot_prices: [{
              customer_group: customerGroupA,
              price: '42.00'
            }]
          })
        ];
        const expectedFirstTimeSlot = { ...timeSlots[0], price: '31.00' };
        delete expectedFirstTimeSlot.customer_group_time_slot_prices;
        const expectedSecondTimeSlot = { ...timeSlots[1], price: '42.00' };
        delete expectedSecondTimeSlot.customer_group_time_slot_prices;
        expect(getTimeSlotsForCustomerGroup(customerGroupA.id, [pcgB], timeSlots)).toStrictEqual(
          [expectedFirstTimeSlot, expectedSecondTimeSlot]
        );
      });

      test('when customer group is defined and not found in all time slots', () => {
        const customerGroupA = CustomerGroup.build();
        const customerGroupB = CustomerGroup.build();
        const pcgB = ProductCustomerGroup.build({ customer_group: customerGroupB });
        const timeSlots = [
          TimeSlotPriceFixture.build({
            customer_group_time_slot_prices: [{
              customer_group: customerGroupA,
              price: '31.00'
            },
            {
              customer_group: customerGroupB,
              price: '123.00'
            }]
          }),
          TimeSlotPriceFixture.build({
            customer_group_time_slot_prices: [{
              customer_group: customerGroupA,
              price: '42.00'
            }]
          })
        ];
        const expectedFirstTimeSlot = { ...timeSlots[0], price: '123.00' };
        delete expectedFirstTimeSlot.customer_group_time_slot_prices;
        expect(getTimeSlotsForCustomerGroup(customerGroupB.id, [pcgB], timeSlots)).toStrictEqual(
          [expectedFirstTimeSlot]
        );
      });

      test('when customer group is defined and not found in any time slots nor product customer groups', () => {
        const customerGroupA = CustomerGroup.build();
        const customerGroupB = CustomerGroup.build();
        const customerGroupC = CustomerGroup.build();
        const pcgB = ProductCustomerGroup.build({ customer_group: customerGroupB });
        const timeSlots = [
          TimeSlotPriceFixture.build({
            customer_group_time_slot_prices: [{
              customer_group: customerGroupA,
              price: '31.00'
            },
            {
              customer_group: customerGroupB,
              price: '123.00'
            }]
          }),
          TimeSlotPriceFixture.build({
            customer_group_time_slot_prices: [{
              customer_group: customerGroupA,
              price: '42.00'
            }]
          })
        ];
        const expectedFirstTimeSlot = { ...timeSlots[0] };
        delete expectedFirstTimeSlot.customer_group_time_slot_prices;
        const expectedSecondTimeSlot = { ...timeSlots[1] };
        delete expectedSecondTimeSlot.customer_group_time_slot_prices;
        expect(getTimeSlotsForCustomerGroup(customerGroupC.id, [pcgB], timeSlots)).toStrictEqual(
          [expectedFirstTimeSlot, expectedSecondTimeSlot]
        );
      });
    });
  });

  describe('getTimeSlotMinMaxPrices', () => {
    describe('returns correct object with min and max properties', () => {
      const timeSlotA = TimeSlotPriceFixture.build({ price: '52.50' });
      const timeSlotB = TimeSlotPriceFixture.build({ price: '2.40' });
      const timeSlotC = TimeSlotPriceFixture.build({ price: '10.00' });

      test('when productPrice is not given', () => {
        expect(getTimeSlotMinMaxPrices([timeSlotA, timeSlotB, timeSlotC])).toStrictEqual({
          min: timeSlotB.price,
          max: timeSlotA.price
        });
      });

      test('when productPrice is given', () => {
        const productPrice = '123.00';
        expect(getTimeSlotMinMaxPrices(
          [timeSlotA, timeSlotB, timeSlotC], productPrice
        )).toStrictEqual({
          min: timeSlotB.price,
          max: productPrice
        });
      });
    });
  });
});
