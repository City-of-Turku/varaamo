import React from 'react';
import moment from 'moment';
import Button from 'react-bootstrap/lib/Button';

import { shallowWithIntl } from 'utils/testUtils';
import OvernightEditSummary from '../OvernightEditSummary';
import { getPrettifiedPeriodUnits } from '../../../utils/timeUtils';


describe('app/shared/overnight-calendar/OvernightEditSummary', () => {
  const startM = moment('2024-02-23 11:00:00');
  const endM = moment('2024-02-25 09:00:00');
  const defaultProps = {
    duration: moment.duration(endM.diff(startM)),
    selected: [],
    endDatetime: '25.2.2024 09:00',
    startDatetime: '23.2.2024 11:00',
    isDurationBelowMin: false,
    minDuration: '1 00:00:00',
    datesSameAsInitial: true,
    onCancel: () => {},
    onConfirm: () => {},
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<OvernightEditSummary {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    test('wrapping div', () => {
      const wrapper = getWrapper().find('div.overnight-edit-summary');
      expect(wrapper).toHaveLength(1);
    });

    test('time range div', () => {
      const div = getWrapper().find('div.overnight-edit-time-range');
      expect(div).toHaveLength(1);
    });

    test("time range div's status div", () => {
      const div = getWrapper().find('.overnight-edit-time-range');
      const statusDiv = div.find('[role="status"]');
      expect(statusDiv).toHaveLength(1);
    });

    describe('when there is a valid time range', () => {
      test('time range text', () => {
        const div = getWrapper().find('.overnight-edit-time-range');
        const text = div.find('[role="status"]');
        const durText = getPrettifiedPeriodUnits(defaultProps.duration, 'common.unit.time.day.short');
        expect(text.text()).toEqual(
          `TimeSlots.selectedDate 23.2.2024 11:00 - 25.2.2024 09:00 (${durText})`);
      });
    });

    describe('when there is an invalid time range', () => {
      const startDatetime = '';
      const div = getWrapper({ startDatetime }).find('.overnight-edit-time-range');
      const statusDiv = div.find('[role="status"]');
      expect(statusDiv.text()).toEqual('');
    });

    describe('when there is min duration error', () => {
      test('error text', () => {
        const paragraph = getWrapper({ datesSameAsInitial: false, isDurationBelowMin: true }).find('p.overnight-error');
        const minDurationText = getPrettifiedPeriodUnits(defaultProps.minDuration, 'common.unit.time.day.short');
        expect(paragraph).toHaveLength(1);
        expect(paragraph.text()).toEqual(`Overnight.belowMinAlert (${minDurationText})`);
      });
    });

    describe('when there isnt min duration error', () => {
      test('doesnt render error text', () => {
        const paragraph = getWrapper({ datesSameAsInitial: false, isDurationBelowMin: false }).find('p.overnight-error');
        expect(paragraph).toHaveLength(0);
      });
    });

    test('reservation controls wrapping div', () => {
      const div = getWrapper().find('div.app-ReservationTime__controls');
      expect(div).toHaveLength(1);
    });

    describe('reservation control buttons', () => {
      const buttons = getWrapper().find(Button);

      test('correct amount of buttons', () => {
        expect(buttons).toHaveLength(2);
      });

      test('first button', () => {
        const firstButton = buttons.first();
        expect(firstButton.prop('bsStyle')).toBe('warning');
        expect(firstButton.prop('className')).toBe('cancel_Button');
        expect(firstButton.prop('onClick')).toBe(defaultProps.onCancel);
        expect(firstButton.prop('children')).toBe('ReservationInformationForm.cancelEdit');
      });

      test('second button', () => {
        const secondButton = buttons.last();
        expect(secondButton.prop('bsStyle')).toBe('primary');
        expect(secondButton.prop('className')).toBe('next_Button');
        expect(secondButton.prop('disabled')).toBe(false);
        expect(secondButton.prop('onClick')).toBe(defaultProps.onConfirm);
        expect(secondButton.prop('children')).toBe('common.continue');
      });
    });
  });
});
