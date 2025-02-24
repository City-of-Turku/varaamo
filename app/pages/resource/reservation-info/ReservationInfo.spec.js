import React from 'react';
import Immutable from 'seamless-immutable';

import Resource from 'utils/fixtures/Resource';
import { shallowWithIntl } from 'utils/testUtils';
import WrappedText from 'shared/wrapped-text';
import ReservationInfo from './ReservationInfo';

describe('pages/resource/reservation-info/ReservationInfo', () => {
  const defaultProps = {
    addNotification: () => null,
    currentLanguage: 'fi',
    isLoggedIn: false,
    isStrongAuthSatisfied: true,
    resource: Immutable(
      Resource.build({
        maxPeriod: '04:00:00',
        maxReservationsPerUser: 2,
        reservable: true,
        reservableAfter: '2019-03-06T00:00:00Z',
        reservableMinDaysInAdvance: 2,
        reservationInfo: 'Some information',
      })
    ),
  };

  function getWrapper(props) {
    return shallowWithIntl(<ReservationInfo {...defaultProps} {...props} />);
  }

  test('renders a app-ReservationInfo', () => {
    const element = getWrapper().find('.app-ReservationInfo');
    expect(element.length).toBe(1);
  });

  test('renders resource.reservationInfo as WrappedText', () => {
    const wrappedText = getWrapper().find(WrappedText);
    expect(wrappedText.length).toBe(1);
    expect(wrappedText.props().text).toBe(defaultProps.resource.reservationInfo);
    expect(wrappedText.props().allowNamedLinks).toBe(true);
    expect(wrappedText.props().openLinksInNewTab).toBe(true);
  });

  describe('earliest reservation day text', () => {
    test('is rendered correctly when resource.reservableAfter is defined', () => {
      const resAfterText = getWrapper().find('.reservable-after-text');
      expect(resAfterText).toHaveLength(1);
      const daysInAdvanceText = resAfterText.find('strong');
      expect(daysInAdvanceText.text()).toEqual('ReservationInfo.reservationEarliestDays');
    });

    test('is not rendered if resource.reservableAfter is not defined', () => {
      const resource = {};
      const maxLengthText = getWrapper({ resource }).find('.reservable-after-text');
      expect(maxLengthText).toHaveLength(0);
    });
  });

  describe('max length text', () => {
    test('is rendered correctly when resource.maxPeriod is defined', () => {
      const maxLengthText = getWrapper().find('.max-length-text');
      expect(maxLengthText).toHaveLength(1);
    });

    test('is not rendered if resource.maxPeriod is not defined', () => {
      const resource = {};
      const maxLengthText = getWrapper({ resource }).find('.max-length-text');
      expect(maxLengthText).toHaveLength(0);
    });
  });

  describe('max reservations per user text', () => {
    test(
      'is rendered correctly when resource.maxReservationsPerUser is defined',
      () => {
        const maxReservationsText = getWrapper().find('.max-number-of-reservations-text');
        expect(maxReservationsText).toHaveLength(1);
      }
    );

    test(
      'is not rendered if resource.maxReservationsPerUser is not defined',
      () => {
        const resource = {};
        const maxReservationsText = getWrapper({ resource }).find('.max-number-of-reservations-text');
        expect(maxReservationsText).toHaveLength(0);
      }
    );
  });
});
