import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Col, Row, Well
} from 'react-bootstrap';
import moment from 'moment';
import { isEmpty } from 'lodash';
import Loader from 'react-loader';

import injectT from '../../../i18n/injectT';
import MandatoryProducts from './mandatory-products/MandatoryProducts';
import ProductsSummary from './ProductsSummary';
import ExtraProducts from './extra-products/ExtraProducts';

function ReservationProducts({
  changeProductQuantity, currentLanguage, isEditing, onBack, onCancel, onConfirm,
  order, resource, selectedTime, t, unit
}) {
  const beginText = moment(selectedTime.begin).format('D.M.YYYY HH:mm');
  const endText = moment(selectedTime.end).format('HH:mm');
  const hours = moment(selectedTime.end).diff(selectedTime.begin, 'minutes') / 60;

  const orderLines = order.order_lines || [];

  return (
    <div className="app-ReservationProducts">
      <h2 className="visually-hidden" id="reservation-products-page-heading">{t('ReservationPhase.productsTitle')}</h2>
      <Row id="reservation-products-page-main-row">
        <Col lg={8} sm={12}>
          {!order.error ? (
            <Loader loaded={!order.loadingData}>
              <MandatoryProducts
                currentLanguage={currentLanguage}
                orderLines={orderLines}
              />
              <ExtraProducts
                changeProductQuantity={changeProductQuantity}
                currentLanguage={currentLanguage}
                orderLines={orderLines}
              />
              <ProductsSummary order={order} />
            </Loader>
          )
            : <p id="products-error-message">{t('Notifications.errorMessage')}</p>
          }
          <div className="form-controls">
            <Button
              bsStyle="warning"
              onClick={onCancel}
            >
              {isEditing ? t('ReservationInformationForm.cancelEdit') : t('common.cancel')}
            </Button>
            {isEditing
                && (
                <Button
                  bsStyle="default"
                  onClick={onBack}
                >
                  {t('common.previous')}
                </Button>
                )
              }
            <Button
              bsStyle="primary"
              className="next_Button"
              disabled={isEmpty(selectedTime) || order.error}
              onClick={onConfirm}
            >
              {t('common.continue')}
            </Button>
          </div>
        </Col>

        <Col lg={4} sm={12}>
          <Well className="app-ReservationDetails">
            <h2>{t('ReservationPage.detailsTitle')}</h2>
            <Row>
              <Col className="app-ReservationDetails__label" md={4}>
                {t('common.resourceLabel')}
              </Col>
              <Col className="app-ReservationDetails__value" md={8}>
                {resource.name}
                <br />
                {unit.name}
              </Col>
            </Row>
            <Row>
              <Col className="app-ReservationDetails__label" md={4}>
                {t('ReservationPage.detailsTime')}
              </Col>
              <Col className="app-ReservationDetails__value" md={8}>
                {`${beginText}–${endText} (${hours} h)`}
              </Col>
            </Row>
          </Well>
        </Col>
      </Row>
    </div>
  );
}

ReservationProducts.propTypes = {
  changeProductQuantity: PropTypes.func.isRequired,
  currentLanguage: PropTypes.string.isRequired,
  // isAdmin: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  order: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  selectedTime: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
};

export default injectT(ReservationProducts);
