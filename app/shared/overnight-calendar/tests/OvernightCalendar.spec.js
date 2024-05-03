import React from 'react';
import MomentLocaleUtils from 'react-day-picker/moment';
import moment from 'moment';
import DayPicker from 'react-day-picker';

import { shallowWithIntl } from 'utils/testUtils';
import Resource from '../../../utils/fixtures/Resource';
import { UnconnectedOvernightCalendar as OvernightCalendar } from '../OvernightCalendar';
import OvernightHiddenHeading from '../OvernightHiddenHeading';
import OvernightLegends from '../OvernightLegends';
import OvernightSummary from '../OvernightSummary';
import OvernightEditSummary from '../OvernightEditSummary';


describe('app/shared/overnight-calendar/OvernightCalendar', () => {
  const resource = Resource.build({
    reservations: [],
    overnightReservations: true,
    overnightEndTime: '09:00:00',
    overnightStartTime: '11:00:00',
  });
  const defaultProps = {
    currentLanguage: 'fi',
    resource,
    selected: [],
    actions: {
      setSelectedDatetimes: () => {},
      addNotification: () => {},
    },
    history: {},
    isResourceAdmin: false,
    isResourceManager: false,
    isSuperuser: false,
    isLoggedIn: false,
    isStrongAuthSatisfied: false,
    isMaintenanceModeOn: false,
    onEditCancel: () => {},
    onEditConfirm: () => {},
    handleDateChange: () => {},
    selectedDate: '2024-02-18',
    params: { id: resource.id },
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<OvernightCalendar {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    test('null, when resource is missing reservations', () => {
      const wrapper = getWrapper({ resource: {} });
      expect(wrapper.html()).toBeNull();
    });

    test('wrapping div', () => {
      const wrapper = getWrapper();
      expect(wrapper.find('div.overnight-calendar')).toHaveLength(1);
    });

    test('OvernightHiddenHeading', () => {
      const heading = getWrapper().find(OvernightHiddenHeading);
      expect(heading).toHaveLength(1);
      expect(heading.prop('date')).toEqual(moment(defaultProps.selectedDate).toDate());
      expect(heading.prop('locale')).toBe(defaultProps.currentLanguage);
      expect(heading.prop('localeUtils')).toBe(MomentLocaleUtils);
    });

    test('DayPicker', () => {
      const dayPicker = getWrapper().find(DayPicker);
      expect(dayPicker).toHaveLength(1);
      expect(dayPicker.prop('disabledDays')).toBeDefined();
      expect(dayPicker.prop('enableOutsideDays')).toBe(true);
      expect(dayPicker.prop('firstDayOfWeek')).toBe(1);
      expect(dayPicker.prop('initialMonth')).toEqual(moment(defaultProps.selectedDate).toDate());
      expect(dayPicker.prop('labels')).toStrictEqual({ previousMonth: 'Overnight.prevMonth', nextMonth: 'Overnight.nextMonth' });
      expect(dayPicker.prop('locale')).toBe(defaultProps.currentLanguage);
      expect(dayPicker.prop('localeUtils')).toBe(MomentLocaleUtils);
      expect(dayPicker.prop('modifiers')).toBeDefined();
      expect(dayPicker.prop('onDayClick')).toBeDefined();
      expect(dayPicker.prop('onMonthChange')).toBeDefined();
      expect(dayPicker.prop('selectedDays')).toStrictEqual([null, null]);
      expect(dayPicker.prop('showOutsideDays')).toBe(true);
      expect(dayPicker.prop('todayButton')).toBe('Overnight.currentMonth');
    });

    test('OvernightLegends', () => {
      const legends = getWrapper().find(OvernightLegends);
      expect(legends).toHaveLength(1);
    });

    describe('when not editing', () => {
      test('OvernightSummary', () => {
        const summary = getWrapper().find(OvernightSummary);
        expect(summary).toHaveLength(1);
        expect(summary.prop('duration')).toBeDefined();
        expect(summary.prop('endDatetime')).toBe('');
        expect(summary.prop('handleSelectDatetimes')).toBeDefined();
        expect(summary.prop('isDurationBelowMin')).toBe(false);
        expect(summary.prop('minDuration')).toBe(defaultProps.resource.minPeriod);
        expect(summary.prop('selected')).toBe(defaultProps.selected);
        expect(summary.prop('startDatetime')).toBe('');
      });

      test('OvernightEditSummary is not rendered', () => {
        const editSummary = getWrapper().find(OvernightEditSummary);
        expect(editSummary).toHaveLength(0);
      });
    });

    describe('when editing', () => {
      // editing when something is preselected
      const selected = [
        {
          begin: '2024-02-18T09:00:00',
          end: '2024-02-19T11:00:00',
          resource: resource.id,
        },
        {
          begin: '2024-02-18T09:00:00',
          end: '2024-02-19T11:00:00',
          resource: resource.id,
        }
      ];

      test('OvernightSummary is not rendered', () => {
        const summary = getWrapper({ selected }).find(OvernightSummary);
        expect(summary).toHaveLength(0);
      });

      test('OvernightEditSummary', () => {
        const editSummary = getWrapper({ selected }).find(OvernightEditSummary);
        expect(editSummary).toHaveLength(1);
        expect(editSummary.prop('datesSameAsInitial')).toBe(true);
        expect(editSummary.prop('duration')).toBeDefined();
        expect(editSummary.prop('endDatetime')).toBe('19.2.2024 09:00');
        expect(editSummary.prop('isDurationBelowMin')).toBe(false);
        expect(editSummary.prop('minDuration')).toBe(defaultProps.resource.minPeriod);
        expect(editSummary.prop('onCancel')).toBe(defaultProps.onEditCancel);
        expect(editSummary.prop('onConfirm')).toBeDefined();
        expect(editSummary.prop('selected')).toBe(selected);
        expect(editSummary.prop('startDatetime')).toBe('18.2.2024 11:00');
      });
    });
  });
});
