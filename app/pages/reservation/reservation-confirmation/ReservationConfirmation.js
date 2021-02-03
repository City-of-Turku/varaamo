import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Well from 'react-bootstrap/lib/Well';
import iconHome from 'hel-icons/dist/shapes/home.svg';

import { injectT } from 'i18n';
import ReservationDate from 'shared/reservation-date';
import { getFeedbackLink } from 'utils/languageUtils';
import { getFormattedProductPrice } from '../../../utils/reservationUtils';

class ReservationConfirmation extends Component {
  static propTypes = {
    currentLanguage: PropTypes.string,
    isEdited: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired,
    reservation: PropTypes.object.isRequired,
    resource: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  handleReservationsButton(isLoggedIn) {
    if (isLoggedIn) this.props.history.replace('/my-reservations');
    else this.props.history.replace('/');
  }

  renderField(field, label, value) {
    return (
      <Row
        className="app-ReservationConfirmation__field"
        key={`reservation-confirmation-field-${field}`}
      >
        <Col xs={12}>
          <b>{label}</b>
        </Col>
        <Col className="app-ReservationConfirmation__field-value" xs={12}>
          {value}
        </Col>
      </Row>
    );
  }

  renderReturnButton(isLoggedIn, t) {
    return (
      <Button
        bsStyle="primary"
        className="app-ReservationConfirmation__button"
        onClick={() => this.handleReservationsButton(isLoggedIn)}
      >
        {isLoggedIn ? t('ReservationConfirmation.ownReservationButton') : t('ReservationConfirmation.returnToHomeButton')}
      </Button>
    );
  }

  render() {
    const {
      currentLanguage, isEdited, isLoggedIn, reservation, resource, t, user
    } = this.props;

    const href = getFeedbackLink(currentLanguage);
    let email = '';
    if (reservation.reserverEmailAddress) {
      email = reservation.reserverEmailAddress;
    } else if (reservation.user && reservation.user.email) {
      email = reservation.user.email;
    } else if (user.email) {
      email = user.email;
    }

    return (
      <Row className="app-ReservationConfirmation">
        <Col lg={6} md={12} xs={12}>
          <Well>
            <h2 className="app-ReservationPage__header">
              {t(`ReservationConfirmation.reservation${isEdited ? 'Edited' : 'Created'}Title`)}
            </h2>
            <ReservationDate beginDate={reservation.begin} endDate={reservation.end} />
            <p className="app-ReservationConfirmation__resource-name">
              <img
                alt=""
                className="app-ReservationConfirmation__icon"
                src={iconHome}
              />
              {resource.name}
            </p>
            {!isEdited && (
              <p>
                <FormattedHTMLMessage
                  id="ReservationConfirmation.confirmationText"
                  values={{ email }}
                />
              </p>
            )}
            <p>
              <FormattedHTMLMessage id="ReservationConfirmation.feedbackText" values={{ href }} />
            </p>
            <p className="app-ReservationConfirmation__button-wrapper">
              {this.renderReturnButton(isLoggedIn, t)}
            </p>
          </Well>
        </Col>
        <Col lg={6} md={12} xs={12}>
          <Well>
            <h2 id="reservationDetails">{t('ReservationConfirmation.reservationDetailsTitle')}</h2>
            {reservation.reserverName
              && this.renderField(
                'reserverName',
                t('common.reserverNameLabel'),
                reservation.reserverName
              )}
            {reservation.reserverId
              && this.renderField('reserverId', t('common.reserverIdLabel'), reservation.reserverId)}
            {reservation.reserverPhoneNumber
              && this.renderField(
                'reserverPhoneNumber',
                t('common.reserverPhoneNumberLabel'),
                reservation.reserverPhoneNumber
              )}
            {reservation.reserverEmailAddress
              && this.renderField(
                'reserverEmailAddress',
                t('common.reserverEmailAddressLabel'),
                reservation.reserverEmailAddress
              )}
            {reservation.eventSubject
              && this.renderField(
                'eventSubject',
                t('common.eventSubjectLabel'),
                reservation.eventSubject
              )}
            {reservation.eventDescription
              && this.renderField(
                'eventDescription',
                t('common.eventDescriptionLabel'),
                reservation.eventDescription
              )}
            {reservation.numberOfParticipants
              && this.renderField(
                'numberOfParticipants',
                t('common.numberOfParticipantsLabel'),
                reservation.numberOfParticipants
              )}
            {reservation.requireAssistance
              && this.renderField(
                'requireAssistance',
                t('common.requireAssistanceLabel'),
                t('common.yes'),
                reservation.requireAssistance
              )}
            {reservation.requireWorkstation
              && this.renderField(
                'requireWorkstation',
                t('common.requireWorkstationLabel'),
                t('common.yes'),
                reservation.requireWorkstation
              )}
            {reservation.comments
              && this.renderField('comments', t('common.commentsLabel'), reservation.comments)}
            {reservation.reserverAddressStreet
              && this.renderField(
                'reserverAddressStreet',
                t('common.addressStreetLabel'),
                reservation.reserverAddressStreet
              )}
            {reservation.reserverAddressZip
              && this.renderField(
                'reserverAddressZip',
                t('common.addressZipLabel'),
                reservation.reserverAddressZip
              )}
            {reservation.reserverAddressCity
              && this.renderField(
                'reserverAddressCity',
                t('common.addressCityLabel'),
                reservation.reserverAddressCity
              )}
            {reservation.homeMunicipality
              && this.renderField(
                'homeMunicipality',
                t('common.homeMunicipality'),
                reservation.homeMunicipality.name[currentLanguage]
              )}
            {reservation.order
              && this.renderField(
                'pricePerPeriod',
                t('common.priceLabel'),
                getFormattedProductPrice(reservation.order.orderLines[0].product),
              )}
            {reservation.order
              && this.renderField(
                'reservationPrice',
                t('common.priceTotalLabel'),
                `${reservation.order.price}€`,
              )}
            {reservation.billingAddressStreet && (
              <Col xs={12}><h3 id="billingInformationHeader">{t('common.billingAddressLabel')}</h3></Col>
            )}
            {reservation.billingAddressStreet
              && this.renderField(
                'billingAddressStreet',
                t('common.addressStreetLabel'),
                reservation.billingAddressStreet
              )}
            {reservation.billingAddressZip
              && this.renderField(
                'billingAddressZip',
                t('common.addressZipLabel'),
                reservation.billingAddressZip
              )}
            {reservation.billingAddressCity
              && this.renderField(
                'billingAddressCity',
                t('common.addressCityLabel'),
                reservation.billingAddressCity
              )}
            {reservation.reservationExtraQuestions && (
            <Col xs={12}><h3 id="reservationExtraQuestionsHeader">{t('common.additionalInfo.heading')}</h3></Col>
            )}
            {reservation.reservationExtraQuestions
            && this.renderField(
              'reservationExtraQuestions',
              t('common.additionalInfo.label'),
              reservation.reservationExtraQuestions
            )}
          </Well>
        </Col>
      </Row>
    );
  }
}

export default injectT(ReservationConfirmation);
