import constants from 'constants/AppConstants';
import FormTypes from 'constants/FormTypes';

import includes from 'lodash/includes';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Well from 'react-bootstrap/lib/Well';
import { Field, Fields, reduxForm } from 'redux-form';
import isEmail from 'validator/lib/isEmail';


import WrappedText from 'shared/wrapped-text';
import ReduxFormField from 'shared/form-fields/ReduxFormField';
import { injectT } from 'i18n';
import TimeControls from './TimeControls';

const validators = {
  reserverEmailAddress: (t, { reserverEmailAddress }) => {
    if (reserverEmailAddress && !isEmail(reserverEmailAddress)) {
      return t('ReservationForm.emailError');
    }
    return null;
  },
  numberOfParticipants: (t, { numberOfParticipants }, resource) => {
    if (numberOfParticipants) {
      // Give error when numbers are too high //
      if (numberOfParticipants > resource.peopleCapacity) {
        return t('ReservationForm.numberOfParticipants.overError', { peopleCapacity: resource.peopleCapacity });
      }
      // Give error if negative number is used //
      if (numberOfParticipants < 1) {
        return t('ReservationForm.numberOfParticipants.underError');
      }
      // Give error if decimal is used //
      const number = (Number(numberOfParticipants));
      if (!Number.isInteger(number)) {
        return t('ReservationForm.numberOfParticipants.decimalError');
      }
    }
    return null;
  },
};

const maxLengths = {
  billingAddressCity: 100,
  billingAddressStreet: 100,
  billingAddressZip: 30,
  comments: 256,
  company: 100,
  eventDescription: 256,
  numberOfParticipants: 100,
  reservationExtraQuestions: 256,
  reserverAddressCity: 100,
  reserverAddressStreet: 100,
  reserverAddressZip: 30,
  reserverEmailAddress: 100,
  reserverId: 30,
  reserverName: 100,
  reserverPhoneNumber: 30,
};

export function validate(values, {
  fields, requiredFields, t, resource,
}) {
  const errors = {};
  const currentRequiredFields = values.staffEvent
    ? constants.REQUIRED_STAFF_EVENT_FIELDS
    : requiredFields;
  fields.forEach((field) => {
    const validator = validators[field];
    if (validator) {
      const error = validator(t, values, resource);
      if (error) {
        errors[field] = error;
      }
    }
    if (maxLengths[field]) {
      if (values[field] && values[field].length > maxLengths[field]) {
        errors[field] = t('ReservationForm.maxLengthError', { maxLength: maxLengths[field] });
      }
    }
    if (includes(currentRequiredFields, field)) {
      // required fields cant be empty or have only white space in them
      if (!values[field] || (typeof (values[field]) === 'string' && values[field].trim().length === 0)) {
        errors[field] = (
          field === 'termsAndConditions'
            ? t('ReservationForm.termsAndConditionsError')
            : t('ReservationForm.requiredError')
        );
      }
    }
  });
  return errors;
}

class UnconnectedReservationForm extends Component {
  // name is required by the Field component and is used to point to field's value.
  // fieldName is the actual html attribute name which is used for autocomplete etc.
  renderField(
    name, fieldName, type, label, controlProps = {}, help = null, info = null, altCheckbox = false
  ) {
    const { t } = this.props;
    if (!includes(this.props.fields, name)) {
      return null;
    }
    const isRequired = includes(this.requiredFields, name);

    return (
      <Field
        altCheckbox={altCheckbox}
        component={ReduxFormField}
        controlProps={controlProps}
        help={help}
        info={info}
        label={`${label}${isRequired ? '*' : ''}`}
        labelErrorPrefix={t('common.checkError')}
        name={name}
        props={{ fieldName }}
        type={type}
      />
    );
  }

  renderTimeControls = () => {
    const {
      fields, maxReservationPeriod, t, timeSlots
    } = this.props;
    if (!includes(fields, 'begin') || !includes(fields, 'end')) {
      return null;
    }

    return (
      <FormGroup id="reservation-time">
        <Col sm={3}>
          <ControlLabel>{t('common.reservationTimeLabel')}</ControlLabel>
        </Col>
        <Col sm={9}>
          <Fields
            component={TimeControls}
            maxReservationPeriod={maxReservationPeriod}
            names={['begin', 'end']}
            timeSlots={timeSlots}
          />
        </Col>
      </FormGroup>
    );
  }

  render() {
    const {
      isEditing,
      isMakingReservations,
      handleSubmit,
      onCancel,
      onConfirm,
      requiredFields,
      resource,
      staffEventSelected,
      t,
      termsAndConditions,
    } = this.props;

    this.requiredFields = staffEventSelected
      ? constants.REQUIRED_STAFF_EVENT_FIELDS
      : requiredFields;

    return (
      <div>
        <Form className="reservation-form" horizontal onSubmit={handleSubmit(onConfirm)}>
          {this.renderTimeControls()}
          { includes(this.props.fields, 'staffEvent') && (
            <Well>
              {this.renderField(
                'staffEvent',
                'staffEvent',
                'checkbox',
                t('ReservationForm.staffEventLabel'),
                {},
                t('ReservationForm.staffEventHelp'),
              )}
            </Well>
          )}
          {this.renderField(
            'eventSubject',
            'eventSubject',
            'text',
            t('common.eventSubjectLabel'),
            {},
            null,
            t('ReservationForm.eventSubjectInfo'),
          )}
          {this.renderField(
            'reserverName',
            'name',
            'text',
            t('common.reserverNameLabel'),
            { autoComplete: 'name' },
          )}
          {this.renderField(
            'reserverId',
            'reserverId',
            'text',
            t('common.reserverIdLabel')
          )}
          {this.renderField(
            'reserverPhoneNumber',
            'phone',
            'text',
            t('common.reserverPhoneNumberLabel'),
            { autoComplete: 'tel' }
          )}
          {this.renderField(
            'reserverEmailAddress',
            'email',
            'email',
            t('common.reserverEmailAddressLabel'),
            { autoComplete: 'email' }
          )}
          {this.renderField(
            'eventDescription',
            'eventDescription',
            'textarea',
            t('common.eventDescriptionLabel'),
            { rows: 5 }
          )}
          {this.renderField(
            'numberOfParticipants',
            'numberOfParticipants',
            'number',
            t('common.numberOfParticipantsLabel'),
            { min: '1', max: resource.peopleCapacity }
          )}
          {this.renderField(
            'requireAssistance',
            'requireAssistance',
            'checkbox',
            t('common.requireAssistanceLabel'),
            {},
            null,
            null,
            true
          )}
          {this.renderField(
            'requireWorkstation',
            'requireWorkstation',
            'checkbox',
            t('common.requireWorkstationLabel'),
            {},
            null,
            null,
            true
          )}
          {includes(this.props.fields, 'reservationExtraQuestions') && (
            <Well>
              <p id="additional-info-heading">{t('common.additionalInfo.heading')}</p>
              <WrappedText
                allowNamedLinks
                id="additional-info-paragraph"
                openLinksInNewTab
                text={resource.reservationAdditionalInformation}
              />
              {this.renderField(
                'reservationExtraQuestions',
                'reservationExtraQuestions',
                'textarea',
                t('common.additionalInfo.label'),
                { rows: 5 }
              )}
            </Well>
          )}
          {includes(this.props.fields, 'reserverAddressStreet') && (
            <Well>
              <p>{t('common.reserverAddressLabel')}</p>
              {this.renderField(
                'reserverAddressStreet',
                'address',
                'text',
                t('common.addressStreetLabel'),
                { autoComplete: 'street-address' },
              )}
              {this.renderField(
                'reserverAddressZip',
                'zip',
                'text',
                t('common.addressZipLabel'),
                { autoComplete: 'postal-code' },
              )}
              {this.renderField(
                'reserverAddressCity',
                'city',
                'text',
                t('common.addressCityLabel'),
                { autoComplete: 'address-level2' },
              )}
            </Well>
          )}
          {includes(this.props.fields, 'billingAddressStreet') && (
            <Well>
              <p>{t('common.billingAddressLabel')}</p>
              {this.renderField(
                'billingAddressStreet',
                'address',
                'text',
                t('common.addressStreetLabel'),
                { autoComplete: 'street-address' },
              )}
              {this.renderField(
                'billingAddressZip',
                'zip',
                'text',
                t('common.addressZipLabel'),
                { autoComplete: 'postal-code' },
              )}
              {this.renderField(
                'billingAddressCity',
                'city',
                'text',
                t('common.addressCityLabel'),
                { autoComplete: 'address-level2' },
              )}
            </Well>
          )}
          {this.renderField(
            'comments',
            'comments',
            'textarea',
            t('common.commentsLabel'),
            {
              placeholder: t('common.commentsPlaceholder'),
              rows: 5,
            }
          )}
          {termsAndConditions && (
            <div className="terms-and-conditions">
              <h5>{t('ReservationForm.termsAndConditionsHeader')}</h5>
              <WrappedText allowNamedLinks openLinksInNewTab text={termsAndConditions} />
            </div>
          )}
          {termsAndConditions && (
            <Well className="terms-and-conditions-input-wrapper">
              {this.renderField(
                'termsAndConditions',
                'termsAndConditions',
                'checkbox',
                t('ReservationForm.termsAndConditionsLabel'),
              )}
            </Well>
          )}
          <div className="form-controls">
            <Button
              bsStyle="default"
              onClick={onCancel}
            >
              {isEditing ? t('common.cancel') : t('common.back')}
            </Button>
            <Button
              bsStyle="primary"
              disabled={isMakingReservations}
              type="submit"
            >
              {isMakingReservations ? t('common.saving') : t('common.save')}
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

UnconnectedReservationForm.propTypes = {
  fields: PropTypes.array.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  maxReservationPeriod: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  requiredFields: PropTypes.array.isRequired,
  resource: PropTypes.object.isRequired,
  staffEventSelected: PropTypes.bool,
  t: PropTypes.func.isRequired,
  termsAndConditions: PropTypes.string.isRequired,
  timeSlots: PropTypes.array,
};
UnconnectedReservationForm = injectT(UnconnectedReservationForm);  // eslint-disable-line

export { UnconnectedReservationForm };
export default injectT(reduxForm({
  form: FormTypes.RESERVATION,
  validate,
})(UnconnectedReservationForm));
