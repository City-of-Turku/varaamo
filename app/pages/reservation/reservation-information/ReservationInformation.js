
import pick from 'lodash/pick';
import uniq from 'lodash/uniq';
import camelCase from 'lodash/camelCase';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Col from 'react-bootstrap/lib/Col';

import constants from 'constants/AppConstants';
import { injectT } from 'i18n';
import {
  isStaffEvent, hasPayment, hasProducts
} from 'utils/reservationUtils';
import {
  getTermsAndConditions, getPaymentTermsAndConditions, getResourceCustomerGroupName
} from 'utils/resourceUtils';
import ReservationInformationForm from './ReservationInformationForm';
import ReservationDetails from '../reservation-details/ReservationDetails';

class ReservationInformation extends Component {
  static propTypes = {
    currentCustomerGroup: PropTypes.string.isRequired,
    currentPaymentMethod: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    isStaff: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    isMakingReservations: PropTypes.bool.isRequired,
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
    reservationType: PropTypes.string,
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
      reservation,
    } = this.props;

    /*
      When reservation has no payment i.e. order total is 0e, remove billing fields.
      Respa doesn't require billing fields when reservation doesn't contain an order
      even if billing fields are marked as required for the resource.
    */
    const filtered = [...resource.supportedReservationExtraFields].filter((field) => {
      if (!hasPayment(order) && !(reservation && hasPayment(reservation.order))) {
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

    /* Field hidden until it is needed again
    if (resource.needManualConfirmation && isStaff) {
      formFields.push('staffEvent');
    }
    */
    if (isStaff) {
      formFields.push('type');
    }

    if (termsAndConditions) {
      formFields.push('termsAndConditions');
    }
    if (resource.universalField && resource.universalField.length) {
      // resource.universalField.forEach(val => formFields.push(`universalData-${val.id}`));
      // TODO: atm only works with one field, change to above to support multiple ones.
      formFields.push('universalData');
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

      // TODO: change to field.includes('universalData') for multiple universal fields
      // can contain multiple universal fields.
      // ['universalData'] if reservation contains universalData key
      const universalDataFields = this.getFormFields().filter(field => typeof reservation[field] === 'object' && field === 'universalData');
      nonObjectFields.push(...universalDataFields);
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
      rv = { ...rv, type: constants.RESERVATION_TYPE.NORMAL_VALUE };
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

  getRequiredFormFields(
    resource, termsAndConditions, paymentTermsAndConditions, hasPayments = false, reservationType) {
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

    if (paymentTermsAndConditions && hasPayments) {
      requiredFormFields.push('paymentTermsAndConditions');
    }

    return requiredFormFields;
  }

  renderInfoTexts = () => {
    const { resource, t } = this.props;
    return (
      <div className="app-ReservationInformation__info-texts">
        <p>{t('common.contactPurposeHelp')}</p>
        {resource.needManualConfirmation && (
          <React.Fragment>
            <p>{t('ConfirmReservationModal.priceInfo')}</p>
            <p>{t('ConfirmReservationModal.formInfo')}</p>
          </React.Fragment>
        )}
        {!resource.needManualConfirmation && (
          <p>{t('common.starFieldsAreRequired')}</p>
        )}
      </div>
    );
  }

  render() {
    const {
      currentCustomerGroup,
      currentPaymentMethod,
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
      reservationType,
    } = this.props;

    const termsAndConditions = getTermsAndConditions(resource);
    const paymentTermsAndConditions = getPaymentTermsAndConditions(resource);
    const customerGroupName = currentCustomerGroup ? getResourceCustomerGroupName(resource, currentCustomerGroup) : '';
    const paymentMethod = currentPaymentMethod ? t(`common.paymentMethod.${currentPaymentMethod}`) : '';
    const orderAndPriceExist = hasProducts(resource) && order && order.price;

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
            requiredFields={this.getRequiredFormFields(
              resource, termsAndConditions, paymentTermsAndConditions,
              hasPayment(order), reservationType)}
            reservationType={reservationType}
            resource={resource}
            termsAndConditions={termsAndConditions}
            user={user}
          />
        </Col>
        <Col lg={4} sm={12}>
          <ReservationDetails
            customerGroupName={customerGroupName}
            orderPrice={orderAndPriceExist ? `${order.price} €` : ''}
            paymentMethod={orderAndPriceExist ? paymentMethod : ''}
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
