import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import Overlay from 'react-bootstrap/lib/Overlay';
import DayPicker from 'react-day-picker';
import moment from 'moment';
import mockDate from 'mockdate';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
import DatePickerControl from './DatePickerControl';
import SearchControlOverlay from './SearchControlOverlay';

const defaults = {
  currentLanguage: 'fi',
  date: '01.01.2017',
  duration: 30,
  end: '16:00',
  onConfirm: () => null,
  start: '10:00',
};
function getWrapper(props) {
  return shallowWithIntl(<DatePickerControl {...defaults} {...props} />);
}

describe('pages/search/controls/DatePickerControl', () => {
  test('renders a section.app-DatePickerControl and correct props', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('section.app-DatePickerControl')).toBe(true);
  });

  test('renders form with correct props', () => {
    const wrapper = getWrapper();
    const dateForm = wrapper.find('form');
    expect(dateForm.length).toBe(1);
    expect(dateForm.prop('onSubmit')).toBe(wrapper.instance().handleDateInputSubmit);
  });

  test('renders ControlLabel with correct text', () => {
    const wrapper = getWrapper();
    const controlLabel = wrapper.find(ControlLabel);
    expect(controlLabel).toHaveLength(1);
  });

  test('renders date-input-error with correct props if state.inputErrorVisible is false', () => {
    const wrapper = getWrapper();
    wrapper.setState({ textInputErrorVisible: true });
    const errorText = wrapper.find('#date-input-error');
    expect(errorText.length).toBe(1);
    expect(errorText.prop('role')).toBe('alert');
    expect(errorText.text()).toBe('DatePickerControl.form.error.feedback');
  });

  test('doesnt render date-input-error if state.inputErrorVisible is false', () => {
    const wrapper = getWrapper();
    wrapper.setState({ textInputErrorVisible: false });
    const errorText = wrapper.find('#date-input-error');
    expect(errorText.length).toBe(0);
  });

  test('renders FormGroup with correct props', () => {
    const wrapper = getWrapper();
    const formGroup = wrapper.find(FormGroup);
    expect(formGroup).toHaveLength(1);
    expect(formGroup.prop('controlId')).toBe('datePickerField');
  });

  describe('FormControl', () => {
    test('renders with correct props', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const formControl = wrapper.find(FormControl);
      expect(formControl).toHaveLength(1);
      expect(formControl.prop('onChange')).toBe(instance.handleDateInputChange);
      expect(formControl.prop('onBlur')).toBe(instance.handleDateInputSubmit);
      expect(formControl.prop('type')).toBe('text');
      expect(formControl.prop('value')).toBe(defaults.date);
    });
    test('prop aria-describedby is null if state.textInputErrorVisible is false', () => {
      const wrapper = getWrapper();
      wrapper.setState({ textInputErrorVisible: false });
      const formControl = wrapper.find(FormControl);
      expect(formControl.prop('aria-describedby')).toBe(null);
    });
    test('prop aria-describedby is date-input-error if state.textInputErrorVisible is true', () => {
      const wrapper = getWrapper();
      wrapper.setState({ textInputErrorVisible: true });
      const formControl = wrapper.find(FormControl);
      expect(formControl.prop('aria-describedby')).toBe('date-input-error');
    });
  });

  test('renders Button with correct props', () => {
    const wrapper = getWrapper();
    const button = wrapper.find(Button);
    expect(button).toHaveLength(1);
    expect(button.prop('onClick')).toBe(wrapper.instance().handleDateButtonClick);
    expect(button.prop('tabIndex')).toBe('-1');
    expect(button.prop('aria-hidden')).toBe('true');
  });

  test('renders Button img with correct props', () => {
    const wrapper = getWrapper();
    const image = wrapper.find('img');
    expect(image).toHaveLength(1);
    expect(image.prop('alt')).toBe('DatePickerControl.button.imageAlt');
    expect(image.prop('className')).toBe('app-DatePickerControl__icon');
  });

  test('renders Overlay with correct props', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    const overlay = wrapper.find(Overlay);
    expect(overlay).toHaveLength(1);
    expect(overlay.prop('container')).toBe(instance);
    expect(overlay.prop('onHide')).toBe(instance.hideOverlay);
    expect(overlay.prop('placement')).toBe('bottom');
    expect(overlay.prop('rootClose')).toBe(true);
    expect(overlay.prop('show')).toBe(instance.state.visible);
  });

  test('renders SearchControlOverlay with correct props', () => {
    const wrapper = getWrapper();
    const controlOverlay = wrapper.find(SearchControlOverlay);
    expect(controlOverlay).toHaveLength(1);
    expect(controlOverlay.prop('onHide')).toBe(wrapper.instance().hideOverlay);
    expect(controlOverlay.prop('title')).toBe('DatePickerControl.header');
  });

  test('renders DayPicker for selecting date', () => {
    const expected = moment(defaults.date, 'L')
      .startOf('day')
      .toDate();
    const wrapper = getWrapper();
    const dayPicker = wrapper.find(DayPicker);
    expect(dayPicker).toHaveLength(1);
    expect(dayPicker.prop('disabledDays')).toBeDefined();
    expect(dayPicker.prop('showOutsideDays')).toBe(true);
    expect(dayPicker.prop('initialMonth')).toEqual(expected);
    expect(dayPicker.prop('locale')).toBe(defaults.currentLanguage);
    expect(dayPicker.prop('onDayClick')).toBe(wrapper.instance().handleConfirm);
    expect(dayPicker.prop('selectedDays')).toEqual(expected);
  });

  describe('DayPicker disabledDays', () => {
    const dayPicker = getWrapper().find(DayPicker);
    const now = new Date();
    const todayEarly = new Date();
    todayEarly.setHours(0, 1, 0, 0);
    const todayLate = new Date();
    todayLate.setHours(23, 0, 0, 0);
    const receivedToday = new Date(now);
    const receivedYesterday = new Date(now.valueOf() - 86400000);
    const receivedTomorrow = new Date(now.valueOf() + 86400000);
    receivedToday.setHours(12, 0, 0, 0);
    receivedTomorrow.setHours(12, 0, 0, 0);
    receivedYesterday.setHours(12, 0, 0, 0);
    let isDisabled;
    beforeAll(() => {
      isDisabled = dayPicker.prop('disabledDays');
    });

    afterEach(() => {
      mockDate.reset();
    });

    test('disables yesterday', () => {
      mockDate.set(now);
      expect(isDisabled(receivedYesterday)).toBe(true);
    });

    test('enables today now', () => {
      mockDate.set(now);
      expect(isDisabled(receivedToday)).toBe(false);
    });

    test('enables today early', () => {
      mockDate.set(todayEarly);
      expect(isDisabled(receivedToday)).toBe(false);
    });

    test('enables today late', () => {
      mockDate.set(todayLate);
      expect(isDisabled(receivedToday)).toBe(false);
    });

    test('enables tomorrow', () => {
      mockDate.set(now);
      expect(isDisabled(receivedTomorrow)).toBe(false);
    });
  });

  describe('handleConfirm', () => {
    test('calls onConfirm with correct value', () => {
      const onConfirm = simple.mock();
      const date = '12.12.2017';
      const expected = [{ date }, true];
      const instance = getWrapper({ onConfirm }).instance();
      instance.handleConfirm(date);
      expect(onConfirm.callCount).toBe(1);
      expect(onConfirm.lastCall.args).toEqual(expected);
    });

    test('sets state.textInputErrorVisible to false', () => {
      const instance = getWrapper().instance();
      instance.state.textInputErrorVisible = true;
      instance.handleConfirm();
      expect(instance.state.textInputErrorVisible).toBe(false);
    });

    test('calls hideOverlay', () => {
      const instance = getWrapper().instance();
      simple.mock(instance, 'hideOverlay');
      instance.handleConfirm();
      expect(instance.hideOverlay.callCount).toBe(1);
      simple.restore();
    });
  });

  describe('hideOverlay', () => {
    test('sets state.visible to false', () => {
      const instance = getWrapper().instance();
      instance.state.visible = true;
      instance.hideOverlay();
      expect(instance.state.visible).toBe(false);
    });
  });

  describe('showOverlay', () => {
    test('sets state.visible to true', () => {
      const instance = getWrapper().instance();
      instance.state.visible = false;
      instance.showOverlay();
      expect(instance.state.visible).toBe(true);
    });
  });

  describe('handleDateInputChange', () => {
    test('sets state.date to correct value', () => {
      const instance = getWrapper().instance();
      const mockEvent = { target: { value: '12.05.2019' } };
      instance.handleDateInputChange(mockEvent);
      expect(instance.state.date).toBe('12.05.2019');
    });
  });

  describe('handleDateInputSubmit', () => {
    describe('date is valid', () => {
      const instance = getWrapper().instance();
      instance.state.date = '2.8.2019';

      test('handleConfirm is called with correct params', () => {
        instance.handleConfirm = simple.mock();
        instance.handleDateInputSubmit({ preventDefault: () => undefined });

        expect(instance.handleConfirm.callCount).toBe(1);
        expect(instance.handleConfirm.lastCall.args).toEqual([instance.state.date, true]);
      });
    });

    describe('date is not valid', () => {
      const instance = getWrapper().instance();
      instance.state.date = '34.8.2019';

      test('handleConfirm is called with correct params', () => {
        instance.handleConfirm = simple.mock();
        instance.handleDateInputSubmit({ preventDefault: () => undefined });

        expect(instance.handleConfirm.callCount).toBe(1);
        expect(instance.handleConfirm.lastCall.args).toEqual([instance.state.date, false]);
      });

      test('state.textInputErrorVisible is set to true', () => {
        instance.state.textInputErrorVisible = true;
        instance.handleDateInputSubmit({ preventDefault: () => undefined });

        expect(instance.state.textInputErrorVisible).toBe(true);
      });
    });
  });

  describe('handleDateButtonClick', () => {
    describe('if state.visible is true', () => {
      test('sets state.visible to false', () => {
        const instance = getWrapper().instance();
        instance.state.visible = true;
        instance.handleDateButtonClick();
        expect(instance.state.visible).toBe(false);
      });
    });
    describe('if state.visible is false', () => {
      test('sets state.visible to true', () => {
        const instance = getWrapper().instance();
        instance.state.visible = false;
        instance.handleDateButtonClick();
        expect(instance.state.visible).toBe(true);
      });
    });
  });
});
