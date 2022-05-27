import React from 'react';
import PropTypes from 'prop-types';

import { formatTime } from '../../../../utils/timeUtils';

/**
 * Renders a single time slot price list element
 * @param {Object} props
 * @param {string} props.begin
 * @param {string} props.end
 * @param {string} props.price
 * @param {string} props.priceUnit
 * @returns {JSX.Element}
 */
function TimeSlotPrice({
  begin, end, price, priceUnit
}) {
  const initialTimeFormat = 'HH:mm:ss';
  const targetTimeFormat = 'HH:mm';
  return (
    <li>
      {`${formatTime(
        begin, initialTimeFormat, targetTimeFormat
      )}–${formatTime(
        end, initialTimeFormat, targetTimeFormat
      )}:⠀${price} ${priceUnit}`}
    </li>
  );
}

TimeSlotPrice.propTypes = {
  begin: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  priceUnit: PropTypes.string.isRequired
};

export default TimeSlotPrice;
