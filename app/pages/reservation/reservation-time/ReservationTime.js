import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Well from 'react-bootstrap/lib/Well';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import get from 'lodash/get';

import injectT from '../../../i18n/injectT';
import ReservationCalendar from '../../resource/reservation-calendar/ReservationCalendarContainer';
import ResourceCalendar from '../../../shared/resource-calendar/ResourceCalendar';

class ReservationTime extends Component {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    resource: PropTypes.object.isRequired,
    reservation: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired
  };

  render() {
    const {
      onCancel,
      onConfirm,
      resource,
      reservation,
      t,
      handleDateChange,
      locale
    } = this.props;
    const date = moment(reservation.begin).format('YYYY-MM-DD');

    return (
      <div className="app-ReservationTime">
        <Row>
          <Col md={7} sm={12}>
            <ResourceCalendar
              onDateChange={handleDateChange}
              resourceId={resource.id}
              selectedDate={date}
            />
            <ReservationCalendar />
          </Col>
          <Col md={5} sm={12}>
            <Well className="app-ReservationDetails">
              <h3>{t('ReservationPage.detailsTitle')}</h3>
              <Row>
                <Col className="app-ReservationDetails__label" md={4}>
                  {t('common.resourceLabel')}
                </Col>
                <Col className="app-ReservationDetails__value" md={8}>
                  {get(resource, `name.${locale}`)}
                  <br />
                  {get(resource, `unit.name.${locale}`)}
                </Col>
              </Row>
            </Well>
          </Col>
        </Row>
        <div className="app-ReservationTime__controls">
          <Button bsStyle="warning" onClick={onCancel}>
            {t('ReservationInformationForm.cancelEdit')}
          </Button>
          <Button bsStyle="primary" disabled={isEmpty(reservation)} onClick={onConfirm}>
            {t('common.continue')}
          </Button>
        </div>
      </div>
    );
  }
}

export default injectT(ReservationTime);
