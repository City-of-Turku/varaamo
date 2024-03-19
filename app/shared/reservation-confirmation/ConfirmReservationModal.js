import first from 'lodash/first';
import last from 'lodash/last';
import orderBy from 'lodash/orderBy';
import pick from 'lodash/pick';
import uniq from 'lodash/uniq';
import camelCase from 'lodash/camelCase';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Modal from 'react-bootstrap/lib/Modal';

import CompactReservationList from 'shared/compact-reservation-list';
import RecurringReservationControls from 'shared/recurring-reservation-controls';
import { injectT } from 'i18n';
import { isStaffEvent } from 'utils/reservationUtils';
import { getTermsAndConditions } from 'utils/resourceUtils';
import ReservationForm from './ReservationForm';
import constants from '../../constants/AppConstants';

class ConfirmReservationModal extends Component {
  static propTypes = {
    isEditing: PropTypes.bool.isRequired,
    isMakingReservations: PropTypes.bool.isRequired,
    isPreliminaryReservation: PropTypes.bool.isRequired,
    isStaff: PropTypes.bool.isRequired,
    isStaffForResource: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onRemoveReservation: PropTypes.func.isRequired,
    recurringReservations: PropTypes.array.isRequired,
    reservationsToEdit: PropTypes.array.isRequired,
    resource: PropTypes.object.isRequired,
    selectedReservations: PropTypes.array.isRequired,
    show: PropTypes.bool.isRequired,
    showTimeControls: PropTypes.bool,
    staffEventSelected: PropTypes.bool,
    t: PropTypes.func.isRequired,
    timeSlots: PropTypes.array,
    reservationType: PropTypes.string,
  };

  onConfirm = (values) => {
    const { onClose, onConfirm } = this.props;
    onClose();
    onConfirm(values);
  }

  getFormFields = (termsAndConditions) => {
    const {
      isStaff,
      isStaffForResource,
      resource,
      showTimeControls,
    } = this.props;
    const formFields = [...resource.supportedReservationExtraFields].map(value => camelCase(value));

    if (showTimeControls) {
      formFields.push('begin', 'end');
    }

    // general 'is_staff' perm, not tied to unit perms
    if (isStaff) {
      formFields.push('comments');
      formFields.push('reserverName');
      formFields.push('reserverEmailAddress');
      formFields.push('reserverPhoneNumber');
    }
    // unit staff check
    if (isStaffForResource) {
      formFields.push('type');
    }
    if (resource.universalField && resource.universalField.length) {
      // resource.universalField.forEach(val => formFields.push(`universalData-${val.id}`));
      // TODO: atm only works with one field, change to above to support multiple ones.
      formFields.push('universalData');
    }

    /* Field hidden until it is needed again
    if (resource.needManualConfirmation && isStaff) {
      formFields.push('staffEvent');
    }
    */

    if (termsAndConditions) {
      formFields.push('termsAndConditions');
    }

    return uniq(formFields);
  }

  getFormInitialValues = () => {
    const {
      isEditing,
      reservationsToEdit,
      resource,
      selectedReservations,
    } = this.props;
    let reservation;

    if (isEditing) {
      reservation = reservationsToEdit.length ? reservationsToEdit[0] : null;
    } else {
      const orderedSelected = orderBy(selectedReservations, 'begin');
      const firstReservation = first(orderedSelected);
      const lastReservation = last(orderedSelected);
      const endReservation = lastReservation ? { end: lastReservation.end } : {};
      reservation = firstReservation ? Object.assign({}, firstReservation, endReservation) : null;
    }

    let rv = reservation ? pick(reservation, this.getFormFields()) : {};
    if (isEditing) {
      rv = { ...rv, staffEvent: isStaffEvent(reservation, resource) };
    } else {
      rv = { ...rv, type: constants.RESERVATION_TYPE.NORMAL_VALUE };
    }
    return rv;
  }

  getModalTitle(isEditing, isPreliminaryReservation, t) {
    if (isEditing) {
      return t('ConfirmReservationModal.editTitle');
    }
    if (isPreliminaryReservation) {
      return t('ConfirmReservationModal.preliminaryReservationTitle');
    }
    return t('ConfirmReservationModal.regularReservationTitle');
  }

  getRequiredFormFields(resource, termsAndConditions, reservationType) {
    if (reservationType === constants.RESERVATION_TYPE.BLOCKED_VALUE) {
      return [];
    }
    const requiredFormFields = [...resource.requiredReservationExtraFields.map(
      field => camelCase(field)
    )];

    if (resource.universalField && resource.universalField.length) {
      requiredFormFields.push('universalData');
    }

    if (termsAndConditions) {
      requiredFormFields.push('termsAndConditions');
    }

    return requiredFormFields;
  }

  handleCancel = () => {
    const { onCancel, onClose } = this.props;
    onCancel();
    onClose();
  }

  renderEditingTexts = () => {
    const { reservationsToEdit, t } = this.props;
    return (
      <div className="app-ConfirmReservationModal__editing-texts">
        <p>{t('ConfirmReservationModal.beforeText')}</p>
        <CompactReservationList reservations={reservationsToEdit} />
      </div>
    );
  }

  renderReservationTimes = () => {
    const {
      isPreliminaryReservation,
      onRemoveReservation,
      recurringReservations,
      selectedReservations,
      t,
    } = this.props;

    const reservationsCount = selectedReservations.length + recurringReservations.length;
    const introText = isPreliminaryReservation
      ? t('ConfirmReservationModal.preliminaryReservationText', { reservationsCount })
      : t('ConfirmReservationModal.regularReservationText', { reservationsCount });

    return (
      <div>
        <p><strong>{introText}</strong></p>
        <CompactReservationList
          onRemoveClick={onRemoveReservation}
          removableReservations={recurringReservations}
          reservations={selectedReservations}
        />
      </div>
    );
  }

  renderInfoTexts = () => {
    const { isPreliminaryReservation, t } = this.props;
    if (!isPreliminaryReservation) return null;

    return (
      <div>
        <p>{t('ConfirmReservationModal.priceInfo')}</p>
        <p>{t('ConfirmReservationModal.formInfo')}</p>
      </div>
    );
  }

  render() {
    const {
      isStaff,
      isEditing,
      isMakingReservations,
      isPreliminaryReservation,
      onClose,
      resource,
      show,
      showTimeControls,
      staffEventSelected,
      t,
      timeSlots,
      reservationType,
    } = this.props;

    const termsAndConditions = isStaff ? '' : getTermsAndConditions(resource);
    const maxReservationPeriod = isStaff ? null : resource.maxPeriod;

    return (
      <Modal
        animation={false}
        backdrop="static"
        className="app-ConfirmReservationModal modal-city-theme"
        onHide={onClose}
        show={show}
      >
        <Modal.Header closeButton closeLabel={t('ModalHeader.closeButtonText')}>
          <Modal.Title>
            {this.getModalTitle(isEditing, isPreliminaryReservation, t)}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {isStaff && !showTimeControls && <RecurringReservationControls />}
          {isEditing && this.renderEditingTexts()}
          {!showTimeControls && this.renderReservationTimes()}
          {this.renderInfoTexts()}
          <ReservationForm
            fields={this.getFormFields(termsAndConditions)}
            initialValues={this.getFormInitialValues()}
            isEditing={isEditing}
            isMakingReservations={isMakingReservations}
            maxReservationPeriod={maxReservationPeriod}
            onCancel={this.handleCancel}
            onConfirm={this.onConfirm}
            requiredFields={
              this.getRequiredFormFields(resource, termsAndConditions, reservationType)}
            resource={resource}
            staffEventSelected={staffEventSelected}
            termsAndConditions={termsAndConditions}
            timeSlots={timeSlots}
          />
        </Modal.Body>
      </Modal>
    );
  }
}

export default injectT(ConfirmReservationModal);
