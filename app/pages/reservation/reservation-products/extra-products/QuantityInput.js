import React from 'react';
import PropTypes from 'prop-types';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import injectT from '../../../../i18n/injectT';

function QuantityInput({
  handleAdd, handleReduce, quantity, maxQuantity, minQuantity, t, mobileProduct
}) {
  const textValue = mobileProduct ? `${t('ReservationProducts.table.heading.quantity')}: ${quantity}` : quantity;
  return (
    <React.Fragment>
      <button
        aria-label={t('ReservationProducts.button.removeOne')}
        className="quantity-button minus"
        disabled={quantity === minQuantity}
        onClick={handleReduce}
        type="button"
      >
        <Glyphicon aria-hidden="true" glyph="minus" />
      </button>
      <span aria-live="polite" role="status">{textValue}</span>
      <button
        aria-label={t('ReservationProducts.button.addOne')}
        className="quantity-button plus"
        disabled={quantity === maxQuantity}
        onClick={handleAdd}
        type="button"
      >
        <Glyphicon aria-hidden="true" glyph="plus" />
      </button>
    </React.Fragment>
  );
}

QuantityInput.defaultProps = {
  maxQuantity: 0,
  minQuantity: 0,
  mobileProduct: false,
};

QuantityInput.propTypes = {
  handleAdd: PropTypes.func.isRequired,
  handleReduce: PropTypes.func.isRequired,
  maxQuantity: PropTypes.number,
  minQuantity: PropTypes.number,
  mobileProduct: PropTypes.bool,
  quantity: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(QuantityInput);
