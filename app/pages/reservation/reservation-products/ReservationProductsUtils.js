export const PRODUCT_TYPES = {
  MANDATORY: 'rent',
  EXTRA: 'extra'
};

export const PRODUCT_PRICE_TYPES = {
  FIXED: 'fixed',
  PER_PERIOD: 'per_period'
};

export function getRoundedVat(vat) {
  return Math.round(parseInt(vat, 10));
}

export function getParsedVat(vat) {
  return parseFloat(vat);
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
 * @param {Object[]} orderLines containing products, prices, quantities etc
 * @returns {object} tax breakdown
 */
export function getOrderTaxTotals(orderLines) {
  const orderTaxData = [];
  orderLines.forEach((orderLine) => {
    if (orderLine.quantity > 0) {
      const taxPercentage = orderLine.product.price.tax_percentage;
      const taxPrice = calculateTax(orderLine.rounded_price, taxPercentage);
      const taxData = {
        taxPercentage,
        taxPrice,
        taxlessPrice: orderLine.rounded_price - taxPrice,
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
 * Returns unique customer groups (names and id) from given resource
 * and its products
 * @param {object} resource
 * @returns {array} unique customer group objects
 */
export function getUniqueCustomerGroups(resource) {
  const customerGroups = {};
  const products = resource.products;
  products.forEach((product) => {
    const { productCustomerGroups } = product;
    productCustomerGroups.forEach((group) => {
      const { customerGroup } = group;
      customerGroups[customerGroup.id] = { ...customerGroup };
    });
  });

  return Object.values(customerGroups);
}

/**
 * Returns customer groups that are allowed for this user's login method.
 * @param {array} customerGroups list of customer group objects
 * @param {string} loginMethod e.g. user auth's amr value
 * @returns {array} allowed customer group objects
 */
export function getAllowedCustomerGroups(customerGroups, loginMethod) {
  const allowedCustomerGroups = [];
  customerGroups.forEach((customerGroup) => {
    if ('onlyForLoginMethods' in customerGroup) {
      if (customerGroup.onlyForLoginMethods.length === 0) {
        // cg has no restrictions, add it to allowed cgs
        allowedCustomerGroups.push(customerGroup);
      } else if (customerGroup.onlyForLoginMethods.length > 0) {
        const loginMethodAllowed = customerGroup.onlyForLoginMethods.some(
          allowedLoginMethod => allowedLoginMethod.loginMethodId === loginMethod
        );
        if (loginMethodAllowed) {
          // cg has restrictions, but user's login method is allowed
          allowedCustomerGroups.push(customerGroup);
        }
      }
    } else {
      // restrictions are missing, add cg to allowed cgs
      allowedCustomerGroups.push(customerGroup);
    }
  });
  return allowedCustomerGroups;
}

/**
 * Checks if a given customer group is found in given product customer groups
 * @param {string} customerGroup id
 * @param {Object[]} productCustomerGroups
 * @returns {boolean} true when customer group is found in product customer groups
 */
export function isCustomerGroupInProductCustomerGroups(customerGroup, productCustomerGroups) {
  for (let index = 0; index < productCustomerGroups.length; index += 1) {
    const pcg = productCustomerGroups[index];
    if (pcg.customer_group.id === customerGroup) {
      return true;
    }
  }
  return false;
}

/**
 * Returns time slots that apply for given customer group
 * @param {string} customerGroup id
 * @param {Object[]} productCustomerGroups
 * @param {Object[]} timeSlots
 * @returns {Object[]} timeSlots that apply for given customerGroup
 */
export function getTimeSlotsForCustomerGroup(customerGroup, productCustomerGroups, timeSlots) {
  if (!customerGroup) {
    // when not using a cg, return time slot prices as they are
    return timeSlots;
  }
  const pcgHasGivenCg = isCustomerGroupInProductCustomerGroups(
    customerGroup, productCustomerGroups
  );

  const resultTimeSlots = timeSlots.map((timeSlot) => {
    const customerGroupPrices = timeSlot.customer_group_time_slot_prices;
    for (let index = 0; index < customerGroupPrices.length; index += 1) {
      const cgPrice = customerGroupPrices[index];
      // when given cg is in time slot, use its price
      if (cgPrice.customer_group.id === customerGroup) {
        return {
          price: cgPrice.price, begin: timeSlot.begin, end: timeSlot.end, id: timeSlot.id
        };
      }
    }
    // when given cg is not in time slot but is in product, use product pricing
    if (pcgHasGivenCg) {
      return null;
    }
    // when given cg is not in time slot nor in product, use time slot pricing
    return {
      price: timeSlot.price, begin: timeSlot.begin, end: timeSlot.end, id: timeSlot.id
    };
  });

  return resultTimeSlots.filter(slot => !!slot);
}

/**
 * Returns an object containing min and max price for given time slots
 * @param {Object[]} timeSlots time slots containing a price
 * @param {string} [productPrice] optional product's own price to be included
 * in min and max calculations
 * @returns {Object} object containing min and max price
 */
export function getTimeSlotMinMaxPrices(timeSlots, productPrice = undefined) {
  const prices = timeSlots.map(timeSlot => timeSlot.price);
  if (productPrice) {
    prices.push(productPrice);
  }
  return {
    min: Math.min(...prices).toFixed(2),
    max: Math.max(...prices).toFixed(2)
  };
}
