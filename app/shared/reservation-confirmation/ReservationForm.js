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

import FormTypes from 'constants/FormTypes';
import constants from 'constants/AppConstants';
import { isValidPhoneNumber, normalizeUniversalFieldOptions } from 'utils/reservationUtils';
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
  reserverPhoneNumber: (t, { reserverPhoneNumber }) => {
    if (reserverPhoneNumber && !isValidPhoneNumber(reserverPhoneNumber)) {
      return t('ReservationForm.phoneNumberError');
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
    name, fieldName, type, label, controlProps = {}, help = null, info = null, altCheckbox = false,
    universalProps = undefined
  ) {
    const { t } = this.props;
    if (!includes(this.props.fields, name)) {
      return null;
    }
    const isRequired = includes(this.requiredFields, name);
    const opts = {};
    // field is from resource universalField
    if ((fieldName.includes('componenttype') || fieldName.includes('universalData')) && universalProps) {
      // TODO: currently only works for <select> elements
      // normalize values
      // eslint-disable-next-line max-len
      opts.normalize = value => (value.length ? ({ type, selectedOption: value, field: { ...universalProps } }) : null);
      // format displayed values
      opts.format = value => (value && typeof value === 'object' ? value.selectedOption : '');
      const fieldId = this.props.resource.universalField.find(
        field => field.label.includes(label)
      ).id;
      // set random enough key, consists of universal-field id and field name.
      opts.key = `${fieldId}-${name}`;
      // TODO: find correct universalField object based on unique id instead of label string.
      opts.universalFieldData = {
        // find correct description text based on label
        description: this.props.resource.universalField.find(
          field => field.label.includes(label)
        ).description,
        // find correct data based on label
        data: this.props.resource.universalField.find(
          field => field.label.includes(label)
        ).data
      };
    }
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
        {...opts}
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

  renderUniversalField = () => {
    const { resource } = this.props;
    const elements = normalizeUniversalFieldOptions(resource.universalField, resource);
    return elements.map(element => this.renderField(
      element.name,
      element.fieldName,
      element.type,
      element.label,
      element.controlProps,
      null,
      null,
      false,
      element.universalProps
    ));
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
          )}
          {this.renderField(
            'reserverName',
            'name',
            'text',
            t('common.reserverNameLabel'),
            { autoComplete: 'name' },
          )}
          {this.renderField(
            'company',
            'company',
            'text',
            t('common.companyLabel'),
            {}
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
          {resource.universalField && resource.universalField.length > 0
            && this.renderUniversalField()
          }
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
          {this.renderField(
            'privateEvent',
            'privateEvent',
            'checkbox',
            t('common.privateEventLabel'),
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
          {(includes(this.props.fields, 'reserverAddressStreet') || includes(this.props.fields, 'homeMunicipality')) && (
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
              {this.renderField(
                'homeMunicipality',
                'municipality',
                'select',
                t('common.homeMunicipality'),
                { options: resource.includedReservationHomeMunicipalityFields },
              )}
            </Well>
          )}
          {(includes(this.props.fields, 'billingFirstName')
            || includes(this.props.fields, 'billingLastName')
            || includes(this.props.fields, 'billingPhoneNumber')
            || includes(this.props.fields, 'billingEmailAddress')
            || includes(this.props.fields, 'billingAddressStreet')
            || includes(this.props.fields, 'billingAddressZip')
            || includes(this.props.fields, 'billingAddressCity'))
            && (
            <Well id="billing-info-well">
              <p>{t('common.billingAddressLabel')}</p>
              {this.renderField(
                'billingFirstName',
                'cc-given-name',
                'text',
                t('common.billingFirstNameLabel'),
                { autoComplete: 'cc-given-name' },
              )}
              {this.renderField(
                'billingLastName',
                'cc-family-name',
                'text',
                t('common.billingLastNameLabel'),
                { autoComplete: 'cc-family-name' },
              )}
              {this.renderField(
                'billingPhoneNumber',
                'phone',
                'tel',
                t('common.billingPhoneNumberLabel'),
                { autoComplete: 'tel' },
              )}
              {this.renderField(
                'billingEmailAddress',
                'email',
                'email',
                t('common.billingEmailAddressLabel'),
                { autoComplete: 'email' },
              )}
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
