import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

import { injectT } from 'i18n';
import ReservationCalendar from 'pages/resource/reservation-calendar';
import ResourceCalendar from 'shared/resource-calendar';
import ReservationDetails from '../reservation-details/ReservationDetails';
import OvernightCalendar from '../../../shared/overnight-calendar/OvernightCalendar';

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

  constructor() {
    super();

    this.state = {
      selectedDate: ''
    };
  }

  handleDateChange = (newDate) => {
    const { resource, history } = this.props;
    const day = newDate.toISOString().substring(0, 10);
    history.replace(`/reservation?date=${day}&resource=${resource.id}`);

    this.setState({
      selectedDate: day
    });
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
    const date = this.state.selectedDate || moment(selectedReservation.begin).format('YYYY-MM-DD');
    return (
      <div className="app-ReservationTime">
        <h2 className="visually-hidden reservationTime__Header">{t('ReservationPhase.timeTitle')}</h2>
        <Row>
          <Col lg={8} sm={12}>
            {resource.overnightReservations ? (
              <OvernightCalendar
                history={history}
                isStrongAuthSatisfied
                onEditCancel={onCancel}
                onEditConfirm={onConfirm}
                reservationId={selectedReservation.id}
                resource={resource}
              />
            ) : (
              <React.Fragment>
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
              </React.Fragment>
            )}
          </Col>
          <Col lg={4} sm={12}>
            <ReservationDetails
              resourceName={resource.name}
              unitName={unit.name}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default injectT(ReservationTime);
