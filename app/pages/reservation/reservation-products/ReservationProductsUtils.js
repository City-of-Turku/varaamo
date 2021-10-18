export const PRODUCT_TYPES = {
  MANDATORY: 'rent',
  EXTRA: 'extra'
};

export function getRoundedVat(vat) {
  return Math.round(parseInt(vat, 10));
}

export function roundPriceToTwoDecimals(price) {
  return Number(price).toFixed(2);
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
  const numPrice = Number(price);
  const numTaxPercentage = parseInt(taxPercentage, 10);
  return numPrice - (numPrice / ((100 + numTaxPercentage) / 100));
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
 * Sorts and returns given tax percentages from smallest to largest
 * @param {array} taxPercentages percentage info including tax percentage itself
 * @returns {array} sorted tax percentages
 */
export function getSortedTaxPercentages(taxPercentages) {
  return taxPercentages.sort(compareTaxPercentages);
}

/**
 * Returns price for given current customer group or undefined when given
 * customer group doesn't have a price in given customer groups array.
 * @param {string} currentCustomerGroupId
 * @param {array} customerGroups
 * @returns {string|undefined} found customer group price or undefined
 */
export function getCustomerGroupPrice(currentCustomerGroupId, customerGroups) {
  const found = customerGroups.find(group => group.id === currentCustomerGroupId);
  return found ? found.price : undefined;
}

/**
 * Returns unique customer groups (names and id) from given resource
 * and its products
 * @param {object} resource
 * @returns {array} array of unique customer group objects
 */
export function getUniqueCustomerGroups(resource) {
  const customerGroups = {};
  const products = resource.products;
  products.forEach((product) => {
    const productGroups = product.customerGroups;
    productGroups.forEach((group) => {
      customerGroups[group.id] = { ...group };
    });
  });

  return Object.values(customerGroups);
}
