import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Table, Well } from 'react-bootstrap';

import injectT from '../../../../i18n/injectT';
import MandatoryProductTableRow from './MandatoryProductTableRow';
import MobileProduct from '../MobileProduct';

function MandatoryProducts({
  currentLanguage, isStaff, onStaffSkipChange, orderLines, skipProducts, t
}) {
  const mandatoryProducts = [];
  const mobileProducts = orderLines.reduce((acc, order) => {
    acc.push(
      <MobileProduct
        currentLanguage={currentLanguage}
        key={order.product.id}
        order={order}
      />
    );
    mandatoryProducts.push(
      <MandatoryProductTableRow
        currentLanguage={currentLanguage}
        key={order.product.id}
        orderLine={order}
      />
    );
    return acc;
  }, []);

  return (
    <React.Fragment>
      {mandatoryProducts.length > 0 ? (
        <div className="mandatory-products">
          <h3>{t('ReservationProducts.heading.mandatory')}</h3>
          {isStaff && (
            <Well className="products-staff-skip">
              <Checkbox
                checked={skipProducts}
                onChange={onStaffSkipChange}
              >
                {t('ReservationProducts.staffSkip.mandatory')}
              </Checkbox>
            </Well>
          )}
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
          {mobileProducts.length > 0 ? (
            <div className="mandatory-mobile-list">
              <ul>
                {mobileProducts}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </React.Fragment>
  );
}

MandatoryProducts.propTypes = {
  currentLanguage: PropTypes.string.isRequired,
  isStaff: PropTypes.bool.isRequired,
  onStaffSkipChange: PropTypes.func.isRequired,
  orderLines: PropTypes.array.isRequired,
  skipProducts: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(MandatoryProducts);
