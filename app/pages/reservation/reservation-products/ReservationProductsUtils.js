import moment from 'moment';

export const PRODUCT_TYPES = {
  MANDATORY: 'rent',
  EXTRA: 'extra'
};

export function getRoundedVat(vat) {
  return Math.round(parseInt(vat, 10));
}

export function roundPriceToTwoDecimals(price) {
  return price.toFixed(2);
}

/**
 * Filters and returns only given product type order lines
 * @param {array} orderLines containing products and their info
 * @param {string} type e.g. extra
 * @returns {array} order lines of the given product type
 */
export function getProductsOfType(orderLines, type) {
  return orderLines.filter(orderLine => orderLine.product.type === type);
}

/**
 * Calculates the tax portion of the given price with given tax percentage
 * @param {string|number} price e.g. 10.50
 * @param {string|number} taxPercentage e.g. 24
 * @returns {number} tax portion of the price
 */
export function calculateTax(price, taxPercentage) {
  const numPrice = parseInt(price, 10);
  const numTaxPercentage = parseInt(taxPercentage, 10);
  return numPrice * numTaxPercentage / 100;
}

/**
 * Calculates tax breakdown from order lines
 * @param {array} orderLines containing products, prices, quantities etc
 * @returns {object} tax breakdown
 */
export function getOrderTaxTotals(orderLines) {
  const orderTaxData = [];
  orderLines.forEach((orderLine) => {
    if (orderLine.quantity > 0) {
      const taxPercentage = orderLine.product.price.tax_percentage;
      const taxPrice = calculateTax(orderLine.price, taxPercentage);
      const taxData = {
        taxPercentage,
        taxPrice,
        taxlessPrice: orderLine.price - taxPrice,
      };
      orderTaxData.push(taxData);
    }
  });

  const taxPercentages = {
    zeroTax: { totalPrice: 0, taxPercentage: 0 },
    nonZeroTaxes: {}
  };

  // init each unique tax percentage and calculate vat 0 products' total into taxless section
  orderTaxData.forEach((taxData) => {
    // dont add 0 vat into non zero taxes
    if (parseInt(taxData.taxPercentage, 10) === 0) {
      taxPercentages.zeroTax.totalPrice += taxData.taxlessPrice;
    } else {
      taxPercentages.nonZeroTaxes[taxData.taxPercentage] = {
        totalPrice: 0,
        taxPercentage: taxData.taxPercentage
      };
    }
  });

  // add each orderline's taxed and taxless price to correct section
  Object.keys(taxPercentages.nonZeroTaxes).forEach((taxPercentage) => {
    orderTaxData.forEach((taxData) => {
      if (taxPercentage === taxData.taxPercentage) {
        taxPercentages.nonZeroTaxes[taxPercentage].totalPrice += taxData.taxPrice;
        taxPercentages.zeroTax.totalPrice += taxData.taxlessPrice;
      }
    });
  });

  // round all prices to 2 decimals
  taxPercentages.zeroTax.totalPrice = taxPercentages.zeroTax.totalPrice.toFixed(2);
  Object.keys(taxPercentages.nonZeroTaxes).forEach((taxPercentage) => {
    taxPercentages.nonZeroTaxes[taxPercentage].totalPrice = taxPercentages
      .nonZeroTaxes[taxPercentage].totalPrice.toFixed(2);
  });

  return taxPercentages;
}

export function compareTaxPercentages(taxA, taxB) {
  const parsedA = parseInt(taxA.taxPercentage, 10);
  const parsedB = parseInt(taxB.taxPercentage, 10);
  if (parsedA < parsedB) {
    return -1;
  }
  if (parsedA > parsedB) {
    return 1;
  }
  return 0;
}

/**
 * Sorts and returns given tax percentages from smallert to largest
 * @param {array} taxPercentages percentage info including tax percentage itself
 * @returns {array} sorted tax percentages
 */
export function getSortedTaxPercentages(taxPercentages) {
  return taxPercentages.sort(compareTaxPercentages);
}

/**
 * Formats given period into hours and/or minutes
 * @param {string} pricePeriod e.g. 1:30:00
 * @returns {string} e.g. '1h 30min', '2h' or '45min'
 */
export function getPrettifiedPeriodUnits(pricePeriod) {
  const duration = moment.duration(pricePeriod);
  const hours = duration.hours();
  const minutes = duration.minutes();

  const hoursText = hours > 0 ? `${hours}h` : '';
  const minutesText = minutes > 0 ? `${minutes}min` : '';
  const spacer = hoursText && minutesText ? ' ' : '';

  return `${hoursText}${spacer}${minutesText}`;
}
