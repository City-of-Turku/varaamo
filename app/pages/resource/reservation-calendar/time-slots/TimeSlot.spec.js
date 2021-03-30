import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Resource from 'utils/fixtures/Resource';
import TimeSlotFixture from 'utils/fixtures/TimeSlot';
import { shallowWithIntl } from 'utils/testUtils';
import { padLeft } from 'utils/timeUtils';
import TimeSlot from './TimeSlot';

describe('pages/resource/reservation-calendar/time-slots/TimeSlot', () => {
  const defaultProps = {
    addNotification: simple.stub(),
    headerId: 'timeslot-0',
    isAdmin: false,
    isEditing: true,
    isHighlighted: false,
    isUnderMinPeriod: false,
    isLoggedIn: true,
    isSelectable: true,
    onClear: simple.stub(),
    onClick: simple.stub(),
    onMouseEnter: simple.stub(),
    onMouseLeave: simple.stub(),
    resource: Resource.build(),
    selected: false,
    showClear: false,
    slot: Immutable(TimeSlotFixture.build()),
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<TimeSlot {...defaultProps} {...extraProps} />);
  }

  function getClickableButton(props) {
    return getWrapper(props).find('button.app-TimeSlot__action');
  }

  test('renders button.app-TimeSlot__action with correct props', () => {
    const actionButton = getClickableButton();
    expect(actionButton).toHaveLength(1);
    expect(actionButton.prop('aria-describedby')).toBe(defaultProps.headerId);
    expect(actionButton.prop('onClick')).toBeDefined();
    expect(actionButton.prop('onMouseEnter')).toBeDefined();
    expect(actionButton.prop('onMouseLeave')).toBeDefined();
    expect(actionButton.prop('type')).toEqual('button');
  });

  test('renders app-TimeSlot__icon with correct props', () => {
    const icon = getWrapper().find('.app-TimeSlot__icon');
    expect(icon).toHaveLength(1);
    expect(icon.prop('aria-hidden')).toBe('true');
  });

  test('renders app-TimeSlot__icon cooldown when isAdmin', () => {
    const slotWithCooldown = TimeSlotFixture.build({ onCooldown: true });
    const wrapper = getWrapper({
      isAdmin: true,
      slot: slotWithCooldown,
      isPast: false,
      selected: false,
      isHighlighted: false,
      disabled: false,
    });
    const icon = wrapper.find('button.app-TimeSlot__action').find('span').first();
    expect(icon.prop('className')).toBe('app-TimeSlot__icon cooldown');
  });

  test('does not render app-TimeSlot__icon cooldown when not isAdmin', () => {
    const slotWithCooldown = TimeSlotFixture.build({ onCooldown: true });
    const wrapper = getWrapper({
      isAdmin: false,
      slot: slotWithCooldown,
      isPast: false,
      selected: false,
      isHighlighted: false,
      disabled: false,
    });
    const icon = wrapper.find('button.app-TimeSlot__action').find('span').first();
    expect(icon.prop('className')).toBe('app-TimeSlot__icon');
  });

  test('renders app-TimeSlot__status with correct props', () => {
    const status = getWrapper().find('.app-TimeSlot__status');
    const start = new Date(defaultProps.slot.start);
    const expected = `${padLeft(start.getHours())}:${padLeft(start.getMinutes())} TimeSlot.available`;
    expect(status).toHaveLength(1);
    expect(status.prop('aria-label')).toEqual(expected);
  });

  test('does not render clear button when clearing disabled', () => {
    expect(getWrapper().find('button.app-TimeSlot__clear')).toHaveLength(0);
  });

  test('renders clear button when clearing enabled with correct props', () => {
    const clearButton = getWrapper({ showClear: true }).find('button.app-TimeSlot__clear');
    expect(clearButton).toHaveLength(1);
    expect(clearButton.prop('type')).toBe('button');
    expect(clearButton.prop('aria-label')).toBe('TimeSlot.label.removeSelection');
  });

  describe('skip to summary link', () => {
    describe('when state.showClear is true', () => {
      test('renders with correct props', () => {
        const skipLink = getWrapper({ showClear: true }).find('a.app-TimeSlot__skip');
        expect(skipLink).toHaveLength(1);
        expect(skipLink.prop('href')).toBe('#timetable-summary');
        expect(skipLink.prop('aria-label')).toBe('TimeSlot.label.skipToSummary');
        expect(skipLink.prop('onBlur')).toBeDefined();
        expect(skipLink.prop('onFocus')).toBeDefined();
      });

      test('has class visually-hidden when state.showSkip is false', () => {
        const wrapper = getWrapper({ showClear: true });
        const instance = wrapper.instance();
        instance.setState({ showSkip: false });
        const skipLink = wrapper.find('a.app-TimeSlot__skip');
        expect(skipLink.hasClass('visually-hidden')).toBe(true);
      });

      test('does not have class visually-hidden when state.showSkip is true', () => {
        const wrapper = getWrapper({ showClear: true });
        const instance = wrapper.instance();
        instance.setState({ showSkip: true });
        const skipLink = wrapper.find('a.app-TimeSlot__skip');
        expect(skipLink.hasClass('visually-hidden')).toBe(false);
      });

      test('renders skip link icon', () => {
        const skipLinkIcon = getWrapper({ showClear: true }).find('span.app-TimeSlot__skip-icon');
        expect(skipLinkIcon.length).toBe(1);
      });
    });

    describe('when state.showClear is false', () => {
      test('does not render', () => {
        const skipLink = getWrapper({ showClear: false }).find('a.app-TimeSlot__skip');
        expect(skipLink).toHaveLength(0);
      });

      test('does not  render skip link icon', () => {
        const skipLinkIcon = getWrapper({ showClear: false }).find('span.app-TimeSlot__skip-icon');
        expect(skipLinkIcon.length).toBe(0);
      });
    });
  });

  test('renders slot start time as button text', () => {
    const start = new Date(defaultProps.slot.start);
    const expected = `${padLeft(start.getHours())}:${padLeft(start.getMinutes())}`;
    const timeText = getWrapper().find('time.app-TimeSlot__time');
    expect(timeText.length).toBe(1);
    expect(timeText.text()).toContain(expected);
    expect(timeText.prop('aria-hidden')).toBe('true');
  });

  test('disables the time slot when isDisabled prop is true', () => {
    expect(getWrapper({ isDisabled: true }).find('div.app-TimeSlot--disabled')).toHaveLength(1);
  });

  describe('button onClick when user is not logged in', () => {
    let instance;
    let wrapper;
    let button;

    beforeAll(() => {
      wrapper = getWrapper({ isLoggedIn: false });
      instance = wrapper.instance();
      button = wrapper.find('button.app-TimeSlot__action');
      instance.handleClick = simple.mock();
    });

    afterEach(() => {
      instance.handleClick.reset();
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls handleClick with disabled true', () => {
      expect(typeof button.prop('onClick')).toBe('function');
      button.prop('onClick')();
      expect(instance.handleClick.callCount).toBe(1);
      expect(instance.handleClick.lastCall.args).toEqual([true]);
    });
  });

  describe('button onClick when user is logged in', () => {
    let instance;
    let wrapper;
    let button;

    beforeAll(() => {
      wrapper = getWrapper({ isLoggedIn: true });
      instance = wrapper.instance();
      button = wrapper.find('button.app-TimeSlot__action');
      instance.handleClick = simple.mock();
    });

    afterEach(() => {
      instance.handleClick.reset();
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls handleClick with disabled false', () => {
      expect(typeof button.prop('onClick')).toBe('function');
      button.prop('onClick')();
      expect(instance.handleClick.callCount).toBe(1);
      expect(instance.handleClick.lastCall.args).toEqual([false]);
    });
  });

  describe('getReservationInfoNotification', () => {
    test('returns null when slot end in past', () => {
      const t = simple.stub();
      const slot = { end: '2016-10-11T10:00:00.000Z' };
      const instance = getWrapper().instance();
      const result = instance.getReservationInfoNotification(true, {}, slot, t);

      expect(result).toBeNull();
      expect(t.callCount).toBe(0);
    });

    test('returns null when slot reserved', () => {
      const t = simple.stub();
      const slot = { reserved: true };
      const instance = getWrapper().instance();
      const result = instance.getReservationInfoNotification(true, {}, slot, t);

      expect(result).toBeNull();
      expect(t.callCount).toBe(0);
    });

    test('returns message when not logged in and resource is reservable', () => {
      const message = 'some message';
      const t = simple.stub().returnWith(message);
      const resource = Resource.build({ reservable: true });
      const instance = getWrapper().instance();
      const result = instance.getReservationInfoNotification(false, resource, defaultProps.slot, t);

      expect(t.callCount).toBe(1);
      expect(result.message).toBe(message);
      expect(result.type).toBe('info');
      expect(result.timeOut).toBe(10000);
    });

    test('returns correct message when logged in', () => {
      const t = simple.stub();
      const resource = Resource.build({ reservationInfo: 'reservation info' });
      const instance = getWrapper().instance();
      const result = instance.getReservationInfoNotification(true, resource, defaultProps.slot, t);

      expect(t.callCount).toBe(1);
      expect(result.message).toBe(t('Notifications.noRightToReserve'));
      expect(result.type).toBe('info');
      expect(result.timeOut).toBe(10000);
    });
  });

  describe('handleClick when disabled is true', () => {
    const addNotification = simple.stub();
    const onClick = simple.stub();
    const message = {
      message: 'some message',
      type: 'info',
      timeOut: 100,
    };
    let instance;
    let wrapper;

    beforeAll(() => {
      wrapper = getWrapper({
        addNotification,
        isLoggedIn: false,
        onClick,
      });
      instance = wrapper.instance();
      simple.mock(instance, 'getReservationInfoNotification').returnWith(message);
      wrapper.instance().handleClick(true);
    });

    afterAll(() => {
      instance.getReservationInfoNotification.reset();
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls addNotification prop', () => {
      expect(onClick.callCount).toBe(0);
      expect(instance.getReservationInfoNotification.callCount).toBe(1);
      expect(addNotification.callCount).toBe(1);
      expect(addNotification.lastCall.args).toEqual([message]);
    });
  });

  describe('show warning notification', () => {
    const addNotification = simple.stub();
    const onClick = simple.stub();
    let instance;
    let wrapper;

    beforeAll(() => {
      wrapper = getWrapper({
        addNotification,
        isLoggedIn: true,
        onClick,
        isUnderMinPeriod: true
      });
      instance = wrapper.instance();
      instance.handleClick(false);
    });

    afterAll(() => {
      simple.restore();
    });

    test('when isUnderMinPeriod is true', () => {
      expect(onClick.callCount).toBe(0);
      expect(addNotification.callCount).toBe(1);
      expect(addNotification.lastCall.args).toEqual([{
        message: 'Notifications.selectTimeToReserve.warning',
        type: 'info',
        timeOut: 10000,
      }]);
    });
  });

  test('when disabled is false', () => {
    const addNotification = simple.stub();
    const onClick = simple.stub();
    const wrapper = getWrapper({ addNotification, onClick });
    wrapper.instance().handleClick(false);

    expect(addNotification.callCount).toBe(0);
    expect(onClick.callCount).toBe(1);
    expect(onClick.lastCall.args).toEqual([
      {
        begin: defaultProps.slot.start,
        end: defaultProps.slot.end,
        resource: defaultProps.resource,
      },
    ]);
  });

  describe('clear button onClick when clear button is available', () => {
    let wrapper;
    let button;
    const onClear = simple.stub();

    beforeAll(() => {
      wrapper = getWrapper({ showClear: true, onClear });
      button = wrapper.find('button.app-TimeSlot__clear');
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls onClear function', () => {
      expect(typeof button.prop('onClick')).toBe('function');
      button.prop('onClick')();
      expect(onClear.callCount).toBe(1);
    });
  });

  describe('getSelectButtonStatusLabel', () => {
    // Params in order: isDisabled, isLoggedIn, isOwnReservation, isReserved, isSelected
    test('return correct string when timeslot is own reservation', () => {
      expect(getWrapper().instance()
        .getSelectButtonStatusLabel(false, false, true, false, false))
        .toBe('TimeSlot.notSelectable - TimeSlot.ownReservation');
    });
    test('return correct string when timeslot is reserved', () => {
      expect(getWrapper().instance()
        .getSelectButtonStatusLabel(false, false, false, true, false))
        .toBe('TimeSlot.notSelectable - TimeSlot.reserved');
    });
    test('return correct string when timeslot is selected', () => {
      expect(getWrapper().instance()
        .getSelectButtonStatusLabel(false, false, false, false, true))
        .toBe('TimeSlot.selected');
    });
    test('return correct string when timeslot is not selectable', () => {
      expect(getWrapper().instance()
        .getSelectButtonStatusLabel(true, true, false, false, false))
        .toBe('TimeSlot.notSelectable');
    });
    test('return correct string when timeslot is not selectable and user is not logged in', () => {
      expect(getWrapper().instance()
        .getSelectButtonStatusLabel(true, false, false, false, false))
        .toBe('TimeSlot.notSelectable - TimeSlot.logInFirst');
    });
    test('return correct string when timeslot is available', () => {
      expect(getWrapper().instance()
        .getSelectButtonStatusLabel(false, true, false, false, false))
        .toBe('TimeSlot.available');
    });
  });

  describe('handleSkipBlur', () => {
    test('sets state.showSkip to false', () => {
      const instance = getWrapper().instance();
      instance.setState({ showSkip: true });
      instance.handleSkipBlur();
      expect(instance.state.showSkip).toBe(false);
    });
  });

  describe('handleSkipFocus', () => {
    test('sets state.showSkip to true', () => {
      const instance = getWrapper().instance();
      instance.setState({ showSkip: false });
      instance.handleSkipFocus();
      expect(instance.state.showSkip).toBe(true);
    });
  });
});
