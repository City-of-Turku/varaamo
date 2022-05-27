import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'react-bootstrap';

import { getPrettifiedPeriodUnits } from 'utils/timeUtils';
import { getTimeSlotMinMaxPrices, PRODUCT_PRICE_TYPES } from '../ReservationProductsUtils';
import injectT from '../../../../i18n/injectT';
import TimeSlotPrice from './TimeSlotPrice';

/**
 * Returns an element containing time slot prices or null when there are no time slots
 * @param {Object} props
 * @param {Object} props.orderLine
 * @param {func} props.t
 * @param {Object[]} props.timeSlotPrices
 * @returns {JSX.Element|null}
 */
function ProductTimeSlotPrices({ orderLine, t, timeSlotPrices }) {
  const basePrice = orderLine.product.price.amount;
  const type = orderLine.product.price.type;
  const period = orderLine.product.price.period;
  const { min, max } = getTimeSlotMinMaxPrices(timeSlotPrices, basePrice);
  const priceUnit = type !== PRODUCT_PRICE_TYPES.FIXED ? `€ / ${getPrettifiedPeriodUnits(period)}` : '€';
  if (timeSlotPrices.length > 0) {
    return (
      <Panel className="pricing-expandable-panel" defaultExpanded={false}>
        <Panel.Heading>
          <Panel.Title toggle>
            {`${t('ReservationProducts.timeSlots.prices')} ${min}–${max} ${priceUnit}`}
          </Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <ul className="time-slot-price-list">
            {timeSlotPrices.map(timeSlotPrice => (
              <TimeSlotPrice
                begin={timeSlotPrice.begin}
                end={timeSlotPrice.end}
                key={`time-slot-price-${timeSlotPrice.id}`}
                period={period}
                price={timeSlotPrice.price}
                priceUnit={priceUnit}
              />
            ))}
            <li>
              {`${t('ReservationProducts.timeSlots.otherwise')}:⠀${basePrice} €${type !== 'fixed'
                ? ` / ${getPrettifiedPeriodUnits(period)}` : ''}`}
            </li>
          </ul>
        </Panel.Collapse>
      </Panel>
    );
  }

  return null;
}

ProductTimeSlotPrices.propTypes = {
  orderLine: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  timeSlotPrices: PropTypes.array.isRequired,
};

export default injectT(ProductTimeSlotPrices);
