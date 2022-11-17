import React from 'react';
import PropTypes from 'prop-types';

import injectT from '../../../../i18n/injectT';
import { getRoundedVat, getTimeSlotsForCustomerGroup } from '../ReservationProductsUtils';
import { getPrettifiedPeriodUnits } from 'utils/timeUtils';
import { getLocalizedFieldValue } from 'utils/languageUtils';
import ProductTimeSlotPrices from '../product-time-slots/ProductTimeSlotPrices';

function MandatoryProductTableRow({
  currentCustomerGroup, currentLanguage, orderLine, t
}) {
  const name = getLocalizedFieldValue(orderLine.product.name, currentLanguage, true);
  const basePrice = orderLine.product.price.amount;
  const totalPrice = orderLine.rounded_price;

  const type = orderLine.product.price.type;
  const period = orderLine.product.price.period;
  const vat = orderLine.product.price.tax_percentage;

  const roundedVat = getRoundedVat(vat);
  const vatText = t('ReservationProducts.price.includesVat', { vat: roundedVat });

  const filteredtimeSlotPrices = getTimeSlotsForCustomerGroup(
    currentCustomerGroup, orderLine.product.product_customer_groups,
    orderLine.product.time_slot_prices
  );

  return (
    <tr>
      <td>{name}</td>
      {filteredtimeSlotPrices.length > 0 ? (
        <td className="time-slot-price-table-row">
          <ProductTimeSlotPrices
            currentCustomerGroup={currentCustomerGroup}
            orderLine={orderLine}
            timeSlotPrices={filteredtimeSlotPrices}
          />
        </td>
      )
        : <td>{`${basePrice} €${type !== 'fixed' ? ` / ${getPrettifiedPeriodUnits(period)}` : ''}`}</td>
      }
      <td>{`${totalPrice} € ${vatText}`}</td>
    </tr>
  );
}

MandatoryProductTableRow.propTypes = {
  currentCustomerGroup: PropTypes.string.isRequired,
  currentLanguage: PropTypes.string.isRequired,
  orderLine: PropTypes.shape({
    rounded_price: PropTypes.string,
    product: PropTypes.object,
  }),
  t: PropTypes.func.isRequired,
};

export default injectT(MandatoryProductTableRow);
