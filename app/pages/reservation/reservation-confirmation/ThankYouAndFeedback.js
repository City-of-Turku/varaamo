import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage } from 'react-intl';

import QualityToolsContainer from '../../../shared/quality-tools-form/QualityToolsContainer';
import injectT from '../../../i18n/injectT';

/**
 * Returns a thank you message and feedback link or form
 * @param {object} props
 * @param {string} props.feedbackHref
 * @param {object} props.reservation
 * @param {boolean} props.reservationIsEdited
 * @param {boolean} props.resourceHasQualityToolsLink
 * @returns {JSX.Element} thank you message and feedback link or form
 */
function ThankYouAndFeedback({
  feedbackHref, reservation, reservationIsEdited, resourceHasQualityToolsLink, t
}) {
  if (!reservationIsEdited && resourceHasQualityToolsLink) {
    return (
      <React.Fragment>
        <QualityToolsContainer reservation={reservation} />
        <p>{t('ReservationConfirmation.thankYou')}</p>
      </React.Fragment>
    );
  }

  return (
    <p>
      <FormattedHTMLMessage id="ReservationConfirmation.feedbackText" values={{ href: feedbackHref }} />
    </p>
  );
}

ThankYouAndFeedback.defaultProps = {
  reservationIsEdited: true,
};

ThankYouAndFeedback.propTypes = {
  reservation: PropTypes.object.isRequired,
  reservationIsEdited: PropTypes.bool,
  resourceHasQualityToolsLink: PropTypes.bool.isRequired,
  feedbackHref: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ThankYouAndFeedback);
