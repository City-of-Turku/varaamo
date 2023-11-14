
import includes from 'lodash/includes';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import Well from 'react-bootstrap/lib/Well';
import {
  Field, reduxForm, getFormSyncErrors, getFormValues, change
} from 'redux-form';
import isEmail from 'validator/lib/isEmail';
import { Col, Row } from 'react-bootstrap';

import FormTypes from 'constants/FormTypes';
import constants from 'constants/AppConstants';
import { hasProducts, normalizeUniversalFieldOptions } from 'utils/reservationUtils';
import ReduxFormField from 'shared/form-fields/ReduxFormField';
import TermsField from 'shared/form-fields/TermsField';
import { injectT } from 'i18n';
import ReservationTermsModal from 'shared/modals/reservation-terms';
import WrappedText from 'shared/wrapped-text/WrappedText';
import ReservationSubmitButton from './ReservationSubmitButton';
import ReservationValidationErrors from './ReservationValidationErrors';
import { FIELDS } from '../../../constants/ReservationConstants';
import { isValidPhoneNumber } from '../../../utils/phoneValidationUtil';
import RadioGroup from '../../../shared/form-fields/RadioGroup';
import SingleReservationDetail from '../reservation-details/SingleReservationDetail';

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
  constructor(props) {
    super(props);
    this.state = {
      showFormErrorList: false,
      formErrors: [],
      showInfoCopied: false,
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.copyReserverToPayerInfo = this.copyReserverToPayerInfo.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { showFormErrorList } = this.state;
    const { formValues } = this.props;
    if (showFormErrorList) {
      if (!isEqual(formValues, prevProps.formValues)) {
        this.setState({ showFormErrorList: false, formErrors: [] });
      }
    }
    // remove copied message after changes happen
    if ((this.state.showInfoCopied && prevState.showInfoCopied)
       && (formValues !== prevProps.formValues)) {
      this.setState({ showInfoCopied: false });
    }
  }

  handleFormSubmit() {
    const { formSyncErrors, handleSubmit, onConfirm } = this.props;
    if (formSyncErrors && Object.keys(formSyncErrors).length > 0) {
      this.setState({ showFormErrorList: true, formErrors: Object.keys(formSyncErrors) });
    }

    handleSubmit(onConfirm);
  }

  copyReserverToPayerInfo() {
    const { formValues, dispatch } = this.props;
    const {
      reserverName,
      reserverPhoneNumber,
      reserverEmailAddress,
      reserverAddressStreet,
      reserverAddressZip,
      reserverAddressCity
    } = formValues;

    // split reserverName (assuming first and last name) into firstName and lastName
    const nameParts = reserverName ? reserverName.split(' ') : [''];
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    dispatch(change(FormTypes.RESERVATION, FIELDS.BILLING_FIRST_NAME.id, firstName));
    dispatch(change(FormTypes.RESERVATION, FIELDS.BILLING_LAST_NAME.id, lastName));

    dispatch(change(FormTypes.RESERVATION, FIELDS.BILLING_PHONE_NUMBER.id, reserverPhoneNumber));
    dispatch(change(FormTypes.RESERVATION, FIELDS.BILLING_EMAIL_ADDRESS.id, reserverEmailAddress));
    dispatch(change(
      FormTypes.RESERVATION, FIELDS.BILLING_ADDRESS_STREET.id, reserverAddressStreet));
    dispatch(change(FormTypes.RESERVATION, FIELDS.BILLING_ADDRESS_ZIP.id, reserverAddressZip));
    dispatch(change(FormTypes.RESERVATION, FIELDS.BILLING_ADDRESS_CITY.id, reserverAddressCity));
    // let user know that billing info has been copied
    this.setState({ showInfoCopied: true });
  }


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
      staffEventSelected,
      t,
      termsAndConditions,
      paymentTermsAndConditions,
      reservationType,
    } = this.props;

    this.requiredFields = staffEventSelected
      ? constants.REQUIRED_STAFF_EVENT_FIELDS
      : requiredFields;

    const showEditingReservationType = includes(this.props.fields, 'type') && isEditing;
    const showInputReservationType = includes(this.props.fields, 'type') && !isEditing;
    return (
      <div>
        <Form className="reservation-form" horizontal onSubmit={handleSubmit(onConfirm)}>
          { showEditingReservationType && (
            <Well>
              <SingleReservationDetail
                label={t('ReservationType.label')}
                value={reservationType === constants.RESERVATION_TYPE.BLOCKED_VALUE
                  ? t(constants.RESERVATION_TYPE.BLOCKED_LABEL_ID)
                  : t(constants.RESERVATION_TYPE.NORMAL_LABEL_ID)}
              />
            </Well>
          )}
          { showInputReservationType && (
          <Well>
            <RadioGroup
              legend={t(constants.RESERVATION_TYPE.LEGEND_TEXT_ID)}
              legendHint={t(constants.RESERVATION_TYPE.LEGEND_HINT_TEXT_ID)}
              radioOptions={[
                {
                  name: constants.RESERVATION_TYPE.TYPE_NAME,
                  value: constants.RESERVATION_TYPE.NORMAL_VALUE,
                  label: t(constants.RESERVATION_TYPE.NORMAL_LABEL_ID),
                  hint: t(constants.RESERVATION_TYPE.NORMAL_HINT_TEXT_ID),
                },
                {
                  name: constants.RESERVATION_TYPE.TYPE_NAME,
                  value: constants.RESERVATION_TYPE.BLOCKED_VALUE,
                  label: t(constants.RESERVATION_TYPE.BLOCKED_LABEL_ID),
                  hint: t(constants.RESERVATION_TYPE.BLOCKED_HINT_TEXT_ID),
                }
              ]}
            />
          </Well>
          )}
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
            FIELDS.RESERVER_NAME.id,
            'name',
            'text',
            t(FIELDS.RESERVER_NAME.label),
            { autoComplete: 'name' },
          )}
          {this.renderField(
            FIELDS.COMPANY.id,
            'company',
            'text',
            t(FIELDS.COMPANY.label),
            {}
          )}
          {this.renderField(
            FIELDS.RESERVER_ID.id,
            'reserverId',
            'text',
            t(FIELDS.RESERVER_ID.label),
            {}
          )}
          {this.renderField(
            FIELDS.RESERVER_PHONE_NUMBER.id,
            'phone',
            'text',
            t(FIELDS.RESERVER_PHONE_NUMBER.label),
            { autoComplete: 'tel' },
          )}
          {this.renderField(
            FIELDS.RESERVER_EMAIL_ADDRESS.id,
            'email',
            'email',
            t(FIELDS.RESERVER_EMAIL_ADDRESS.label),
            { autoComplete: 'email' },
          )}
          {resource.universalField && resource.universalField.length > 0
            && this.renderUniversalFields()
          }
          {includes(this.props.fields, 'reserverAddressStreet')
            && this.renderField(
              FIELDS.RESERVER_ADDRESS_STREET.id,
              'address',
              'text',
              t(FIELDS.RESERVER_ADDRESS_STREET.label),
              { autoComplete: 'street-address' },
            )}
          {includes(this.props.fields, 'reserverAddressZip')
            && this.renderField(
              FIELDS.RESERVER_ADDRESS_ZIP.id,
              'zip',
              'text',
              t(FIELDS.RESERVER_ADDRESS_ZIP.label),
              { autoComplete: 'postal-code' },
            )}
          {includes(this.props.fields, 'reserverAddressCity')
            && this.renderField(
              FIELDS.RESERVER_ADDRESS_CITY.id,
              'city',
              'text',
              t(FIELDS.RESERVER_ADDRESS_CITY.label),
              { autoComplete: 'address-level2' },
            )
          }
          {includes(this.props.fields, 'homeMunicipality')
            && this.renderField(
              FIELDS.HOME_MUNICIPALITY.id,
              'municipality',
              'select',
              t(FIELDS.HOME_MUNICIPALITY.label),
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
            && (
              <div className="payment-info-heading-container">
                <Row>
                  <Col sm={5}>
                    <h3 className="app-ReservationPage__title" id="payment-info-heading">{t('common.payerInformationLabel')}</h3>
                  </Col>
                  <Col className="align-right" sm={7}>
                    <Button
                      id="copy-info-button"
                      onClick={this.copyReserverToPayerInfo}
                    >
                      {t('ReservationInformationForm.copyInfoButtonLabel')}
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col className="align-right" sm={12}>
                    <span
                      aria-hidden={!this.state.showInfoCopied}
                      className={this.state.showInfoCopied ? 'show-info' : 'hide-info'}
                      id="copied-info-status"
                      role="alert"
                    >
                      {this.state.showInfoCopied ? t('ReservationInformationForm.copyConfirmed') : ''}
                    </span>
                  </Col>
                </Row>
              </div>
            )
          }
          {includes(this.props.fields, 'billingFirstName')
            && this.renderField(
              FIELDS.BILLING_FIRST_NAME.id,
              'cc-given-name',
              'text',
              t(FIELDS.BILLING_FIRST_NAME.label),
              { autoComplete: 'cc-given-name' },
            )
          }
          {includes(this.props.fields, 'billingLastName')
            && this.renderField(
              FIELDS.BILLING_LAST_NAME.id,
              'cc-family-name',
              'text',
              t(FIELDS.BILLING_LAST_NAME.label),
              { autoComplete: 'cc-family-name' },
            )
          }
          {includes(this.props.fields, 'billingPhoneNumber')
            && this.renderField(
              FIELDS.BILLING_PHONE_NUMBER.id,
              'phone',
              'tel',
              t(FIELDS.BILLING_PHONE_NUMBER.label),
              { autoComplete: 'tel' },
            )
          }
          {includes(this.props.fields, 'billingEmailAddress')
            && this.renderField(
              FIELDS.BILLING_EMAIL_ADDRESS.id,
              'email',
              'email',
              t(FIELDS.BILLING_EMAIL_ADDRESS.label),
              { autoComplete: 'email' },
            )
          }
          {includes(this.props.fields, 'billingAddressStreet')
            && this.renderField(
              FIELDS.BILLING_ADDRESS_STREET.id,
              'address',
              'text',
              t(FIELDS.BILLING_ADDRESS_STREET.label),
              { autoComplete: 'street-address' },
            )
          }
          {includes(this.props.fields, 'billingAddressZip')
            && this.renderField(
              FIELDS.BILLING_ADDRESS_ZIP.id,
              'zip',
              'text',
              t(FIELDS.BILLING_ADDRESS_ZIP.label),
              { autoComplete: 'postal-code' },
            )
          }
          {includes(this.props.fields, 'billingAddressCity')
            && this.renderField(
              FIELDS.BILLING_ADDRESS_CITY.id,
              'city',
              'text',
              t(FIELDS.BILLING_ADDRESS_CITY.label),
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
            FIELDS.EVENT_SUBJECT.id,
            'eventSubject',
            'text',
            t(FIELDS.EVENT_SUBJECT.label),
            {},
            null,
          )}
          {this.renderField(
            FIELDS.EVENT_DESCRIPTION.id,
            'eventDescription',
            'textarea',
            t(FIELDS.EVENT_DESCRIPTION.label),
            { rows: 5 }
          )}
          {this.renderField(
            FIELDS.NUMBER_OF_PARTICIPANTS.id,
            'numberOfParticipants',
            'number',
            t(FIELDS.NUMBER_OF_PARTICIPANTS.label),
            { min: '1', max: resource.peopleCapacity }
          )}
          {this.renderField(
            FIELDS.REQUIRE_ASSISTANCE.id,
            'requireAssistance',
            'checkbox',
            t(FIELDS.REQUIRE_ASSISTANCE.label),
            {},
            null,
            null,
            true
          )}
          {this.renderField(
            FIELDS.REQUIRE_WORKSTATION.id,
            'requireWorkstation',
            'checkbox',
            t(FIELDS.REQUIRE_WORKSTATION.label),
            {},
            null,
            null,
            true
          )}
          {this.renderField(
            FIELDS.PRIVATE_EVENT.id,
            'privateEvent',
            'checkbox',
            t(FIELDS.PRIVATE_EVENT.label),
            {},
            null,
            null,
            true
          )}
          {this.renderField(
            FIELDS.COMMENTS.id,
            'comments',
            'textarea',
            t(FIELDS.COMMENTS.label),
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
            FIELDS.RESERVATION_EXTRA_QUESTIONS.id,
            'reservationExtraQuestions',
            'textarea',
            t(FIELDS.RESERVATION_EXTRA_QUESTIONS.label),
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
              handleFormSubmit={this.handleFormSubmit}
              hasPayment={hasPayment}
              isMakingReservations={isMakingReservations}
              needManualConfirmation={resource.needManualConfirmation}
            />
            <ReservationValidationErrors
              formErrors={this.state.formErrors}
              showFormErrorList={this.state.showFormErrorList}
              universalFields={resource.universalField}
            />
          </div>
        </Form>
        <ReservationTermsModal resource={resource} />
        <ReservationTermsModal resource={resource} termsType="payment" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  formSyncErrors: getFormSyncErrors(FormTypes.RESERVATION)(state),
  formValues: getFormValues(FormTypes.RESERVATION)(state),
});

UnconnectedReservationInformationForm.propTypes = {
  fields: PropTypes.array.isRequired,
  formSyncErrors: PropTypes.object,
  formValues: PropTypes.object,
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
  staffEventSelected: PropTypes.bool,
  t: PropTypes.func.isRequired,
  termsAndConditions: PropTypes.string.isRequired,
  paymentTermsAndConditions: PropTypes.string.isRequired,
  reservationType: PropTypes.string,
};
UnconnectedReservationInformationForm = injectT(UnconnectedReservationInformationForm);  // eslint-disable-line

export { UnconnectedReservationInformationForm };
export default injectT(connect(mapStateToProps, null)(reduxForm({
  form: FormTypes.RESERVATION,
  enableReinitialize: true,
  validate,
})(UnconnectedReservationInformationForm)));
