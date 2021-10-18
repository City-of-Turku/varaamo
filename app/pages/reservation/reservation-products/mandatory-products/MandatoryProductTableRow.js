import React from 'react';
import PropTypes from 'prop-types';

import injectT from '../../../../i18n/injectT';
import { getCustomerGroupPrice, getRoundedVat } from '../ReservationProductsUtils';
import { getPrettifiedPeriodUnits } from 'utils/timeUtils';
import { getLocalizedFieldValue } from 'utils/languageUtils';

function MandatoryProductTableRow({
  currentCustomerGroupId, currentLanguage, orderLine, t
}) {
  const name = getLocalizedFieldValue(orderLine.product.name, currentLanguage, true);

  // if customer group is chosen, try to use its price, otherwise use base/default price
  const customerGroupPrice = getCustomerGroupPrice(
    currentCustomerGroupId, orderLine.product.customer_groups
  );

  const basePrice = customerGroupPrice || orderLine.product.price.amount;
  const totalPrice = orderLine.price;

  const type = orderLine.product.price.type;
  const period = orderLine.product.price.period;
  const vat = orderLine.product.price.tax_percentage;

  const roundedVat = getRoundedVat(vat);
  const vatText = t('ReservationProducts.price.includesVat', { vat: roundedVat });

  return (
    <tr>
      <td>{name}</td>
      <td>{`${basePrice} €${type !== 'fixed' ? ` / ${getPrettifiedPeriodUnits(period)}` : ''}`}</td>
      <td>{`${totalPrice} € ${vatText}`}</td>
    </tr>
  );
}

MandatoryProductTableRow.propTypes = {
  currentCustomerGroupId: PropTypes.string.isRequired,
  currentLanguage: PropTypes.string.isRequired,
  orderLine: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(MandatoryProductTableRow);
