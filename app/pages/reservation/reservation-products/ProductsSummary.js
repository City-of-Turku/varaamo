import React from 'react';
import PropTypes from 'prop-types';

import injectT from '../../../i18n/injectT';
import { getOrderTaxTotals, getParsedVat, getSortedTaxPercentages } from './ReservationProductsUtils';

function ProductsSummary({ order, t }) {
  const taxTotals = getOrderTaxTotals(order.order_lines || []);
  const nonZeroTaxes = getSortedTaxPercentages(Object.values(taxTotals.nonZeroTaxes));
  const nonZeroTaxTotalTexts = nonZeroTaxes.map((taxTotal) => {
    const parsedVat = getParsedVat(taxTotal.taxPercentage);
    return (
      <p className="vat-total" key={parsedVat}>
        {t('ReservationProducts.summary.totalForTax', { vat: parsedVat, total: taxTotal.totalPrice })}
      </p>
    );
  });

  const totalPrice = order.price;
  return (
    <div className="products-summary">
      <h3>{t('ReservationProducts.summary.heading')}</h3>
      <p className="vat-total">
        {t('ReservationProducts.summary.totalTaxless', { total: taxTotals.zeroTax.totalPrice })}
      </p>
      {nonZeroTaxTotalTexts}
      <p className="complete-total">
        {t('ReservationProducts.summary.total', { total: totalPrice })}
      </p>
    </div>
  );
}

ProductsSummary.propTypes = {
  order: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ProductsSummary);
