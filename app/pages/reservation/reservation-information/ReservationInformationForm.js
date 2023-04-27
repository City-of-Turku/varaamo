
import includes from 'lodash/includes';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import Well from 'react-bootstrap/lib/Well';
import { Field, reduxForm } from 'redux-form';
import isEmail from 'validator/lib/isEmail';

import FormTypes from 'constants/FormTypes';
import constants from 'constants/AppConstants';
import { isValidPhoneNumber, hasProducts, normalizeUniversalFieldOptions } from 'utils/reservationUtils';
import ReduxFormField from 'shared/form-fields/ReduxFormField';
import TermsField from 'shared/form-fields/TermsField';
import { injectT } from 'i18n';
import ReservationTermsModal from 'shared/modals/reservation-terms';
import WrappedText from 'shared/wrapped-text/WrappedText';
import ReservationSubmitButton from './ReservationSubmitButton';
import DatePickerMulti from 'shared/date-picker/DatePickerMulti';
import RecurringReservationControls from 'shared/recurring-reservation-controls/RecurringReservationControls';

const validators = {
  reserverEmailAddress: (t, { reserverEmailAddress }) => {
    if (reserverEmailAddress && !isEmail(reserverEmailAddress)) {
      return t('ReservationForm.emailError');
    }
    return null;
  },
  billingEmailAddress: (t, { billingEmailAddress }) => {
    if (billingEmailAddress && !isEmail(billingEmailAddress)) {
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
  billingPhoneNumber: (t, { billingPhoneNumber }) => {
    if (billingPhoneNumber && !isValidPhoneNumber(billingPhoneNumber)) {
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
  billingEmailAddress: 100,
  billingFirstName: 100,
  billingLastName: 100,
  billingPhoneNumber: 30,
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
      // TODO: doesn't work correctly, returns error msg but ReduxForm doesnt show it on field.
      const noUniversalSelectValue = field === 'universalData' && typeof values[field] === 'object' && values[field] && !values[field].selectedOption;
      // required fields cant be empty or have only white space in them
      if (!values[field] || (typeof (values[field]) === 'string' && values[field].trim().length === 0) || noUniversalSelectValue) {
        switch (field) {
          case 'termsAndConditions':
            errors[field] = t('ReservationForm.termsAndConditionsError');
            break;
          case 'paymentTermsAndConditions':
            errors[field] = t('ReservationForm.paymentTermsAndConditionsError');
            break;
          default:
            errors[field] = t('ReservationForm.requiredError');
            break;
        }
      }
    }
  });
  return errors;
}

class UnconnectedReservationInformationForm extends Component {
  // name is required by the Field component and is used to point to field's value.
  // fieldName is the actual html attribute name which is used for autocomplete etc.
  // eslint-disable-next-line react/sort-comp
  renderField(
    name, fieldName, type, label, controlProps = {}, help = null, info = null, altCheckbox = false,
    universalProps = undefined
  ) {
    const { t } = this.props;
    if (!includes(this.props.fields, name) && name !== 'universalData') {
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

  renderTermsField(name, isPayment = false) {
    const { t } = this.props;
    const label = t('ReservationInformationForm.termsAndConditionsLabel');
    const labelLink = isPayment ? `${t('ReservationInformationForm.paymentTermsAndConditionsLink')}`
      : `${t('ReservationInformationForm.termsAndConditionsLink')}`;

    const isRequired = includes(this.requiredFields, name);
    return (
      <Field
        component={TermsField}
        isRequired={isRequired}
        key={name}
        label={label}
        labelLink={labelLink}
        name={name}
        onClick={
          isPayment ? this.props.openResourcePaymentTermsModal : this.props.openResourceTermsModal
        }
      />
    );
  }

  renderUniversalFields() {
    const { resource } = this.props;
    return normalizeUniversalFieldOptions(resource.universalField, resource)
      .map(element => this.renderField(
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
      hasPayment,
      isEditing,
      isMakingReservations,
      handleSubmit,
      onBack,
      onCancel,
      onConfirm,
      requiredFields,
      resource,
      selectedTime,
      staffEventSelected,
      state,
      t,
      termsAndConditions,
      paymentTermsAndConditions,
    } = this.props;

    this.requiredFields = staffEventSelected
      ? constants.REQUIRED_STAFF_EVENT_FIELDS
      : requiredFields;

    const freqOpts = [
      { label: 'RecurringReservationControls.frequencyNone', value: '' },
      { label: 'RecurringReservationControls.frequencyDaily', value: 'days' },
      { label: 'RecurringReservationControls.frequencyWeekly', value: 'weeks' },
      { label: 'RecurringReservationControls.frequencyMonthly', value: 'months' },
    ];
    // eslint-disable-next-line max-len
    const lastTimeVal = state.occur && state.occur.length ? state.occur[state.occur.length - 1].start : selectedTime.begin;
    return (
      <div>
        <div>
          {state.data && state.data.length
            ? state.data.map(ele => (
              <div key={ele.begin}>
                {`${new Date(ele.begin).toDateString()} on varattu.`}
              </div>
            )) : <div />
          }
        </div>
        <div>
          <RecurringReservationControls
            changeFrequency={this.props.testChange}
            changeLastTime={() => console.log('change last time')}
            changeNumberOfOccurrences={this.props.testAdd}
            frequency={state.value || ''}
            frequencyOptions={freqOpts}
            isVisible
            lastTime={lastTimeVal}
            numberOfOccurrences={state.times || 1}
          />
        </div>
        <div>
          <DatePickerMulti
            daysInAdvance={resource.reservableBefore}
            onChange={data => console.log(data)}
            selectedValues={state.occur}
            value={selectedTime.begin}
          />
        </div>
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
            t('common.reserverIdLabel'),
            { placeholder: t('common.reserverIdLabel') }
          )}
          {this.renderField(
            'reserverPhoneNumber',
            'phone',
            'text',
            t('common.reserverPhoneNumberLabel'),
            { autoComplete: 'tel' },
            t('common.contactPurposeHelp'),
          )}
          {this.renderField(
            'reserverEmailAddress',
            'email',
            'email',
            t('common.reserverEmailAddressLabel'),
            { autoComplete: 'email' },
            t('common.contactPurposeHelp'),
          )}
          {resource.universalField && resource.universalField.length > 0
            && this.renderUniversalFields()
          }
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
          {includes(this.props.fields, 'homeMunicipality')
            && this.renderField(
              'homeMunicipality',
              'municipality',
              'select',
              t('common.homeMunicipality'),
              { options: resource.includedReservationHomeMunicipalityFields },
            )
          }
          {(includes(this.props.fields, 'billingFirstName')
            || includes(this.props.fields, 'billingLastName')
            || includes(this.props.fields, 'billingPhoneNumber')
            || includes(this.props.fields, 'billingEmailAddress')
            || includes(this.props.fields, 'billingAddressStreet')
            || includes(this.props.fields, 'billingAddressZip')
            || includes(this.props.fields, 'billingAddressCity'))
            && <h3 className="app-ReservationPage__title" id="payment-info-heading">{t('common.payerInformationLabel')}</h3>
          }
          {includes(this.props.fields, 'billingFirstName')
            && this.renderField(
              'billingFirstName',
              'cc-given-name',
              'text',
              t('common.billingFirstNameLabel'),
              { autoComplete: 'cc-given-name' },
            )
          }
          {includes(this.props.fields, 'billingLastName')
            && this.renderField(
              'billingLastName',
              'cc-family-name',
              'text',
              t('common.billingLastNameLabel'),
              { autoComplete: 'cc-family-name' },
            )
          }
          {includes(this.props.fields, 'billingPhoneNumber')
            && this.renderField(
              'billingPhoneNumber',
              'phone',
              'tel',
              t('common.billingPhoneNumberLabel'),
              { autoComplete: 'tel' },
            )
          }
          {includes(this.props.fields, 'billingEmailAddress')
            && this.renderField(
              'billingEmailAddress',
              'email',
              'email',
              t('common.billingEmailAddressLabel'),
              { autoComplete: 'email' },
            )
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
          || includes(this.props.fields, 'numberOfParticipants')
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
          {(paymentTermsAndConditions && hasPayment)
            && this.renderTermsField('paymentTermsAndConditions', true)
          }
          <div className="form-controls">
            <Button
              bsStyle="warning"
              onClick={onCancel}
            >
              {isEditing ? t('ReservationInformationForm.cancelEdit') : t('common.cancel')}
            </Button>
            {(isEditing || hasProducts(resource))
              && (
              <Button
                bsStyle="default"
                onClick={onBack}
              >
                {t('common.previous')}
              </Button>
              )
            }
            <ReservationSubmitButton
              handleSubmit={handleSubmit}
              hasPayment={hasPayment}
              isMakingReservations={isMakingReservations}
              needManualConfirmation={resource.needManualConfirmation}
              onConfirm={onConfirm}
            />
          </div>
        </Form>
        <ReservationTermsModal resource={resource} />
        <ReservationTermsModal resource={resource} termsType="payment" />
      </div>
    );
  }
}

UnconnectedReservationInformationForm.propTypes = {
  fields: PropTypes.array.isRequired,
  hasPayment: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  openResourceTermsModal: PropTypes.func.isRequired,
  openResourcePaymentTermsModal: PropTypes.func.isRequired,
  requiredFields: PropTypes.array.isRequired,
  resource: PropTypes.shape({
    universalField: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        universalField: PropTypes.string,
        description: PropTypes.string,
        label: PropTypes.string,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number,
            text: PropTypes.string,
          })
        ),
      }),
    ),
    includedReservationHomeMunicipalityFields: PropTypes.array,
  }),
  selectedTime: PropTypes.object,
  staffEventSelected: PropTypes.bool,
  state: PropTypes.object,
  t: PropTypes.func.isRequired,
  testAdd: PropTypes.func,
  testChange: PropTypes.func,
  termsAndConditions: PropTypes.string.isRequired,
  paymentTermsAndConditions: PropTypes.string.isRequired,
};
UnconnectedReservationInformationForm = injectT(UnconnectedReservationInformationForm);  // eslint-disable-line

export { UnconnectedReservationInformationForm };
export default injectT(reduxForm({
  form: FormTypes.RESERVATION,
  enableReinitialize: true,
  validate,
})(UnconnectedReservationInformationForm));
