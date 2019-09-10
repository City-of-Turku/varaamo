import PropTypes from 'prop-types';
import React, { Component } from 'react';
import get from 'lodash/get';
import camelCase from 'lodash/camelCase';
import { FormattedHTMLMessage } from 'react-intl';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import iconHome from 'hel-icons/dist/shapes/home.svg';
import { Link } from 'react-router-dom';

import constants from '../../../constants/AppConstants';
import injectT from '../../../i18n/injectT';
import ReservationDate from '../../../shared/reservation-date/ReservationDate';
import { reservationMetadataFields } from '../../../../src/domain/reservation/constants';

class ReservationConfirmation extends Component {
  static propTypes = {
    isEdited: PropTypes.bool,
    reservation: PropTypes.object.isRequired,
    resource: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  };

  // componentDidMount() {
  //   const { reservation, resource } = this.props;
  //   if (hasProducts(resource)) {
  //     getReservationPrice(apiClient, reservation.begin, reservation.end, resource.products)
  //       .then(reservationPrice => this.setState({ reservationPrice }));
  //   }
  // }

  renderMetaDataFields() {
    const { reservation } = this.state;
    const { t } = this.props;

    return (
      reservationMetadataFields.map((field) => {
        const value = get(reservation, field);

        return value ? (
          <Row
            className="app-ReservationConfirmation__field"
            key={`reservation-confirmation-field-${field}`}
          >
            <Col xs={6}>
              <b>{t(`${camelCase(field)}Label`)}</b>
            </Col>
            <Col className="app-ReservationConfirmation__field-value" xs={6}>
              {value}
            </Col>
          </Row>
        ) : '';
      })
    );
  }


  render() {
    const {
      isEdited, reservation, resource, t, user
    } = this.props;

    const refUrl = window.location.href;
    const href = `${constants.FEEDBACK_URL}?ref=${refUrl}`;
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
        <Col md={6} xs={12}>
          <div className="app-ReservationDetails">
            <h2 className="app-ReservationPage__title app-ReservationPage__title--big app-ReservationPage__header">
              {t(`ReservationConfirmation.reservation${isEdited ? 'Edited' : 'Created'}Title`)}
            </h2>
            <div className="app-ReservationConfirmation__highlight">
              <ReservationDate
                beginDate={reservation.begin}
                className="app-ReservationConfirmation__reservation-date"
                endDate={reservation.end}
              />
              <p className="app-ReservationConfirmation__resource-name">
                <img
                  alt={resource.name}
                  className="app-ReservationConfirmation__icon"
                  src={iconHome}
                />
                <span>{resource.name}</span>
              </p>
            </div>
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
              <Link to="/my-reservations">
                <Button bsStyle="primary" className="app-ReservationConfirmation__button">
                  {t('ReservationConfirmation.ownReservationButton')}
                </Button>
              </Link>
            </p>
          </div>
        </Col>
        <Col md={6} xs={12}>
          <div className="app-ReservationDetails">
            <h2 className="app-ReservationPage__title">{t('ReservationConfirmation.reservationDetailsTitle')}</h2>
            {this.renderMetaDataFields()}
          </div>
        </Col>
      </Row>
    );
  }
}

export default injectT(ReservationConfirmation);
