import constants from 'constants/AppConstants';
import { getStatusOptions } from '../../filters/filterUtils';
import { getLabelStyle, getLabelText } from '../statusUtils';

describe('ManageReservations/status/statusUtils', () => {
  describe('getLabelStyle', () => {
    test('returns correct style string for each status', () => {
      const states = constants.RESERVATION_STATE;
      expect(getLabelStyle(states.CANCELLED)).toBe('default');
      expect(getLabelStyle(states.CONFIRMED)).toBe('success');
      expect(getLabelStyle(states.DENIED)).toBe('danger');
      expect(getLabelStyle(states.REQUESTED)).toBe('warning');
      expect(getLabelStyle(states.READY_FOR_PAYMENT)).toBe('warning');
      expect(getLabelStyle(states.WAITING_FOR_PAYMENT)).toBe('warning');
      expect(getLabelStyle(states.WAITING_FOR_CASH_PAYMENT)).toBe('warning');
    });
  });

  describe('getLabelText', () => {
    const t = key => key;

    test('returns label string for given status', () => {
      const options = getStatusOptions(t);
      options.forEach((option) => {
        expect(getLabelText(option.value, t)).toBe(option.label);
      });
    });

    test('returns undefined for unknown status', () => {
      expect(getLabelText('some-unknown-status', t)).toBe(undefined);
    });
  });
});
