import React from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
import { UnconnectedDatePicker as DatePicker } from './DatePicker';

function getWrapper(props) {
  const defaults = {
    onChange: () => null,
    value: '2016-12-12',
    t: () => {},
  };
  return shallowWithIntl(<DatePicker {...defaults} {...props} />);
}

describe('shared/date-picker/DatePicker', () => {
  describe('DateField', () => {
    function getDateFieldWrapper(props) {
      return getWrapper(props).find(DayPickerInput);
    }

    test('is rendered', () => {
      expect(getDateFieldWrapper()).toHaveLength(1);
    });

    test('has correct props', () => {
      const input = getDateFieldWrapper();
      expect(input.prop('classNames')).toEqual({
        container: 'date-picker',
        overlay: 'date-picker-overlay',
      });

      expect(input.prop('dayPickerProps')).toEqual({
        showOutsideDays: true,
        localeUtils: expect.any(Object),
        locale: 'fi',
        todayButton: 'common.today'
      });

      expect(input.prop('inputProps')).toEqual({
        'aria-label': 'DatePickerControl.buttonLabel',
      });

      expect(input.prop('format')).toBe('D.M.YYYY');
      expect(input.prop('formatDate')).toStrictEqual(expect.any(Function));
      expect(input.prop('keepFocus')).toBe(false);
      expect(input.prop('onDayChange')).toStrictEqual(expect.any(Function));
      expect(input.prop('parseDate')).toStrictEqual(expect.any(Function));
      expect(input.prop('value')).toStrictEqual(new Date('2016-12-12'));
    });

    test('has glyphicon span', () => {
      const input = getDateFieldWrapper();
      const span = input.find('span');
      expect(span.hasClass('glyphicon')).toBe(true);
      expect(span.hasClass('glyphicon-calendar')).toBe(true);
    });

    test('changing date calls onDayChange with date in correct format', () => {
      const onChange = simple.mock();
      const dateField = getDateFieldWrapper({ onChange });
      const newDate = '2011-10-05T14:48:00.000Z';
      const expectedDate = '2011-10-05';
      dateField.prop('onDayChange')(newDate);
      expect(onChange.callCount).toBe(1);
      expect(onChange.lastCall.arg).toBe(expectedDate);
    });

    test('have default locale prop', () => {
      const defaultLocale = 'fi';
      const dateField = getDateFieldWrapper();

      expect(dateField.prop('dayPickerProps').locale).toEqual(defaultLocale);
    });

    test('have locale prop passed from redux state', () => {
      const mockLocale = 'se';
      const dateField = getDateFieldWrapper({ currentLocale: mockLocale });

      expect(dateField.prop('dayPickerProps').locale).toEqual(mockLocale);
    });
  });
});
