import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Modal from 'react-bootstrap/lib/Modal';
import classNames from 'classnames';

import { injectT } from 'i18n';
import ReservationCancelModal from 'shared/modals/reservation-cancel';
import ReservationStateLabel from 'shared/reservation-state-label';
import { isStaffEvent } from 'utils/reservationUtils';
import ReservationEditForm from './ReservationEditForm';

class ReservationInfoModal extends Component {
  constructor(props) {
    super(props);
    this.commentsInput = React.createRef();

    this.handleEditFormSubmit = this.handleEditFormSubmit.bind(this);
    this.handleSaveCommentsClick = this.handleSaveCommentsClick.bind(this);
  }

  handleEditFormSubmit(values) {
    const { onEditFormSubmit, reservation, resource } = this.props;
    const staffEvent = isStaffEvent(reservation, resource);
    onEditFormSubmit({ ...reservation, ...values, staffEvent });
  }

  handleSaveCommentsClick() {
    const comments = this.commentsInput.value;
    if (typeof (comments) === 'string' && comments.trim().length === 0) {
      this.props.onSaveCommentsClick('-');
    } else {
      this.props.onSaveCommentsClick(comments);
    }
  }

  render() {
    const {
      contrast,
      currentLanguage,
      fontSize,
      hideReservationInfoModal,
      isAdmin,
      isEditing,
      isLargerFontSize,
      isSaving,
      isStaff,
      onCancelClick,
      onCancelEditClick,
      onConfirmClick,
      onDenyClick,
      onStartEditClick,
      reservation,
      reservationIsEditable,
      resource,
      show,
      t,
    } = this.props;

    const disabled = isSaving || isEditing;
    const showCancelButton = reservationIsEditable && (
      reservation.state === 'confirmed'
      || (reservation.state === 'requested' && !isAdmin)
    );

    return (
      <Modal
        className={classNames('reservation-info-modal', fontSize, contrast)}
        onHide={hideReservationInfoModal}
        show={show}
      >
        <Modal.Header closeButton closeLabel={t('ModalHeader.closeButtonText')}>
          <Modal.Title componentClass="h3">
            {t('ReservationInfoModal.title')}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {!isEmpty(reservation)
            && (
            <div>
              <ReservationStateLabel reservation={reservation} />
              <ReservationEditForm
                currentLanguage={currentLanguage}
                enableReinitialize
                initialValues={reservation}
                isAdmin={isAdmin}
                isEditing={isEditing}
                isLargerFontSize={isLargerFontSize}
                isSaving={isSaving}
                isStaff={isStaff}
                onCancelEditClick={onCancelEditClick}
                onStartEditClick={onStartEditClick}
                onSubmit={this.handleEditFormSubmit}
                reservation={reservation}
                reservationIsEditable={reservationIsEditable}
                resource={resource}
              />
              {isAdmin && reservationIsEditable && (
              <form className="comments-form">
                <FormGroup controlId="commentsTextarea">
                  <ControlLabel>
                    {t('common.commentsLabel')}
                      :
                  </ControlLabel>
                  <FormControl
                    componentClass="textarea"
                    defaultValue={reservation.comments}
                    disabled={disabled}
                    // eslint-disable-next-line no-return-assign
                    inputRef={ref => this.commentsInput = ref}
                    maxLength="256"
                    placeholder={t('common.commentsPlaceholder')}
                    rows={5}
                  />
                </FormGroup>
                <div className="form-controls">
                  <Button
                    bsStyle="primary"
                    disabled={disabled}
                    onClick={this.handleSaveCommentsClick}
                  >
                    {isSaving ? t('common.saving') : t('ReservationInfoModal.saveComment')}
                  </Button>
                </div>
              </form>
              )}
            </div>
            )
          }
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="default"
            className={fontSize}
            onClick={hideReservationInfoModal}
          >
            {t('common.back')}
          </Button>
          {isStaff && reservationIsEditable && reservation.state === 'requested' && (
            <Button
              bsStyle="danger"
              className={fontSize}
              disabled={disabled}
              onClick={onDenyClick}
            >
              {t('ReservationInfoModal.denyButton')}
            </Button>
          )}
          {isStaff && reservationIsEditable && reservation.state === 'requested' && (
            <Button
              bsStyle="success"
              className={fontSize}
              disabled={disabled}
              onClick={onConfirmClick}
            >
              {t('ReservationInfoModal.confirmButton')}
            </Button>
          )}
          {showCancelButton && (
            <Button
              bsStyle="danger"
              className={fontSize}
              disabled={disabled}
              onClick={onCancelClick}
            >
              {t('ReservationInfoModal.cancelButton')}
            </Button>
          )}
        </Modal.Footer>
        <ReservationCancelModal />
      </Modal>
    );
  }
}

ReservationInfoModal.propTypes = {
  contrast: PropTypes.string.isRequired,
  currentLanguage: PropTypes.string.isRequired,
  fontSize: PropTypes.string.isRequired,
  hideReservationInfoModal: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isLargerFontSize: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  onCancelEditClick: PropTypes.func.isRequired,
  onConfirmClick: PropTypes.func.isRequired,
  onDenyClick: PropTypes.func.isRequired,
  onEditFormSubmit: PropTypes.func.isRequired,
  onSaveCommentsClick: PropTypes.func.isRequired,
  onStartEditClick: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired,
  reservationIsEditable: PropTypes.bool.isRequired,
  resource: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ReservationInfoModal);
