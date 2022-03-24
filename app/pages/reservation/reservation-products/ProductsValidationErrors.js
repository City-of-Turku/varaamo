import React from 'react';
import PropTypes from 'prop-types';

import injectT from '../../../i18n/injectT';

function ProductsValidationErrors({ errorFields, t }) {
  if (errorFields.length < 1) {
    return null;
  }

  const errorItems = errorFields.map(errorField => (
    <p key={errorField.replace(/\s+/g, '').toLowerCase()}>
      {errorField}
    </p>
  ));

  return (
    <div id="products-page-validation-and-errors" role="alert">
      <div>
        <p className="validation-error-label">{t('ReservationProducts.validation.label')}</p>
        <div className="list">
          {errorItems}
        </div>
      </div>
    </div>
  );
}

ProductsValidationErrors.propTypes = {
  errorFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ProductsValidationErrors);
