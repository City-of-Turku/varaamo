import constants from 'constants/AppConstants';

import pick from 'lodash/pick';
import uniq from 'lodash/uniq';
import camelCase from 'lodash/camelCase';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Col from 'react-bootstrap/lib/Col';

import { injectT } from 'i18n';
import { isStaffEvent, hasPayment, hasProducts } from 'utils/reservationUtils';
import { getTermsAndConditions, getPaymentTermsAndConditions } from 'utils/resourceUtils';
import ReservationInformationForm from './ReservationInformationForm';
import ReservationDetails from '../reservation-details/ReservationDetails';

class ReservationInformation extends Component {
  static propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    isMakingReservations: PropTypes.bool.isRequired,
    isStaff: PropTypes.bool.isRequired,
    onBack: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    openResourceTermsModal: PropTypes.func.isRequired,
    openResourcePaymentTermsModal: PropTypes.func.isRequired,
    order: PropTypes.object.isRequired,
    reservation: PropTypes.object,
    resource: PropTypes.object.isRequired,
    selectedTime: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    unit: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  };

  onConfirm = (values) => {
    const { onConfirm } = this.props;
    onConfirm(values);
  }

  getFormFields = (termsAndConditions) => {
    const {
      isAdmin,
      isStaff,
      resource,
      order,
    } = this.props;

    /*
      When reservation has no payment i.e. order total is 0e, remove billing fields.
      Respa doesn't require billing fields when reservation doesn't contain an order
      even if billing fields are marked as required for the resource.
    */
    const filtered = [...resource.supportedReservationExtraFields].filter((field) => {
      if (!hasPayment(order)) {
        return !constants.RESERVATION_BILLING_FIELDS.includes(field);
      }
      return true;
    });

    const formFields = filtered.map(value => camelCase(value));


    if (isAdmin) {
      formFields.push('comments');

      /* waiting for backend implementation */
      // formFields.push('reserverName');
      // formFields.push('reserverEmailAddress');
      // formFields.push('reserverPhoneNumber');
    }

    if (resource.needManualConfirmation && isStaff) {
      formFields.push('staffEvent');
    }

    if (termsAndConditions) {
      formFields.push('termsAndConditions');
    }

    if (hasProducts(resource)) {
      formFields.push('paymentTermsAndConditions');
    }

    return uniq(formFields);
  }

  getFormInitialValues = () => {
    const {
      isEditing,
      reservation,
      resource,
    } = this.props;

    let rv = {};

    if (reservation) {
      // Dont allow fields with objects unless the objects have key id in them.
      // The keys can be used as form field values eg for select input
      const nonObjectFields = this.getFormFields().filter(field => typeof (reservation[field]) !== 'object');

      const objectFieldsWithId = this.getFormFields().filter(
        field => (reservation[field] && typeof (reservation[field]) === 'object' && reservation[field].id)
      );

      rv = objectFieldsWithId.map((objectField) => {
        const obj = {};
        obj[objectField] = reservation[objectField].id;
        return obj;
      });

      rv = Object.assign(...rv, pick(reservation, [...nonObjectFields]));
    }
    if (isEditing) {
      rv = { ...rv, staffEvent: isStaffEvent(reservation, resource) };
    }
    if (!reservation) {
      rv = this.getFormInitialValuesFromUser();
    }
    return rv;
  }

  getFormInitialValuesFromUser = () => {
    const { user } = this.props;
    if (user.displayName || user.email) {
      return {
        reserverName: user.displayName ? (user.displayName) : (undefined),
        reserverEmailAddress: user.email ? (user.email) : (undefined)
      };
    }
    return {};
  }

  getRequiredFormFields(resource, termsAndConditions) {
    const requiredFormFields = [...resource.requiredReservationExtraFields.map(
      field => camelCase(field)
    )];

    if (termsAndConditions) {
      requiredFormFields.push('termsAndConditions');
    }

    if (hasProducts(resource)) {
      requiredFormFields.push('paymentTermsAndConditions');
    }

    return requiredFormFields;
  }

  renderInfoTexts = () => {
    const { resource, t } = this.props;
    if (!resource.needManualConfirmation) return null;

    return (
      <div className="app-ReservationInformation__info-texts">
        <p>{t('ConfirmReservationModal.priceInfo')}</p>
        <p>{t('ConfirmReservationModal.formInfo')}</p>
      </div>
    );
  }

  render() {
    const {
      isEditing,
      isMakingReservations,
      onBack,
      onCancel,
      openResourceTermsModal,
      openResourcePaymentTermsModal,
      order,
      resource,
      selectedTime,
      t,
      unit,
      user,
    } = this.props;

    const termsAndConditions = getTermsAndConditions(resource);
    const paymentTermsAndConditions = getPaymentTermsAndConditions(resource);

    return (
      <div className="app-ReservationInformation">
        <h2 className="visually-hidden reservationInformation__Header">{t('ReservationPhase.informationTitle')}</h2>
        <Col lg={8} sm={12}>
          {this.renderInfoTexts()}
          <ReservationInformationForm
            fields={this.getFormFields(termsAndConditions)}
            hasPayment={!isEditing && hasPayment(order)}
            initialValues={this.getFormInitialValues()}
            isEditing={isEditing}
            isMakingReservations={isMakingReservations}
            onBack={onBack}
            onCancel={onCancel}
            onConfirm={this.onConfirm}
            openResourcePaymentTermsModal={openResourcePaymentTermsModal}
            openResourceTermsModal={openResourceTermsModal}
            paymentTermsAndConditions={paymentTermsAndConditions}
            requiredFields={this.getRequiredFormFields(resource, termsAndConditions)}
            resource={resource}
            termsAndConditions={termsAndConditions}
            user={user}
          />
        </Col>
        <Col lg={4} sm={12}>
          <ReservationDetails
            orderPrice={(hasProducts(resource) && order && order.price) ? `${order.price} €` : ''}
            resourceName={resource.name}
            selectedTime={selectedTime}
            unitName={unit.name}
          />
        </Col>
      </div>
    );
  }
}

export default injectT(ReservationInformation);
