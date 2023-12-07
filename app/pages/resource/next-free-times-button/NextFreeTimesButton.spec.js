import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import NextFreeTimesButton from './NextFreeTimesButton';
import Resource from '../../../utils/fixtures/Resource';

describe('NextFreeTimesButton', () => {
  const defaultProps = {
    addNotification: () => {},
    resource: Resource.build(),
    handleDateChange: () => {},
    selectedDate: '2050-06-29',
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<NextFreeTimesButton {...defaultProps} {...extraProps} />);
  }

  test('renders wrapping div', () => {
    const div = getWrapper();
    expect(div).toHaveLength(1);
    expect(div.prop('className')).toBe('next-free-times');
  });

  test('does not render sr help text by default', () => {
    const text = getWrapper().find('p.visually-hidden');
    expect(text).toHaveLength(0);
  });

  test('renders button correctly initially', () => {
    const button = getWrapper().find('Button');
    expect(button).toHaveLength(1);
    expect(button.prop('className')).toBe('next-free-times-btn visually-hidden');
    expect(button.prop('disabled')).toBe(true);
    expect(button.prop('onClick')).toBeDefined();
    expect(button.children().text()).toBe('ResourceFreeTime.buttonLabel');
  });

  test('does not render searching text initially', () => {
    const text = getWrapper().find('p.next-free-times-searching');
    expect(text).toHaveLength(0);
  });
});
