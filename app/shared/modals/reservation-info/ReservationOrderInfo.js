import React from 'react';
import PropTypes from 'prop-types';
import { Well } from 'react-bootstrap';
import { decamelizeKeys } from 'humps';

import injectT from '../../../i18n/injectT';
import { getLocalizedFieldValue } from 'utils/languageUtils';
import {
  getOrderTaxTotals, getRoundedVat, getSortedTaxPercentages, roundPriceToTwoDecimals
} from '../../../pages/reservation/reservation-products/ReservationProductsUtils';
import constants from '../../../constants/AppConstants';

function ReservationOrderInfo({
  currentLanguage, order, renderHeading, renderInfoRow, t
}) {
  const orderLines = order.orderLines.map((orderLine) => {
    const name = getLocalizedFieldValue(orderLine.product.name, currentLanguage, true);
    const quantity = `${orderLine.quantity} ${t('common.unitPieces', { unitPieces: orderLine.quantity })}`;
    const vat = getRoundedVat(orderLine.product.price.taxPercentage);
    const totalPrice = `${t('common.total')} ${t('common.priceWithVAT', { price: orderLine.price, vat })}`;
    return (
      <React.Fragment key={orderLine.product.id}>
        {renderInfoRow(name, `${quantity}, ${totalPrice}`)}
      </React.Fragment>
    );
  });

  const taxTotals = getOrderTaxTotals(decamelizeKeys(order.orderLines) || []);
  const taxlessTotal = roundPriceToTwoDecimals(Number(taxTotals.zeroTax.totalPrice));
  const nonZeroTaxes = getSortedTaxPercentages(Object.values(taxTotals.nonZeroTaxes));

  let nonZeroTaxTotal = 0;
  Object.values(nonZeroTaxes).forEach((tax) => {
    nonZeroTaxTotal += Number(tax.totalPrice);
  });
  nonZeroTaxTotal = roundPriceToTwoDecimals(nonZeroTaxTotal);

  let orderPaymentMethod = '';
  if (order.paymentMethod === constants.PAYMENT_METHODS.CASH) {
    orderPaymentMethod = t('common.paymentMethod.cash');
  } else if (order.paymentMethod === constants.PAYMENT_METHODS.ONLINE) {
    orderPaymentMethod = t('common.paymentMethod.online');
  }

  return (
    <Well id="reservation-order-info">
      {renderHeading(t('common.orderDetailsLabel'))}
      {orderLines}
      <hr />
      {renderInfoRow(t('common.taxlessTotal'), `${taxlessTotal} €`)}
      {renderInfoRow(t('common.taxesTotal'), `${nonZeroTaxTotal} €`)}
      {renderInfoRow(t('common.priceTotalLabel'), `${order.price} €`)}
      {orderPaymentMethod && (renderInfoRow(t('common.paymentMethod'), orderPaymentMethod))}
    </Well>
  );
}

ReservationOrderInfo.propTypes = {
  currentLanguage: PropTypes.string.isRequired,
  order: PropTypes.object.isRequired,
  renderHeading: PropTypes.func.isRequired,
  renderInfoRow: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ReservationOrderInfo);
