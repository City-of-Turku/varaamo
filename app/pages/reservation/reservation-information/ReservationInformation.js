import pick from 'lodash/pick';
import uniq from 'lodash/uniq';
import camelCase from 'lodash/camelCase';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Well from 'react-bootstrap/lib/Well';
import moment from 'moment';

import injectT from '../../../i18n/injectT';
import { isStaffEvent } from '../../../utils/reservationUtils';
import { getTermsAndConditions } from '../../../utils/resourceUtils';
import ReservationInformationForm from './ReservationInformationForm';

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
    reservation: PropTypes.object,
    resource: PropTypes.object.isRequired,
    selectedTime: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    unit: PropTypes.object.isRequired,
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
    } = this.props;
    const formFields = [...resource.supportedReservationExtraFields].map(value => camelCase(value));

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

    return uniq(formFields);
  }

  getFormInitialValues = () => {
    const {
      isEditing,
      reservation,
      resource,
    } = this.props;
    let rv = reservation ? pick(reservation, this.getFormFields()) : {};
    if (isEditing) {
      rv = { ...rv, staffEvent: isStaffEvent(reservation, resource) };
    }
    return rv;
  }

  getRequiredFormFields(resource, termsAndConditions) {
    const requiredFormFields = [...resource.requiredReservationExtraFields.map(
      field => camelCase(field)
    )];

    if (termsAndConditions) {
      requiredFormFields.push('termsAndConditions');
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
      resource,
      selectedTime,
      t,
      unit,
    } = this.props;

    const termsAndConditions = getTermsAndConditions(resource);
    const beginText = moment(selectedTime.begin).format('D.M.YYYY HH:mm');
    const endText = moment(selectedTime.end).format('HH:mm');
    const hours = moment(selectedTime.end).diff(selectedTime.begin, 'minutes') / 60;

    return (
      <div className="app-ReservationInformation">
        <Col md={7} sm={12}>
          {this.renderInfoTexts()}
          <ReservationInformationForm
            fields={this.getFormFields(termsAndConditions)}
            initialValues={this.getFormInitialValues()}
            isEditing={isEditing}
            isMakingReservations={isMakingReservations}
            onBack={onBack}
            onCancel={onCancel}
            onConfirm={this.onConfirm}
            openResourceTermsModal={openResourceTermsModal}
            requiredFields={this.getRequiredFormFields(resource, termsAndConditions)}
            resource={resource}
            termsAndConditions={termsAndConditions}
          />
        </Col>
        <Col md={5} sm={12}>
          <div className="app-ReservationDetails">
            <h2 className="app-ReservationPage__title">{t('ReservationPage.detailsTitle')}</h2>
            <Row>
              <Col md={4}>
                <span className="app-ReservationDetails__name">
                  {t('common.resourceLabel')}
                </span>
              </Col>
              <Col md={8}>
                <span className="app-ReservationDetails__value">
                  {resource.name}
                  <br />
                  {unit.name}
                </span>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                {t('ReservationPage.detailsTime')}
              </Col>
              <Col md={8}>
                {`${beginText}–${endText} (${hours} h)`}
              </Col>
            </Row>
          </div>
        </Col>
      </div>
    );
  }
}

export default injectT(ReservationInformation);
