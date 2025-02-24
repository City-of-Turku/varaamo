import PropTypes from 'prop-types';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import { FormattedHTMLMessage } from 'react-intl';
import Modal from 'react-bootstrap/lib/Modal';

import ReservationAccessCode from 'shared/reservation-access-code';
import ReservationDate from 'shared/reservation-date';
import { injectT } from 'i18n';

function ReservationSuccessModal({
  closeReservationSuccessModal,
  reservationsToShow,
  resources,
  show,
  t,
  user,
}) {
  const reservation = reservationsToShow.length ? reservationsToShow[0] : {};
  const resource = reservation.resource ? resources[reservation.resource] : {};
  const isPreliminaryReservation = reservation.needManualConfirmation;
  const email = isPreliminaryReservation ? reservation.reserverEmailAddress : user.email;
  const resourceName = resource.name;

  return (
    <Modal
      animation={false}
      className="reservation-success-modal modal-city-theme"
      onHide={closeReservationSuccessModal}
      show={show}
    >
      <Modal.Header closeButton closeLabel={t('ModalHeader.closeButtonText')}>
        <Modal.Title>
          {
            isPreliminaryReservation
              ? t('ReservationSuccessModal.preliminaryReservationTitle')
              : t('ReservationSuccessModal.regularReservationTitle')
          }
        </Modal.Title>
        <ReservationDate
          beginDate={reservation.begin}
          endDate={reservation.end}
        />
      </Modal.Header>
      <Modal.Body>
        <div className="reservation-success-modal__content">
          <h5>
            {isPreliminaryReservation
              ? t('ReservationSuccessModal.preliminaryReservationLead', { resourceName })
              : t('ReservationSuccessModal.regularReservationLead', { resourceName })
            }
          </h5>
          <hr />

          {reservation.accessCode && (
            <div>
              <p>
                <ReservationAccessCode
                  reservation={reservation}
                  resource={resource}
                  text={t('ReservationSuccessModal.reservationAccessCodeText')}
                />
              </p>
              <p>
                {t('ReservationSuccessModal.ownReservationsPageHelpText')}
                {email && (
                  <span>
                    {' '}
                    <FormattedHTMLMessage
                      id="ReservationSuccessModal.emailHelpText"
                      values={{ email }}
                    />
                  </span>
                )}
              </p>
            </div>
          )}

          {isPreliminaryReservation && (
            <p>
              <FormattedHTMLMessage
                id="ReservationSuccessModal.preliminaryReservationInfo"
                values={{ email }}
              />
            </p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          bsStyle="primary"
          onClick={closeReservationSuccessModal}
        >
          {t('common.ok')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

ReservationSuccessModal.propTypes = {
  closeReservationSuccessModal: PropTypes.func.isRequired,
  reservationsToShow: PropTypes.array.isRequired,
  resources: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default injectT(ReservationSuccessModal);
