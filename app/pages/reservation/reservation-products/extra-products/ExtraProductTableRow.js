import React from 'react';
import PropTypes from 'prop-types';

import injectT from '../../../../i18n/injectT';
import QuantityInput from './QuantityInput';
import { getCustomerGroupPrice, getRoundedVat } from '../ReservationProductsUtils';
import { getPrettifiedPeriodUnits } from 'utils/timeUtils';
import { getLocalizedFieldValue } from 'utils/languageUtils';

function ExtraProductTableRow({
  currentCustomerGroupId, currentLanguage, orderLine, handleQuantityChange, t
}) {
  const totalPrice = orderLine.price;
  const name = getLocalizedFieldValue(orderLine.product.name, currentLanguage, true);
  const maxQuantity = orderLine.product.max_quantity;

  // if customer group is chosen, try to use its price, otherwise use base/default price
  const customerGroupPrice = getCustomerGroupPrice(
    currentCustomerGroupId, orderLine.product.product_customer_groups
  );

  const basePrice = customerGroupPrice || orderLine.product.price.amount;
  const period = orderLine.product.price.period;
  const type = orderLine.product.price.type;
  const vat = orderLine.product.price.tax_percentage;

  const roundedVat = getRoundedVat(vat);
  const vatText = t('ReservationProducts.price.includesVat', { vat: roundedVat });

  return (
    <tr>
      <td>{name}</td>
      <td>
        <QuantityInput
          handleAdd={() => handleQuantityChange(orderLine.quantity + 1, orderLine)}
          handleReduce={() => handleQuantityChange(orderLine.quantity - 1, orderLine)}
          maxQuantity={maxQuantity}
          quantity={orderLine.quantity}
        />
      </td>
      <td>{`${basePrice} €${type !== 'fixed' ? ` / ${getPrettifiedPeriodUnits(period)}` : ''}`}</td>
      <td>{`${totalPrice} € ${vatText}`}</td>
    </tr>
  );
}

ExtraProductTableRow.propTypes = {
  currentCustomerGroupId: PropTypes.string.isRequired,
  currentLanguage: PropTypes.string.isRequired,
  handleQuantityChange: PropTypes.func.isRequired,
  orderLine: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ExtraProductTableRow);
