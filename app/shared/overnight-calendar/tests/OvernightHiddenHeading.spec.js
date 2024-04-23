import React from 'react';
import moment from 'moment';
import MomentLocaleUtils from 'react-day-picker/moment';

import { shallowWithIntl } from 'utils/testUtils';
import OvernightHiddenHeading from '../OvernightHiddenHeading';


describe('app/shared/overnight-calendar/OvernightHiddenHeading', () => {
  const defaultProps = {
    date: moment('2024-02-23').toDate(),
    localeUtils: MomentLocaleUtils,
    locale: 'fi',
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<OvernightHiddenHeading {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    test('wrapping div', () => {
      const wrapper = getWrapper();
      expect(wrapper).toHaveLength(1);
      expect(wrapper.prop('className')).toBe('sr-only');
    });

    test('heading', () => {
      const heading = getWrapper().find('h3');
      expect(heading).toHaveLength(1);
      expect(heading.text()).toBe('Overnight.calendar');
    });

    test('paragraph', () => {
      const paragraph = getWrapper().find('p');
      const { localeUtils, locale, date } = defaultProps;
      const expectedText = localeUtils.formatMonthTitle(date, locale);
      expect(paragraph).toHaveLength(1);
      expect(paragraph.prop('role')).toBe('status');
      expect(paragraph.text()).toBe(expectedText);
    });
  });
});
