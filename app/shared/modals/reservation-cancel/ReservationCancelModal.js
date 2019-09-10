import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import { FormattedHTMLMessage } from 'react-intl';

import CompactReservationList from '../../compact-reservation-list/CompactReservationList';
import injectT from '../../../i18n/injectT';
import { cancelReservation } from '../../../../src/domain/reservation/utils';

class ReservationCancelModal extends Component {
  state = {
    isCancelling: false
  }

  handleCancel() {
    const { reservation, closeModal } = this.props;

    this.setState({
      isCancelling: true
    });

    cancelReservation(reservation).then(() => {
      this.setState({
        isCancelling: false
      });

      closeModal();
    });
  }

  render() {
    const {
      cancelAllowed,
      closeModal,
      reservation,
      resource,
      show,
      t,
    } = this.props;

    const { isCancelling } = this.state;

    return (
      <Modal
        onHide={closeModal}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {cancelAllowed
              ? t('ReservationCancelModal.cancelAllowedTitle')
              : t('ReservationCancelModal.cancelNotAllowedTitle')
            }
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {cancelAllowed
            && (
            <div>
              <p><strong>{t('ReservationCancelModal.lead')}</strong></p>
              {reservation.resource
                && (
                <CompactReservationList
                  reservations={[reservation]}
                  resources={{ [resource.id]: resource }}
                />
                )
              }
            </div>
            )
          }
          {!cancelAllowed
            && (
            <div>
              <p>{t('ReservationCancelModal.cancelNotAllowedInfo')}</p>
              <p><FormattedHTMLMessage id="ReservationCancelModal.takeIntoAccount" /></p>
              <p className="responsible-contact-info">{resource.responsible_contact_info}</p>
            </div>
            )
          }
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="default"
            onClick={closeModal}
          >
            {cancelAllowed
              ? t('ReservationCancelModal.cancelAllowedCancel')
              : t('common.back')
            }
          </Button>
          {cancelAllowed && (
            <Button
              bsStyle="danger"
              disabled={isCancelling}
              onClick={this.handleCancel}
            >
              {isCancelling
                ? t('common.cancelling')
                : t('ReservationCancelModal.cancelAllowedConfirm')
              }
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

ReservationCancelModal.propTypes = {
  cancelAllowed: PropTypes.bool.isRequired,
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired
};

export default injectT(ReservationCancelModal);
