
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Form from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Well from 'react-bootstrap/lib/Well';
import { Field, Fields, reduxForm } from 'redux-form';
import Row from 'react-bootstrap/lib/Row';

import FormTypes from 'constants/FormTypes';
import ReduxFormField from 'shared/form-fields/ReduxFormField';
import ReservationTimeControls from 'shared/form-fields/ReservationTimeControls';
import TimeRange from 'shared/time-range';
import { injectT } from 'i18n';
import ReservationOrderInfo from './ReservationOrderInfo';
import { getReservationCustomerGroupName } from 'utils/reservationUtils';

class UnconnectedReservationEditForm extends Component {
  constructor(props) {
    super(props);
    this.renderAddressRow = this.renderAddressRow.bind(this);
    this.renderEditableInfoRow = this.renderEditableInfoRow.bind(this);
    this.renderHeading = this.renderHeading.bind(this);
    this.renderInfoRow = this.renderInfoRow.bind(this);
    this.renderReservationTime = this.renderReservationTime.bind(this);
    this.getUniversalData = this.getUniversalData.bind(this);
  }

  getAddress(street, zip, city) {
    const ending = `${zip} ${city}`;
    if (street && (zip || city)) {
      return `${street}, ${ending}`;
    }
    return `${street} ${ending}`;
  }

  /**
   * Returns universal field data if it exists in the resource or reservation.
   * @returns {{displayValue: string, displayLabel: string, hasUniversalData: boolean}}
   */
  getUniversalData() {
    const {
      resource: { universalField },
      reservation: { universalData }
    } = this.props;
    let displayValue = '';
    let displayLabel = '';
    let hasUniversalData = false;
    if (universalData && Object.keys(universalData).length === 3) {
      // id of selected option that existed when reservation was created.
      const selectedOptionId = Number.parseInt(universalData.selectedOption, 10);
      const data = {};
      if (universalField && universalField.length) {
        // use options and label from resource
        data.options = universalField.reduce((acc, curr) => {
          acc.push(...curr.options);
          return acc;
        }, []);
        data.labels = universalField.reduce((acc, curr) => {
          acc.push(curr.label);
          return acc;
        }, []);
      } else {
        // use options and label from reservation
        data.options = universalData.field.options;
        data.labels = [universalData.field.label];
      }
      // find selected option
      const selectedOption = data.options.find(option => option.id === selectedOptionId);
      // text from selected option or find text from reservation.
      // eslint-disable-next-line max-len
      displayValue = selectedOption || universalData.field.options.find(opt => opt.id === selectedOptionId);
      displayValue = displayValue ? displayValue.text : '';
      // use first label from array
      displayLabel = data.labels[0];
      hasUniversalData = !!displayValue;
    }
    return { hasUniversalData, displayValue, displayLabel };
  }

  renderAddressRow(addressType) {
    const { reservation, t } = this.props;
    const hasAddress = (
      reservation.reserverAddressStreet || reservation.reserverAddressStreet === ''
    );
    if (!hasAddress) return null;
    const label = t(`common.${addressType}Label`);
    const value = this.getAddress(
      reservation[`${addressType}Street`],
      reservation[`${addressType}Zip`],
      reservation[`${addressType}City`]
    );
    return this.renderInfoRow(label, value);
  }

  renderHeading(label) {
    const { isLargerFontSize } = this.props;
    return (
      <Row>
        <Col sm={isLargerFontSize ? 12 : 3}>
          <h4 className="reservation-edit-form-heading">{label}</h4>
        </Col>
      </Row>
    );
  }

  renderInfoRow(label, value) {
    const { isLargerFontSize } = this.props;
    if (!value && value !== '') return null;
    return (
      <FormGroup>
        <Col sm={isLargerFontSize ? 12 : 3}>
          <ControlLabel>{label}</ControlLabel>
        </Col>
        <Col sm={isLargerFontSize ? 12 : 9}>
          <FormControl.Static>{value}</FormControl.Static>
        </Col>
      </FormGroup>
    );
  }

  renderEditableInfoRow(propertyName, type, controlProps = {}) {
    const { isEditing, reservation, t } = this.props;
    if (!isEditing) return this.renderStaticInfoRow(propertyName);
    const property = reservation[propertyName];
    if (!property && property !== '') return null;
    return (
      <Field
        component={ReduxFormField}
        controlProps={controlProps}
        label={t(`common.${propertyName}Label`)}
        labelErrorPrefix={t('common.checkError')}
        name={propertyName}
        type={type}
      />
    );
  }

  renderStaticInfoRow(propertyName) {
    const { reservation, t } = this.props;
    const value = reservation[propertyName];
    const label = t(`common.${propertyName}Label`);
    return this.renderInfoRow(label, value);
  }

  renderUserInfoRow(userPropertyName, labelName) {
    const { reservation, t } = this.props;
    const user = reservation.user || {};
    const value = user[userPropertyName];
    const label = t(`common.${labelName}Label`);
    return this.renderInfoRow(label, value);
  }

  renderReservationTime() {
    const {
      isEditing, reservation, resource, t
    } = this.props;
    if (isEditing) {
      return (
        <FormGroup id="reservation-time">
          <Col sm={3}>
            <ControlLabel>{t('common.reservationTimeLabel')}</ControlLabel>
          </Col>
          <Col sm={9}>
            <Fields
              component={ReservationTimeControls}
              names={['begin', 'end']}
              period={resource.slotSize}
            />
          </Col>
        </FormGroup>
      );
    }
    const staticReservationTime = <TimeRange begin={reservation.begin} end={reservation.end} />;
    return this.renderInfoRow(t('common.reservationTimeLabel'), staticReservationTime);
  }

  render() {
    const {
      currentLanguage,
      handleSubmit,
      isAdmin,
      isEditing,
      isSaving,
      isStaff,
      onCancelEditClick,
      onStartEditClick,
      reservation,
      reservationIsEditable,
      resource,
      t,
    } = this.props;

    if (isEmpty(reservation)) return <span />;

    const order = ('order' in reservation && typeof (reservation.order)) === 'object' ? reservation.order : null;
    const orderLine = (order && 'orderLines' in order) ? order.orderLines[0] : null;
    const price = (order && 'price' in order) ? order.price : null;
    const customerGroupName = getReservationCustomerGroupName(reservation, currentLanguage);
    const { hasUniversalData, displayValue, displayLabel } = this.getUniversalData();

    return (
      <Form
        className={classNames('reservation-edit-form', { editing: isEditing })}
        horizontal
        onSubmit={handleSubmit}
      >
        {isStaff && (
          <Well>
            {this.renderUserInfoRow('displayName', 'userName')}
            {this.renderUserInfoRow('email', 'userEmail')}
          </Well>
        )}
        {this.renderEditableInfoRow('eventSubject', 'text')}
        {this.renderStaticInfoRow('reserverName')}
        {hasUniversalData && (
          this.renderInfoRow(displayLabel, displayValue)
        )}
        {customerGroupName && (
          this.renderInfoRow(t('common.customerGroup'), customerGroupName)
        )}
        {this.renderEditableInfoRow('eventDescription', 'textarea', { maxLength: '256' })}
        {this.renderEditableInfoRow('numberOfParticipants', 'number')}
        {this.renderReservationTime()}
        {this.renderInfoRow(t('common.resourceLabel'), resource.name)}

        {isStaff && this.renderStaticInfoRow('reserverId')}
        {this.renderStaticInfoRow('company')}
        {this.renderStaticInfoRow('reserverPhoneNumber')}
        {this.renderStaticInfoRow('reserverEmailAddress')}
        {this.renderAddressRow('reserverAddress')}
        {('homeMunicipality' in reservation)
           && this.renderInfoRow(t('common.homeMunicipality'),
             (reservation.homeMunicipality && reservation.homeMunicipality.name)
               ? reservation.homeMunicipality.name[t('common.languageCode')] : '')}
        {this.renderStaticInfoRow('accessCode')}
        {!(reservation.requireAssistance === undefined)
           && this.renderInfoRow(t('common.requireAssistanceLabel'), reservation.requireAssistance ? t('common.yes') : t('common.no'))}
        {!(reservation.requireWorkstation === undefined)
           && this.renderInfoRow(t('common.requireWorkstationLabel'), reservation.requireWorkstation ? t('common.yes') : t('common.no'))}
        {!(reservation.privateEvent === undefined)
           && this.renderInfoRow(t('common.privateEventLabel'), reservation.privateEvent ? t('common.yes') : t('common.no'))}
        {this.renderInfoRow(t('common.additionalInfo.label'), reservation.reservationExtraQuestions)}
        {isAdmin && !reservationIsEditable && this.renderStaticInfoRow('comments')}
        {(orderLine && price) && (
          <ReservationOrderInfo
            currentLanguage={currentLanguage}
            order={order}
            renderHeading={this.renderHeading}
            renderInfoRow={this.renderInfoRow}
          />
        )}
        {isAdmin && reservationIsEditable && (
          <div className="form-controls">
            {!isEditing && (
              <Button
                bsStyle="primary"
                disabled={isSaving}
                onClick={onStartEditClick}
              >
                {t('ReservationEditForm.startEdit')}
              </Button>
            )}
            {isEditing && (
              <Button
                bsStyle="default"
                disabled={isSaving}
                onClick={onCancelEditClick}
              >
                {t('ReservationEditForm.cancelEdit')}
              </Button>
            )}
            {isEditing && (
              <Button
                bsStyle="primary"
                disabled={isSaving}
                type="submit"
              >
                {t('ReservationEditForm.saveChanges')}
              </Button>
            )}
          </div>
        )}
      </Form>
    );
  }
}

UnconnectedReservationEditForm.propTypes = {
  currentLanguage: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isLargerFontSize: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  onCancelEditClick: PropTypes.func.isRequired,
  onStartEditClick: PropTypes.func.isRequired,
  reservation: PropTypes.shape({
    universalData: PropTypes.shape({
      field: PropTypes.shape({
        description: PropTypes.string,
        id: PropTypes.number,
        label: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.number,
          text: PropTypes.string,
        })),
      }),
      selectOption: PropTypes.string,
      type: PropTypes.string,
    })
  }),
  reservationIsEditable: PropTypes.bool.isRequired,
  resource: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};
UnconnectedReservationEditForm = injectT(UnconnectedReservationEditForm);  // eslint-disable-line

export { UnconnectedReservationEditForm };
export default injectT(reduxForm({
  form: FormTypes.RESERVATION_EDIT,
})(UnconnectedReservationEditForm));
