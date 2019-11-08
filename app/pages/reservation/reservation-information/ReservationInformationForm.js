import constants from 'constants/AppConstants';
import FormTypes from 'constants/FormTypes';

import includes from 'lodash/includes';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import Well from 'react-bootstrap/lib/Well';
import { Field, reduxForm } from 'redux-form';
import isEmail from 'validator/lib/isEmail';


import ReduxFormField from 'shared/form-fields/ReduxFormField';
import TermsField from 'shared/form-fields/TermsField';
import { injectT } from 'i18n';
import ReservationTermsModal from 'shared/modals/reservation-terms';
import WrappedText from 'shared/wrapped-text/WrappedText';

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

class UnconnectedReservationInformationForm extends Component {
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

  renderTermsField(name) {
    const { openResourceTermsModal, t } = this.props;
    const label = t('ReservationInformationForm.termsAndConditionsLabel');
    const labelLink = `${t('ReservationInformationForm.termsAndConditionsLink')}`;
    return (
      <Field
        component={TermsField}
        key={name}
        label={label}
        labelLink={labelLink}
        name={name}
        onClick={openResourceTermsModal}
      />
    );
  }

  render() {
    const {
      isEditing,
      isMakingReservations,
      handleSubmit,
      onBack,
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
          { includes(this.props.fields, 'reserverName') && (
            <h3 className="reservationers-Info">{t('ReservationInformationForm.reserverInformationTitle')}</h3>
          )}
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
            t('common.reserverIdLabel'),
            { placeholder: t('common.reserverIdLabel') }
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
          {includes(this.props.fields, 'reserverAddressStreet')
            && this.renderField(
              'reserverAddressStreet',
              'address',
              'text',
              t('common.addressStreetLabel'),
              { autoComplete: 'street-address' },
            )}
          {includes(this.props.fields, 'reserverAddressZip')
            && this.renderField(
              'reserverAddressZip',
              'zip',
              'text',
              t('common.addressZipLabel'),
              { autoComplete: 'postal-code' },
            )}
          {includes(this.props.fields, 'reserverAddressCity')
            && this.renderField(
              'reserverAddressCity',
              'city',
              'text',
              t('common.addressCityLabel'),
              { autoComplete: 'address-level2' },
            )
          }
          {includes(this.props.fields, 'billingAddressStreet')
            && <h3>{t('common.billingAddressLabel')}</h3>
          }
          {includes(this.props.fields, 'billingAddressStreet')
            && this.renderField(
              'billingAddressStreet',
              'address',
              'text',
              t('common.addressStreetLabel'),
              { autoComplete: 'street-address' },
            )
          }
          {includes(this.props.fields, 'billingAddressZip')
            && this.renderField(
              'billingAddressZip',
              'zip',
              'text',
              t('common.addressZipLabel'),
              { autoComplete: 'postal-code' },
            )
          }
          {includes(this.props.fields, 'billingAddressCity')
            && this.renderField(
              'billingAddressCity',
              'city',
              'text',
              t('common.addressCityLabel'),
              { autoComplete: 'address-level2' },
            )
          }
          {(includes(this.props.fields, 'eventSubject')
          || includes(this.props.fields, 'eventDescription')
          || includes(this.props.fields, 'numberofParticipants')
          || includes(this.props.fields, 'requireAssistance')
          || includes(this.props.fields, 'comments'))
          && <h3 className="ReservationInformationForm">{t('ReservationInformationForm.eventInformationTitle')}</h3>
        }
          {this.renderField(
            'eventSubject',
            'eventSubject',
            'text',
            t('common.eventSubjectLabel'),
            {},
            null,
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
          {includes(this.props.fields, 'reservationExtraQuestions')
            && <h3 id="additional-info-heading">{t('common.additionalInfo.heading')}</h3>
          }
          {includes(this.props.fields, 'reservationExtraQuestions')
            && (
            <WrappedText
              allowNamedLinks
              id="additional-info-paragraph"
              openLinksInNewTab
              text={resource.reservationAdditionalInformation}
            />
            )
          }
          {this.renderField(
            'reservationExtraQuestions',
            'reservationExtraQuestions',
            'textarea',
            t('common.additionalInfo.label'),
            {
              rows: 5,
            }
          )}
          {termsAndConditions
            && this.renderTermsField('termsAndConditions')
          }
          <div className="form-controls">
            <Button
              bsStyle="warning"
              onClick={onCancel}
            >
              {isEditing ? t('ReservationInformationForm.cancelEdit') : t('common.cancel')}
            </Button>
            {isEditing
              && (
              <Button
                bsStyle="default"
                onClick={onBack}
              >
                {t('common.previous')}
              </Button>
              )
            }
            <Button
              bsStyle="primary"
              disabled={isMakingReservations}
              type="submit"
            >
              {isMakingReservations ? t('common.saving') : t('common.save')}
            </Button>
          </div>
        </Form>
        <ReservationTermsModal resource={resource} />
      </div>
    );
  }
}

UnconnectedReservationInformationForm.propTypes = {
  fields: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  openResourceTermsModal: PropTypes.func.isRequired,
  requiredFields: PropTypes.array.isRequired,
  resource: PropTypes.object.isRequired,
  staffEventSelected: PropTypes.bool,
  t: PropTypes.func.isRequired,
  termsAndConditions: PropTypes.string.isRequired,
};
UnconnectedReservationInformationForm = injectT(UnconnectedReservationInformationForm);  // eslint-disable-line

export { UnconnectedReservationInformationForm };
export default injectT(reduxForm({
  form: FormTypes.RESERVATION,
  enableReinitialize: true,
  validate,
})(UnconnectedReservationInformationForm));
