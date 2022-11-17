import React from 'react';
import PropTypes from 'prop-types';

import injectT from '../../../i18n/injectT';
import QuantityInput from './extra-products/QuantityInput';
import { getPrettifiedPeriodUnits } from '../../../utils/timeUtils';
import { getRoundedVat, getTimeSlotsForCustomerGroup, PRODUCT_TYPES } from './ReservationProductsUtils';
import { getLocalizedFieldValue } from '../../../utils/languageUtils';
import ProductTimeSlotPrices from './product-time-slots/ProductTimeSlotPrices';

// Order prop type that is used in this file.
const ORDER_TYPE = {
  product: PropTypes.shape({
    amount: PropTypes.string,
    max_quantity: PropTypes.number,
    name: PropTypes.object,
    id: PropTypes.string,
    price: PropTypes.shape({
      amount: PropTypes.string,
      period: PropTypes.string,
      type: PropTypes.string,
      tax_percentage: PropTypes.string,
    }),
    type: PropTypes.string,
  }),
  price: PropTypes.number,
  rounded_price: PropTypes.string,
  quantity: PropTypes.number,
};

/**
 * Returns correct elements for mandatory product.
 * @param {Object} props
 * @param {Object[]} props.filteredtimeSlotPrices
 * @param {Object} props.order
 * @param {*} props.t
 * @returns {JSX.Element}
 */
function MandatoryProduct({ filteredtimeSlotPrices, order, t }) {
  const totalPrice = order.rounded_price;
  const {
    type, period, amount: basePrice, tax_percentage: vat
  } = order.product.price;

  const vatText = t('ReservationProducts.price.includesVat', { vat: getRoundedVat(vat) });

  return (
    <React.Fragment>
      {filteredtimeSlotPrices.length > 0 ? (
        <ProductTimeSlotPrices
          orderLine={order}
          timeSlotPrices={filteredtimeSlotPrices}
        />
      ) : (
        <p>
          {`${t('ReservationProducts.table.heading.price')}: ${basePrice} €${type !== 'fixed'
            ? ` / ${getPrettifiedPeriodUnits(period)}` : ''}`}
        </p>
      )}
      <p>{`${t('ReservationProducts.table.heading.total')}: ${totalPrice} € ${vatText}`}</p>
    </React.Fragment>
  );
}
MandatoryProduct.propTypes = {
  filteredtimeSlotPrices: PropTypes.array.isRequired,
  order: PropTypes.shape(ORDER_TYPE),
  t: PropTypes.func,
};

/**
 * Returns correct elements for extra product.
 * @param {Object} props
 * @param {Object[]} props.filteredtimeSlotPrices
 * @param {Object} props.order
 * @param {*} props.t
 * @param {function} props.handleChange
 * @returns {JSX.Element}
 */
function ExtraProduct({
  filteredtimeSlotPrices, order, t, handleChange
}) {
  const { amount: unitPrice, tax_percentage: vat } = order.product.price;
  const { quantity, rounded_price: totalPrice } = order;
  const maxQuantity = order.product.max_quantity;
  const vatText = t('ReservationProducts.price.includesVat', { vat: getRoundedVat(vat) });

  return (
    <React.Fragment>
      {filteredtimeSlotPrices.length > 0 ? (
        <ProductTimeSlotPrices
          orderLine={order}
          timeSlotPrices={filteredtimeSlotPrices}
        />
      ) : (
        <p>
          {`${t('ReservationProducts.table.heading.unitPrice')}: ${unitPrice} €`}
        </p>
      )}
      <div className="extra-mobile-quantity-input">
        <QuantityInput
          handleAdd={() => handleChange(quantity + 1, order)}
          handleReduce={() => handleChange(quantity - 1, order)}
          maxQuantity={maxQuantity}
          mobile
          quantity={quantity}
        />
      </div>
      <p className="extra-mobile-total">
        {`${t('ReservationProducts.table.heading.total')}: ${totalPrice} € ${vatText}`}
      </p>
    </React.Fragment>
  );
}
ExtraProduct.propTypes = {
  filteredtimeSlotPrices: PropTypes.array.isRequired,
  order: PropTypes.shape(ORDER_TYPE),
  t: PropTypes.func,
  handleChange: PropTypes.func,
};

/**
 * Returns li element with content according to product.type.
 * @param {Object} props
 * @param {string} props.currentCustomerGroup - id
 * @param {Object} props.order - Object that contains the product etc.
 * @param {*} props.t - Used to get language specific texts.
 * @param {function} props.handleChange - Handles quantity changes.
 * @param {string} props.currentLanguage - The current language.
 * @returns {JSX.Element}
 */
function MobileProduct({
  currentCustomerGroup, order, t, handleChange, currentLanguage
}) {
  const { id, name, type } = order.product;
  const filteredtimeSlotPrices = getTimeSlotsForCustomerGroup(
    currentCustomerGroup, order.product.product_customer_groups,
    order.product.time_slot_prices
  );
  return (
    <li key={id}>
      <div>
        <p>
          {`${getLocalizedFieldValue(name, currentLanguage, true)}`}
        </p>
        {type === PRODUCT_TYPES.MANDATORY && MandatoryProduct({ filteredtimeSlotPrices, order, t })}
        {type === PRODUCT_TYPES.EXTRA && ExtraProduct({
          filteredtimeSlotPrices, order, t, handleChange
        })}
      </div>
    </li>
  );
}

MobileProduct.propTypes = {
  currentCustomerGroup: PropTypes.string.isRequired,
  order: PropTypes.shape(ORDER_TYPE),
  t: PropTypes.func,
  handleChange: PropTypes.func,
  currentLanguage: PropTypes.string,
};

export default injectT(MobileProduct);
