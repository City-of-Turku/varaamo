import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';
import moment from 'moment';

import Resource from 'utils/fixtures/Resource';
import { shallowWithIntl } from 'utils/testUtils';
import TimeSlots from './TimeSlots';
import TimeSlotComponent from './TimeSlot';
import TimeSlotPlaceholder from './TimeSlotPlaceholder';

describe('pages/resource/reservation-calendar/time-slots/TimeSlots', () => {
  const defaultSlots = [
    [
      {
        asISOString: '2016-10-10T10:00:00.000Z/2016-10-10T11:00:00.000Z',
        asString: '10:00-11:00',
        end: '2016-10-10T11:00:00.000Z',
        index: 0,
        reserved: false,
        resource: 'some-resource-id',
        start: '2016-10-10T10:00:00.000Z',
      },
    ],
    [
      {
        asISOString: '2016-10-11T10:00:00.000Z/2016-10-11T11:00:00.000Z',
        asString: '10:00-11:00',
        end: '2016-10-11T11:00:00.000Z',
        index: 0,
        reserved: false,
        resource: 'some-resource-id',
        start: '2016-10-11T10:00:00.000Z',
      },
    ],
  ];
  const defaultProps = {
    addNotification: simple.stub(),
    isAdmin: false,
    isEditing: false,
    isFetching: false,
    isLoggedIn: true,
    isStrongAuthSatisfied: true,
    isUnderMinPeriod: false,
    onClear: simple.stub(),
    onClick: simple.stub(),
    resource: Resource.build(),
    selected: [
      {
        begin: defaultSlots[0][0].start,
        end: defaultSlots[0][0].end,
        resource: defaultSlots[0][0].resource,
      },
    ],
    selectedDate: '2016-10-10',
    slots: Immutable(defaultSlots),
    isMaintenanceModeOn: false,
  };

  function getWrapper(props) {
    return shallowWithIntl(<TimeSlots {...defaultProps} {...props} />);
  }

  describe('skip to selected date link', () => {
    test('renders with correct props', () => {
      const skipLink = getWrapper().find('.reservation-calendar-skip-to-selected-date');

      expect(skipLink.length).toBe(1);
      expect(skipLink.prop('href')).toEqual('#selected-date');
      expect(skipLink.prop('onBlur')).toBeDefined();
      expect(skipLink.prop('onFocus')).toBeDefined();
      expect(skipLink.prop('type')).toEqual('button');
      expect(skipLink.text()).toEqual('TimeSlots.label.skipToSelectedDate');
    });

    test('has class visually-hidden when state.showSkip is false', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      instance.setState({ showSkip: false });
      const skipLink = wrapper.find('.reservation-calendar-skip-to-selected-date');
      expect(skipLink.hasClass('visually-hidden')).toBe(true);
    });

    test('does not have class visually-hidden when state.showSkip is true', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      instance.setState({ showSkip: true });
      const skipLink = wrapper.find('.reservation-calendar-skip-to-selected-date');
      expect(skipLink.hasClass('visually-hidden')).toBe(false);
    });
  });

  test('renders div.app-TimeSlots', () => {
    const div = getWrapper().find('div.app-TimeSlots');
    expect(div).toHaveLength(1);
  });

  test('renders timeslot weekday headers with correct props and text', () => {
    const headers = getWrapper().find('h4.app-TimeSlots--date--header');
    // default test slots has two different days
    expect(headers.length).toBe(2);

    expect(headers.at(0).prop('aria-label')).toEqual(moment(defaultSlots[0][0].start).format('dddd D.M.'));
    // first header text is correct
    expect(headers.at(0).text())
      .toBe(defaultSlots[0][0] && defaultSlots[0][0].start
        ? moment(defaultSlots[0][0].start).format('dd D.M') : '');

    expect(headers.at(1).prop('aria-label')).toEqual(moment(defaultSlots[1][0].start).format('dddd D.M.'));
    // second header text is correct
    expect(headers.at(1).text())
      .toBe(defaultSlots[1][0] && defaultSlots[1][0].start
        ? moment(defaultSlots[1][0].start).format('dd D.M') : '');
  });

  test('timeslot weekday headers have correct ids', () => {
    const wrapper = getWrapper();
    const headers = wrapper.find('h4.app-TimeSlots--date--header');
    expect(headers.length).toBe(2);

    // first header should be the selected date based on default props
    const firstHeader = wrapper.find('#selected-date');
    expect(firstHeader.length).toBe(1);
    expect(firstHeader).toEqual(headers.at(0));

    // non selected headers should have id "dateslot-index"
    const secondHeader = wrapper.find('#dateslot-1');
    expect(secondHeader.length).toBe(1);
    expect(secondHeader).toEqual(headers.at(1));
  });

  describe('rendering individual time slots', () => {
    function getTimeSlotsWrapper(props) {
      return getWrapper(props).find(TimeSlotComponent);
    }

    test('renders a TimeSlot component for every time slot in props', () => {
      expect(getTimeSlotsWrapper()).toHaveLength(2);
    });

    test('passes correct props to TimeSlots', () => {
      const timeSlots = getTimeSlotsWrapper();
      timeSlots.forEach((timeSlot, index) => {
        expect(timeSlot.props().addNotification).toBe(defaultProps.addNotification);
        // first timeslot header id should be "selected-date" and after that "dateslot-index"
        expect(timeSlot.props().headerId).toBe(index === 0 ? 'selected-date' : 'dateslot-1');
        expect(timeSlot.props().isAdmin).toBe(defaultProps.isAdmin);
        expect(timeSlot.props().isEditing).toBe(defaultProps.isEditing);
        expect(timeSlot.props().isLoggedIn).toBe(defaultProps.isLoggedIn);
        expect(timeSlot.props().isStrongAuthSatisfied).toBe(defaultProps.isStrongAuthSatisfied);
        expect(timeSlot.props().isUnderMinPeriod).toBe(defaultProps.isUnderMinPeriod);
        expect(timeSlot.props().isStaff).toBe(defaultProps.isStaff);
        expect(timeSlot.props().onClick).toBe(defaultProps.onClick);
        expect(timeSlot.props().resource).toEqual(defaultProps.resource);
        expect(timeSlot.props().slot).toEqual(defaultProps.slots[index][0]);
        expect(timeSlot.props().isMaintenanceModeOn).toEqual(defaultProps.isMaintenanceModeOn);
      });
    });

    test('passes correct selected as a prop to TimeSlot', () => {
      const timeSlots = getTimeSlotsWrapper();
      expect(timeSlots.at(0).props().selected).toBe(true);
      expect(timeSlots.at(1).props().selected).toBe(false);
    });
  });

  test(
    'renders reserved slot and slots after reserved as not selectable',
    () => {
      const slots = [
        [
          {
            asISOString: '2016-10-10T10:00:00.000Z/2016-10-10T11:00:00.000Z',
            asString: '10:00-11:00',
            end: '2016-10-10T11:00:00.000Z',
            index: 0,
            reserved: false,
            resource: 'some-resource-id',
            start: '2016-10-10T10:00:00.000Z',
          },
          {
            asISOString: '2016-10-10T11:00:00.000Z/2016-10-10T12:00:00.000Z',
            asString: '11:00-12:00',
            end: '2016-10-10T12:00:00.000Z',
            index: 0,
            reserved: true,
            resource: 'some-resource-id',
            start: '2016-10-10T11:00:00.000Z',
          },
        ],
        [
          {
            asISOString: '2016-10-11T10:00:00.000Z/2016-10-11T11:00:00.000Z',
            asString: '10:00-11:00',
            end: '2016-10-11T11:00:00.000Z',
            index: 0,
            reserved: false,
            resource: 'some-resource-id',
            start: '2016-10-11T10:00:00.000Z',
          },
        ],
      ];
      const selected = [
        {
          begin: slots[0][0].start,
          end: slots[0][0].end,
          resource: slots[0][0].resource,
        },
      ];
      const timeSlots = getWrapper({ selected, slots }).find(TimeSlotComponent);

      expect(timeSlots).toHaveLength(3);
      expect(timeSlots.at(0).props().isSelectable).toBe(true);
      expect(timeSlots.at(1).props().isSelectable).toBe(false);
      expect(timeSlots.at(2).props().isSelectable).toBe(false);
    }
  );

  test('renders a closed message when resource is not open', () => {
    const closedSlot = [[{ start: '2016-10-12T10:00:00.000Z' }]];
    const props = {
      slots: [...defaultProps.slots, ...closedSlot],
    };
    const wrapper = getWrapper(props);
    const timeSlots = wrapper.find(TimeSlotComponent);
    const closedMessage = wrapper.find('.app-TimeSlots--closed');

    expect(timeSlots).toHaveLength(2);
    expect(closedMessage).toHaveLength(1);
  });

  test('does not render empty slots', () => {
    const emptySlot = [[]];
    const props = {
      slots: [...defaultProps.slots, ...emptySlot],
    };
    const timeSlots = getWrapper(props).find(TimeSlotComponent);

    expect(timeSlots).toHaveLength(2);
  });

  test('renders a positional placeholder if the start times differ', () => {
    const slots = [
      [
        {
          asISOString: '2016-10-10T10:00:00.000Z/2016-10-10T11:00:00.000Z',
          asString: '10:00-11:00',
          end: '2016-10-10T11:00:00.000Z',
          index: 0,
          reserved: false,
          resource: 'some-resource-id',
          start: '2016-10-10T10:00:00.000Z',
        },
      ],
      [
        {
          asISOString: '2016-10-11T11:00:00.000Z/2016-10-11T12:00:00.000Z',
          asString: '11:00-12:00',
          end: '2016-10-11T12:00:00.000Z',
          index: 0,
          reserved: false,
          resource: 'some-resource-id',
          start: '2016-10-11T11:00:00.000Z',
        },
      ],
    ];
    const placeholder = getWrapper({ slots }).find(TimeSlotPlaceholder);
    expect(placeholder).toHaveLength(1);
    expect(placeholder.prop('size')).toBe(1);
  });

  test(
    'changes the size of the placeholder based on the length of the time slot',
    () => {
      const slots = [
        [
          {
            asISOString: '2016-10-10T10:00:00.000Z/2016-10-10T10:30:00.000Z',
            asString: '10:00-10:30',
            end: '2016-10-10T10:30:00.000Z',
            index: 0,
            reserved: false,
            resource: 'some-resource-id',
            start: '2016-10-10T10:00:00.000Z',
          },
        ],
        [
          {
            asISOString: '2016-10-11T11:00:00.000Z/2016-10-11T11:30:00.000Z',
            asString: '11:00-11:30',
            end: '2016-10-11T11:30:00.000Z',
            index: 0,
            reserved: false,
            resource: 'some-resource-id',
            start: '2016-10-11T11:00:00.000Z',
          },
        ],
      ];
      const placeholder = getWrapper({ slots }).find(TimeSlotPlaceholder);
      expect(placeholder).toHaveLength(1);
      expect(placeholder.prop('size')).toBe(2);
    }
  );

  test(
    'renders positional placeholders with mobile offsets if all mobile view columns have placeholders',
    () => {
      const slots = [
        [
          {
            asISOString: '2016-10-10T10:00:00.000Z/2016-10-10T11:00:00.000Z',
            asString: '10:00-11:00',
            end: '2016-10-10T11:00:00.000Z',
            index: 0,
            reserved: false,
            resource: 'some-resource-id',
            start: '2016-10-10T10:00:00.000Z',
          },
        ],
        [
          {
            asISOString: '2016-10-11T12:00:00.000Z/2016-10-11T13:00:00.000Z',
            asString: '12:00-13:00',
            end: '2016-10-11T13:00:00.000Z',
            index: 0,
            reserved: false,
            resource: 'some-resource-id',
            start: '2016-10-11T12:00:00.000Z',
          },
        ],
        [
          {
            asISOString: '2016-10-12T10:00:00.000Z/2016-10-12T11:00:00.000Z',
            asString: '13:00-14:00',
            end: '2016-10-12T14:00:00.000Z',
            index: 0,
            reserved: false,
            resource: 'some-resource-id',
            start: '2016-10-12T13:00:00.000Z',
          },
        ],
        [
          {
            asISOString: '2016-10-13T10:00:00.000Z/2016-10-13T11:00:00.000Z',
            asString: '14:00-15:00',
            end: '2016-10-13T15:00:00.000Z',
            index: 0,
            reserved: false,
            resource: 'some-resource-id',
            start: '2016-10-13T14:00:00.000Z',
          },
        ],
        [
          {
            asISOString: '2016-10-14T10:00:00.000Z/2016-10-14T11:00:00.000Z',
            asString: '10:00-11:00',
            end: '2016-10-14T11:00:00.000Z',
            index: 0,
            reserved: false,
            resource: 'some-resource-id',
            start: '2016-10-14T10:00:00.000Z',
          },
        ],
      ];
      const placeholder = getWrapper({ selectedDate: '2016-10-11', slots }).find(TimeSlotPlaceholder);
      expect(placeholder).toHaveLength(3);
      expect(placeholder.first().prop('mobileOffset')).toBe(2);
    }
  );

  describe('getReservationBegin', () => {
    test('returns the begin value of the selected slot', () => {
      const instance = getWrapper().instance();
      const firstSelectedSlot = defaultProps.selected[0];
      expect(instance.getReservationBegin()).toBe(firstSelectedSlot.begin);
    });

    test('returns an empty string if the there are no selected slots', () => {
      const instance = getWrapper({ selected: [] }).instance();
      expect(instance.getReservationBegin()).toBe('');
    });
  });

  describe('getReservationEnd', () => {
    test('returns the end value of the lest selected slot', () => {
      const instance = getWrapper().instance();
      const lastSelectedSlot = defaultProps.selected[defaultProps.selected.length - 1];
      expect(instance.getReservationEnd()).toBe(lastSelectedSlot.end);
    });

    test('returns an empty string if the there are no selected slots', () => {
      const instance = getWrapper({ selected: [] }).instance();
      expect(instance.getReservationEnd()).toBe('');
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

  describe('isMaxExceeded', () => {
    describe('is Admin', () => {
      test('enables all TimeSlots even if maxPeriod is specified', () => {
        const renderedTimeSlots = getWrapper({ isAdmin: true, maxPeriod: '00:60:00' })
          .find(TimeSlotComponent);
        expect(renderedTimeSlots.first().prop('isDisabled')).toBe(false);
        expect(renderedTimeSlots.at(1).prop('isDisabled')).toBe(false);
      });
    });

    describe('is not Admin', () => {
      test('does NOT enable all TimeSlots if maxPeriod in not defined', () => {
        const renderedTimeSlots = getWrapper().find(TimeSlotComponent);
        expect(renderedTimeSlots.first().prop('isDisabled')).toBe(true);
        expect(renderedTimeSlots.at(1).prop('isDisabled')).toBe(true);
      });

      test(
        'disables TimeSlot when the reservation length is longer than maxPeriod',
        () => {
          const resourceMaxPeriod = Resource.build({ maxPeriod: '00:60:00' });
          const renderedTimeSlots = getWrapper(
            { resource: resourceMaxPeriod }
          ).find(TimeSlotComponent);
          expect(renderedTimeSlots.first().prop('isDisabled')).toBe(false);
          expect(renderedTimeSlots.at(1).prop('isDisabled')).toBe(true);
        }
      );
    });
  });
});
