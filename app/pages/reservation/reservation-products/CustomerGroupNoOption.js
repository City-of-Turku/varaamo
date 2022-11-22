import React from 'react';
import PropTypes from 'prop-types';

import injectT from '../../../i18n/injectT';

function CustomerGroupNoOption({ customerGroup, t }) {
  return (
    <div id="products-customer-group-no-option">
      <p className="products-customer-group-no-option-label">
        {t('ReservationProducts.select.clientGroup.label')}
      </p>
      <p className="products-customer-group-no-option-value">
        {customerGroup.name}
      </p>
    </div>
  );
}

CustomerGroupNoOption.propTypes = {
  customerGroup: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(CustomerGroupNoOption);
