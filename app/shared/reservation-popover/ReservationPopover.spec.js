import { shallow } from 'enzyme';
import simple from 'simple-mock';
import React from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

import { shallowWithIntl } from 'utils/testUtils';
import ReservationPopover from './ReservationPopover';

function getWrapper(props) {
  const defaultProps = {
    children: <div />,
    onCancel: simple.stub(),
    begin: '2016-01-01T10:00:00Z',
    end: '2016-01-01T12:00:00Z',
    notValidTime: false,
  };
  return shallowWithIntl(<ReservationPopover {...defaultProps} {...props} />);
}

describe('shared/reservation-popover/ReservationPopover', () => {
  function getInternalPopover(props) {
    const overlay = getWrapper({
      ...props,
    }).find(OverlayTrigger);
    return shallow(overlay.prop('overlay'));
  }

  test('renders length with hours and minutes', () => {
    const span = getInternalPopover().find('.reservation-popover__length');
    expect(span.text()).toBe('(2h 0min)');
  });

  test('renders length with only minutes if less than an hour', () => {
    const extraProps = {
      begin: '2016-01-01T10:00:00Z',
      end: '2016-01-01T10:30:00Z',
    };
    const span = getInternalPopover(extraProps).find('.reservation-popover__length');
    expect(span.text()).toBe('(30min)');
  });

  test('className limit-alert is added when duration is not within limits', () => {
    const extraProps = {
      begin: '2016-01-01T10:00:00Z',
      end: '2016-01-01T10:30:00Z',
      minPeriod: '01:00:00',
    };
    const span = getInternalPopover(extraProps).find('.limit-alert');
    expect(span.length).toBe(1);
  });

  describe('duration limits', () => {
    test('renders min limit when minPeriod is given', () => {
      const minPeriod = '01:00:00';
      const span = getInternalPopover({ minPeriod }).find('.reservation-popover__period-limit');
      expect(span.text()).toBe('1h 0min');
    });

    test('renders max limit when maxPeriod is given', () => {
      const maxPeriod = '02:30:00';
      const span = getInternalPopover({ maxPeriod }).find('.reservation-popover__period-limit');
      expect(span.text()).toBe('2h 30min');
    });

    test('renders both limits when both maxPeriod and minPeriod are given', () => {
      const minPeriod = '00:30:00';
      const maxPeriod = '02:00:00';
      const spans = getInternalPopover({ minPeriod, maxPeriod }).find('.reservation-popover__period-limit');
      expect(spans.at(0).text()).toBe('30min');
      expect(spans.at(1).text()).toBe('2h 0min');
    });

    test('renders no limits when both max and min period are not given', () => {
      const span = getInternalPopover().find('.reservation-popover__limits');
      expect(span.length).toBe(0);
    });
  });

  test('renders warning when notValidTime is true', () => {
    const span = getInternalPopover({ notValidTime: true }).find('.reservation-popover__length.limit-alert');
    expect(span.length).toBe(1);
    expect(span.text()).toBe('ReservationPopover.slotAlignWarning');
  });

  test('does not render slot align warning when notValidTime is false', () => {
    const span = getInternalPopover({ notValidTime: false }).find('.reservation-popover__length.limit-alert');
    expect(span.length).toBe(0);
  });

  test('renders cancel icon', () => {
    const onCancel = () => null;
    const icon = getInternalPopover({ onCancel }).find('.reservation-popover__cancel');
    expect(icon.is(Glyphicon)).toBe(true);
    expect(icon.prop('glyph')).toBe('trash');
    expect(icon.prop('onClick')).toBe(onCancel);
  });
});
