import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Well from 'react-bootstrap/lib/Well';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

import { injectT } from 'i18n';
import ReservationCalendar from 'pages/resource/reservation-calendar';
import ResourceCalendar from 'shared/resource-calendar';

class ReservationTime extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    resource: PropTypes.object.isRequired,
    selectedReservation: PropTypes.object.isRequired,
    selectedTime: PropTypes.object,
    t: PropTypes.func.isRequired,
    unit: PropTypes.object.isRequired,
  };

  handleDateChange = (newDate) => {
    const { resource, history } = this.props;
    const day = newDate.toISOString().substring(0, 10);
    history.replace(`/reservation?date=${day}&resource=${resource.id}`);
  };

  render() {
    const {
      location,
      onCancel,
      onConfirm,
      history,
      match,
      resource,
      selectedReservation,
      selectedTime,
      t,
      unit,
    } = this.props;
    const { params } = match;
    const date = moment(selectedReservation.begin).format('YYYY-MM-DD');

    return (
      <div className="app-ReservationTime">
        <h2 className="visually-hidden reservationTime__Header">{t('ReservationPhase.timeTitle')}</h2>
        <Row>
          <Col lg={8} sm={12}>
            <ResourceCalendar
              onDateChange={this.handleDateChange}
              resourceId={resource.id}
              selectedDate={date}
            />
            <ReservationCalendar
              history={history}
              location={location}
              params={{ ...params, id: resource.id }}
            />
            <div className="app-ReservationTime__controls">
              <Button bsStyle="warning" className="cancel_Button" onClick={onCancel}>
                {t('ReservationInformationForm.cancelEdit')}
              </Button>
              <Button
                bsStyle="primary"
                className="next_Button"
                disabled={isEmpty(selectedReservation) || isEmpty(selectedTime)}
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
            </Well>
          </Col>
        </Row>
      </div>
    );
  }
}

export default injectT(ReservationTime);
