import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

import injectT from '../../../../i18n/injectT';
import MandatoryProductTableRow from './MandatoryProductTableRow';
import { getProductsOfType, PRODUCT_TYPES } from '../ReservationProductsUtils';

function MandatoryProducts({ currentLanguage, orderLines, t }) {
  const mandatoryProducts = getProductsOfType(orderLines, PRODUCT_TYPES.MANDATORY)
    .map(orderLine => (
      <MandatoryProductTableRow
        currentLanguage={currentLanguage}
        key={orderLine.product.id}
        orderLine={orderLine}
      />
    ));

  return (
    <React.Fragment>
      {mandatoryProducts.length > 0 ? (
        <div className="mandatory-products">
          <h3>{t('ReservationProducts.heading.mandatory')}</h3>
          <Table>
            <thead>
              <tr>
                <th>{t('ReservationProducts.table.heading.name')}</th>
                <th>{t('ReservationProducts.table.heading.price')}</th>
                <th>{t('ReservationProducts.table.heading.total')}</th>
              </tr>
            </thead>
            <tbody>
              {mandatoryProducts}
            </tbody>
          </Table>
        </div>
      ) : null}
    </React.Fragment>
  );
}

MandatoryProducts.propTypes = {
  currentLanguage: PropTypes.string.isRequired,
  orderLines: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(MandatoryProducts);
