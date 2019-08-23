import React from 'react';
import {
  Modal, Row, Col, Button
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import ManageReservationsStatus from '../manage/status/ManageReservationsStatus';
import injectT from '../../../app/i18n/injectT';
import { getDateAndTime } from '../manage/list/ManageReservationsList';

const ReservationInfomationModal = ({
  t, reservation, onHide, isOpen
}) => {
  const renderField = (label, value) => {
    return (
      <div className="app-ReservationInfomationModal__field">
        <Row>
          <Col className="app-ReservationInfomationModal__field__label" xs={5}><span>{t(label)}</span></Col>
          <Col className="app-ReservationInfomationModal__field__value" xs={7}><span>{value}</span></Col>
        </Row>
      </div>
    );
  };
  return (
    <Modal
      className="app-ReservationInfomationModal"
      onHide={onHide}
      show={isOpen}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('ReservationInfoModal.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ManageReservationsStatus reservation={reservation} />
        <div className="app-ReservationInfomationModal__information">
          <div className="app-ReservationInfomationModal__information__account">
            {renderField('common.userNameLabel', get(reservation, 'user.display_name', ''))}
            {renderField('common.userEmailLabel', get(reservation, 'user.email', ''))}
          </div>
          {renderField('common.reserverNameLabel', get(reservation, 'reserver_name', ''))}
          {renderField('common.eventDescriptionLabel', get(reservation, 'event_description', ''))}
          {renderField('common.reservationTimeLabel', getDateAndTime(reservation))}
          {renderField('common.resourceLabel', get(reservation, 'resource.name.fi', ''))}
          {renderField('common.reserverPhoneNumberLabel', get(reservation, 'reserver_phone_number', ''))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          bsStyle="primary"
        >
          {t('common.back')}
        </Button>

        <Button
          bsStyle="primary"
        >
          {t('ReservationInfoModal.denyButton')}
        </Button>

        <Button
          bsStyle="primary"
        >
          {t('ReservationInfoModal.confirmButton')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ReservationInfomationModal.propTypes = {
  t: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired,
  onHide: PropTypes.func,
  isOpen: PropTypes.bool
};

export default injectT(ReservationInfomationModal);
