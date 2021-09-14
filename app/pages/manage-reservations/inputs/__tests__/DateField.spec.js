import React from 'react';
import { shallow } from 'enzyme';
import {
  ControlLabel, FormGroup, Glyphicon, InputGroup, Overlay
} from 'react-bootstrap';
import moment from 'moment';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';

import DateField from '../DateField';

describe('DateField', () => {
  const defaultProps = {
    onChange: jest.fn(),
    label: 'date-lable',
    id: 'date-id',
    value: new Date(2019, 8, 9),
    locale: 'en',
  };

  function getWrapper(props) {
    return shallow(<DateField {...defaultProps} {...props} />);
  }

  describe('renders', () => {
    test('wrapping div', () => {
      const wrapper = getWrapper().find('.app-DateField');
      expect(wrapper).toHaveLength(1);
    });

    test('FormGroup', () => {
      const formGroup = getWrapper().find(FormGroup);
      expect(formGroup).toHaveLength(1);
      expect(formGroup.prop('onClick')).toBeDefined();
    });

    describe('ControlLabel', () => {
      test('when prop label is given', () => {
        const label = 'test-label';
        const controlLabel = getWrapper({ label }).find(ControlLabel);
        expect(controlLabel).toHaveLength(1);
        expect(controlLabel.prop('className')).toBe('app-DateField__label');
        expect(controlLabel.props().children).toBe(label);
      });

      test('when prop label is not given', () => {
        const label = undefined;
        const controlLabel = getWrapper({ label }).find(ControlLabel);
        expect(controlLabel).toHaveLength(0);
      });
    });

    test('InputGroup', () => {
      const inputGroup = getWrapper().find(InputGroup);
      expect(inputGroup).toHaveLength(1);
    });

    describe('InputGroup.Addon input', () => {
      const addon = getWrapper().find('.app-DateField__input');
      test('wrapping InputGroup.Addon', () => {
        expect(addon).toHaveLength(1);
      });

      test('icon img', () => {
        const icon = addon.find('img');
        expect(icon).toHaveLength(1);
        expect(icon.prop('alt')).toBe('');
        expect(icon.prop('className')).toBe('app-DateField__icon');
        expect(icon.prop('src')).toBeDefined();
      });

      describe('value span', () => {
        test('when value is truthy', () => {
          const value = new Date(2021, 2, 3);
          const valueSpan = getWrapper({ value }).find('.app-DateField__input').find('.value');
          expect(valueSpan).toHaveLength(1);
          expect(valueSpan.props().children).toBe(moment(value).format('L'));
        });

        test('when value is falsy', () => {
          const value = undefined;
          const valueSpan = getWrapper({ value }).find('.app-DateField__input').find('.value');
          expect(valueSpan).toHaveLength(0);
        });
      });

      describe('placeholder span', () => {
        describe('when value is falsy', () => {
          const value = undefined;

          test('when placeholder is truthy', () => {
            const placeholder = 'test';
            const placeholderSpan = getWrapper({ value, placeholder }).find('.app-DateField__input').find('.placeholder');
            expect(placeholderSpan).toHaveLength(1);
            expect(placeholderSpan.props().children).toBe(placeholder);
          });

          test('when placeholder is falsy', () => {
            const placeholder = undefined;
            const placeholderSpan = getWrapper({ value, placeholder }).find('.app-DateField__input').find('.placeholder');
            expect(placeholderSpan).toHaveLength(0);
          });
        });
        test('when value is truthy', () => {
          const value = new Date(2021, 2, 3);
          const placeholderSpan = getWrapper({ value }).find('.app-DateField__input').find('.placeholder');
          expect(placeholderSpan).toHaveLength(0);
        });
      });
    });

    describe('InputGroup.Addon triangle icon', () => {
      const addon = getWrapper().find('.app-DateField__triangle');
      test('wrapping InputGroup.Addon', () => {
        expect(addon).toHaveLength(1);
      });

      test('Glyphicon', () => {
        const icon = addon.find(Glyphicon);
        expect(icon).toHaveLength(1);
        expect(icon.prop('glyph')).toBe('triangle-bottom');
      });
    });

    test('Overlay', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const overlay = wrapper.find(Overlay);
      expect(overlay).toHaveLength(1);
      expect(overlay.prop('animation')).toBe(false);
      expect(overlay.prop('container')).toBe(instance);
      expect(overlay.prop('onHide')).toBeDefined();
      expect(overlay.prop('placement')).toBe('bottom');
      expect(overlay.prop('rootClose')).toBe(true);
      expect(overlay.prop('show')).toBe(instance.state.isOpen);
    });

    test('DayPicker', () => {
      const dayPicker = getWrapper().find(DayPicker);
      const expectedDate = defaultProps.value || moment().toDate();
      expect(dayPicker).toHaveLength(1);
      expect(dayPicker.prop('initialMonth')).toBe(expectedDate);
      expect(dayPicker.prop('locale')).toBe(defaultProps.locale);
      expect(dayPicker.prop('localeUtils')).toBe(MomentLocaleUtils);
      expect(dayPicker.prop('onDayClick')).toBeDefined();
      expect(dayPicker.prop('selectedDays')).toBe(expectedDate);
      expect(dayPicker.prop('showOutsideDays')).toBe(true);
      expect(dayPicker.prop('showWeekNumbers')).toBe(true);
    });
  });

  describe('functions', () => {
    describe('onChange', () => {
      beforeAll(() => {
        defaultProps.onChange.mockClear();
      });

      afterEach(() => {
        defaultProps.onChange.mockClear();
      });

      const newDate = new Date(2021, 5, 25);

      test('sets state isOpen to false', () => {
        const instance = getWrapper().instance();
        instance.state.isOpen = true;
        instance.onChange(newDate);
        expect(instance.state.isOpen).toBe(false);
      });

      test('calls prop onChange with given date', () => {
        const instance = getWrapper().instance();
        instance.onChange(newDate);
        expect(defaultProps.onChange.mock.calls.length).toBe(1);
        expect(defaultProps.onChange.mock.calls[0][0]).toBe(newDate);
      });
    });

    describe('setIsOpen', () => {
      test('sets state isOpen to given value', () => {
        const instance = getWrapper().instance();
        instance.state.isOpen = true;
        instance.setIsOpen(false);
        expect(instance.state.isOpen).toBe(false);
      });
    });
  });
});
