import React from 'react';
import PropTypes from 'prop-types';

import { formatTime, getPrettifiedPeriodUnits } from '../../../../utils/timeUtils';

/**
 * Renders a single time slot price list element
 * @param {Object} props
 * @param {string} props.begin
 * @param {string} props.end
 * @param {string} props.price
 * @param {string} props.period
 * @returns {JSX.Element}
 */
function TimeSlotPrice({
  begin, end, price, period
}) {
  const initialTimeFormat = 'HH:mm:ss';
  const targetTimeFormat = 'HH:mm';
  return (
    <li>
      {`${formatTime(
        begin, initialTimeFormat, targetTimeFormat
      )}–${formatTime(
        end, initialTimeFormat, targetTimeFormat
      )}:⠀${price} € / ${getPrettifiedPeriodUnits(period)}`}
    </li>
  );
}

TimeSlotPrice.propTypes = {
  begin: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  period: PropTypes.string.isRequired
};

export default TimeSlotPrice;
