import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import first from 'lodash/first';
import last from 'lodash/last';
import orderBy from 'lodash/orderBy';

import {
  deleteReservation, postReservation, postRecurringReservations, putReservation
} from 'actions/reservationActions';
import {
  cancelReservationEdit,
  closeConfirmReservationModal,
  openConfirmReservationModal,
} from 'actions/uiActions';
import recurringReservationsConnector from 'state/recurringReservations';
import ConfirmReservationModal from './ConfirmReservationModal';
import reservationConfirmationSelector from './reservationConfirmationSelector';

export class UnconnectedReservationConfirmationContainer extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    confirmReservationModalIsOpen: PropTypes.bool.isRequired,
    currentLanguage: PropTypes.string.isRequired,
    isMakingReservations: PropTypes.bool.isRequired,
    isStaff: PropTypes.bool.isRequired,
    params: PropTypes.shape({ // eslint-disable-line react/no-unused-prop-types
      id: PropTypes.string.isRequired,
    }).isRequired,
    recurringReservations: PropTypes.array.isRequired,
    reservationsToEdit: PropTypes.array.isRequired,
    resource: PropTypes.object.isRequired,
    showTimeControls: PropTypes.bool,
    selectedReservations: PropTypes.array.isRequired,
    staffEventSelected: PropTypes.bool,
    timeSlots: PropTypes.array,
    reservationType: PropTypes.string,
  };

  handleEdit = (values = {}) => {
    const { actions, reservationsToEdit } = this.props;

    // old reservation values before editing
    const oldValues = Object.assign({}, reservationsToEdit[0]);
    // new reservation values from each field
    const newValues = Object.assign({}, values);
    // if value (string) was not previously empty and now is empty -> insert "-"
    for (let i = 0; i < Object.keys(newValues).length; i += 1) {
      const key = Object.keys(newValues)[i];
      if (typeof (oldValues[key]) === 'string' && oldValues[key].length > 0
      && typeof (values[key]) === 'string' && values[key].trim().length === 0) {
        newValues[key] = '-';
      }
    }

    actions.putReservation({
      ...oldValues,
      ...newValues,
    });
  }

  handleReservation = (values = {}) => {
    const {
      actions, currentLanguage, recurringReservations, resource, selectedReservations
    } = this.props;
    const orderedReservations = orderBy(selectedReservations, 'begin');
    const selectedReservation = Object.assign({}, first(orderedReservations));
    selectedReservation.end = last(orderedReservations).end;
    const mergedReservations = [selectedReservation];
    const preferredLanguage = currentLanguage;


    if (recurringReservations.length > 0) {
      const reservationStack = [...mergedReservations, ...recurringReservations];

      actions.postRecurringReservations({
        reservationStack,
        ...values,
        preferredLanguage,
        resource: resource.id
      });
    } else {
      [...mergedReservations, ...recurringReservations].forEach((reservation) => {
        actions.postReservation({
          ...reservation,
          ...values,
          preferredLanguage,
          resource: resource.id,
        });
      });
    }
  }

  render() {
    const {
      actions,
      confirmReservationModalIsOpen,
      isMakingReservations,
      isStaff,
      recurringReservations,
      reservationsToEdit,
      resource,
      selectedReservations,
      showTimeControls,
      staffEventSelected,
      timeSlots,
      reservationType,
    } = this.props;

    const isEditing = Boolean(reservationsToEdit.length);

    return (
      <ConfirmReservationModal
        isEditing={isEditing}
        isMakingReservations={isMakingReservations}
        isPreliminaryReservation={resource.needManualConfirmation}
        isStaff={isStaff}
        onCancel={actions.cancelReservationEdit}
        onClose={actions.closeConfirmReservationModal}
        onConfirm={isEditing ? this.handleEdit : this.handleReservation}
        onRemoveReservation={actions.removeReservation}
        recurringReservations={recurringReservations}
        reservationsToEdit={reservationsToEdit}
        reservationType={reservationType}
        resource={resource}
        selectedReservations={selectedReservations}
        show={confirmReservationModalIsOpen}
        showTimeControls={showTimeControls}
        staffEventSelected={staffEventSelected}
        timeSlots={timeSlots}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    cancelReservationEdit,
    closeConfirmReservationModal,
    deleteReservation,
    openConfirmReservationModal,
    postReservation,
    postRecurringReservations,
    putReservation,
    removeReservation: recurringReservationsConnector.removeReservation,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationConfirmationSelector, mapDispatchToProps)(
  UnconnectedReservationConfirmationContainer
);
