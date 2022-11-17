import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';

import { shallowWithIntl } from 'utils/testUtils';
import QualityToolsContainer from '../../../shared/quality-tools-form/QualityToolsContainer';
import Reservation from '../../../utils/fixtures/Reservation';
import ThankYouAndFeedback from './ThankYouAndFeedback';


describe('app/pages/reservation/reservation-confirmation/ThankYouAndFeedback', () => {
  const defaultProps = {
    reservation: Reservation.build(),
    reservationIsEdited: false,
    resourceHasQualityToolsLink: false,
    feedbackHref: 'https://testfeedback.test.fi',
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ThankYouAndFeedback {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    describe('when not editing reservation and resource has quality tools link', () => {
      const wrapper = getWrapper({ reservationIsEdited: false, resourceHasQualityToolsLink: true });

      test('QualityToolsContainer', () => {
        const qualityToolsContainer = wrapper.find(QualityToolsContainer);
        expect(qualityToolsContainer).toHaveLength(1);
        expect(qualityToolsContainer.prop('reservation')).toBe(defaultProps.reservation);
      });

      test('thank you text', () => {
        const text = wrapper.find('p');
        expect(text).toHaveLength(1);
        expect(text.text()).toBe('ReservationConfirmation.thankYou');
      });
    });

    describe('when editing reservation', () => {
      test('thank you text with feedback link', () => {
        const wrapper = getWrapper({ reservationIsEdited: true });
        const text = wrapper.find('p');
        expect(text).toHaveLength(1);
        const message = text.find(FormattedHTMLMessage);
        expect(message).toHaveLength(1);
        expect(message.prop('id')).toBe('ReservationConfirmation.feedbackText');
        expect(message.prop('values')).toStrictEqual({ href: defaultProps.feedbackHref });
      });
    });

    describe('when not editing reservation and resource does not have quality tools link', () => {
      test('thank you text with feedback link', () => {
        const wrapper = getWrapper(
          { reservationIsEdited: false, resourceHasQualityToolsLink: false }
        );
        const text = wrapper.find('p');
        expect(text).toHaveLength(1);
        const message = text.find(FormattedHTMLMessage);
        expect(message).toHaveLength(1);
        expect(message.prop('id')).toBe('ReservationConfirmation.feedbackText');
        expect(message.prop('values')).toStrictEqual({ href: defaultProps.feedbackHref });
      });
    });
  });
});
