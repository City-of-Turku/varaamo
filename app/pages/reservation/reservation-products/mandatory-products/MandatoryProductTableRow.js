import React from 'react';
import PropTypes from 'prop-types';

import injectT from '../../../../i18n/injectT';
import { getPrettifiedPeriodUnits, getRoundedVat } from '../ReservationProductsUtils';
import { getLocalizedFieldValue } from 'utils/languageUtils';

function MandatoryProductTableRow({ currentLanguage, orderLine, t }) {
  const name = getLocalizedFieldValue(orderLine.product.name, currentLanguage, true);
  const basePrice = orderLine.product.price.amount;
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
  currentLanguage: PropTypes.string.isRequired,
  orderLine: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(MandatoryProductTableRow);
