import React from 'react';
import moment from 'moment';
import Button from 'react-bootstrap/lib/Button';

import { shallowWithIntl } from 'utils/testUtils';
import { getPrettifiedPeriodUnits } from '../../../utils/timeUtils';
import OvernightSummary from '../OvernightSummary';


describe('app/shared/overnight-calendar/OvernightSummary', () => {
  const startM = moment('2024-02-23 11:00:00');
  const endM = moment('2024-02-25 09:00:00');
  const defaultProps = {
    duration: moment.duration(endM.diff(startM)),
    selected: [],
    endDatetime: '25.2.2024 09:00',
    startDatetime: '23.2.2024 11:00',
    isDurationBelowMin: false,
    minDuration: '1 00:00:00',
    maxDuration: '10 00:00:00',
    isDurationOverMax: false,
    handleSelectDatetimes: () => {},
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<OvernightSummary {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    describe('wrapping div', () => {
      test('when there is valid time range', () => {
        const wrapper = getWrapper().find('div.overnight-summary');
        expect(wrapper).toHaveLength(1);
      });
      test('when there isnt valid time range', () => {
        const startDatetime = '';
        const wrapper = getWrapper({ startDatetime }).find('div.overnight-summary');
        expect(wrapper).toHaveLength(1);
        expect(wrapper.prop('className')).toBe('overnight-summary sr-only');
      });
    });

    test('hidden h3', () => {
      const heading = getWrapper().find('h3.visually-hidden');
      expect(heading).toHaveLength(1);
      expect(heading.text()).toEqual('ReservationCalendar.Confirmation.header');
      expect(heading.prop('id')).toBe('timetable-summary');
    });

    test('time range div', () => {
      const div = getWrapper().find('div.summary-time-range');
      expect(div).toHaveLength(1);
      expect(div.prop('role')).toBe('status');
    });

    describe('when there is a valid time range', () => {
      test('time range text', () => {
        const div = getWrapper().find('.summary-time-range');
        const durText = getPrettifiedPeriodUnits(defaultProps.duration, 'common.unit.time.day.short');
        expect(div.text()).toEqual(
          `TimeSlots.selectedDate 23.2.2024 11:00 - 25.2.2024 09:00 (${durText})`);
      });
    });

    describe('when there is an invalid time range', () => {
      test('doesnt render time range', () => {
        const startDatetime = '';
        const div = getWrapper({ startDatetime }).find('.summary-time-range');
        expect(div.text()).toEqual('');
      });
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

    describe('when there is max duration error', () => {
      test('error text', () => {
        const paragraph = getWrapper({ datesSameAsInitial: false, isDurationOverMax: true }).find('p.overnight-error');
        const maxDurationText = getPrettifiedPeriodUnits(defaultProps.maxDuration, 'common.unit.time.day.short');
        expect(paragraph).toHaveLength(1);
        expect(paragraph.text()).toEqual(`Overnight.overMaxAlert (${maxDurationText})`);
      });
    });

    describe('when there isnt max duration error', () => {
      test('doesnt render error text', () => {
        const paragraph = getWrapper({ datesSameAsInitial: false, isDurationOverMax: false }).find('p.overnight-error');
        expect(paragraph).toHaveLength(0);
      });
    });

    test('reserve button', () => {
      const button = getWrapper().find(Button);
      expect(button.prop('bsStyle')).toBe('primary');
      expect(button.prop('disabled')).toBe(false);
      expect(button.prop('onClick')).toBe(defaultProps.handleSelectDatetimes);
      expect(button.prop('children')).toBe('TimeSlots.reserveButton');
    });
  });
});
