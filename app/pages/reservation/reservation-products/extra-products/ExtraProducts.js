import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

import injectT from '../../../../i18n/injectT';
import { PRODUCT_TYPES } from '../ReservationProductsUtils';
import ExtraProductTableRow from './ExtraProductTableRow';
import MobileProduct from '../MobileProduct';


function ExtraProducts({
  changeProductQuantity, currentLanguage, orderLines, t
}) {
  const quantityHeadingId = 'extra-products-product-quantity';
  const handleQuantityChange = (newQuantity, orderLine) => {
    changeProductQuantity(orderLine.product, newQuantity, PRODUCT_TYPES.EXTRA);
  };

  const extraProducts = [];
  const mobileProducts = orderLines.reduce((acc, order) => {
    acc.push(
      <MobileProduct
        currentLanguage={currentLanguage}
        handleChange={handleQuantityChange}
        key={order.product.id}
        order={order}
      />
    );
    extraProducts.push(
      <ExtraProductTableRow
        currentLanguage={currentLanguage}
        handleQuantityChange={handleQuantityChange}
        key={order.product.id}
        orderLine={order}
      />
    );
    return acc;
  }, []);

  return (
    <React.Fragment>
      {extraProducts.length > 0 ? (
        <div className="extra-products">
          <h3>{t('ReservationProducts.heading.extra')}</h3>
          <Table responsive>
            <thead>
              <tr>
                <th>{t('ReservationProducts.table.heading.name')}</th>
                <th id={quantityHeadingId}>{t('ReservationProducts.table.heading.quantity')}</th>
                <th className="no-whitespace-wrapping">{t('ReservationProducts.table.heading.unitPrice')}</th>
                <th>{t('ReservationProducts.table.heading.total')}</th>
              </tr>
            </thead>
            <tbody>
              {extraProducts}
            </tbody>
          </Table>
        </div>
      ) : null}
      {mobileProducts.length > 0 ? (
        <div className="extra-mobile-list">
          <ul>
            {mobileProducts}
          </ul>
        </div>
      ) : null}
    </React.Fragment>
  );
}


ExtraProducts.propTypes = {
  changeProductQuantity: PropTypes.func.isRequired,
  currentLanguage: PropTypes.string.isRequired,
  orderLines: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ExtraProducts);
