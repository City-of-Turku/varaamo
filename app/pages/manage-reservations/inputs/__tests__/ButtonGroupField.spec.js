import React from 'react';
import { shallow } from 'enzyme';
import {
  ControlLabel, FormGroup, ToggleButton, ToggleButtonGroup
} from 'react-bootstrap';

import ButtonGroupField from '../ButtonGroupField';

describe('ButtonGroupField', () => {
  const defaultProps = {
    onChange: jest.fn(),
    label: 'foo',
    options: [
      { value: 'foo', label: 'Foo' },
      { value: 'bar', label: 'Bar' },
    ],
    value: 'foo',
    type: 'checkbox',
    id: 'foo',
  };

  function getWrapper(props) {
    return shallow(<ButtonGroupField {...defaultProps} {...props} />);
  }

  describe('renders', () => {
    test('wrapping div', () => {
      const wrapper = getWrapper().find('.app-ButtonGroupField');
      expect(wrapper).toHaveLength(1);
    });

    test('FormGroup', () => {
      const formGroup = getWrapper().find(FormGroup);
      expect(formGroup).toHaveLength(1);
      expect(formGroup.prop('controlId')).toBe(`buttonGroupField-${defaultProps.id}`);
    });

    describe('ControlLabel', () => {
      test('when prop label is given', () => {
        const label = 'test-label';
        const controlLabel = getWrapper({ label }).find(ControlLabel);
        expect(controlLabel).toHaveLength(1);
        expect(controlLabel.prop('className')).toBe('app-ButtonGroupField__label');
        expect(controlLabel.props().children).toBe(label);
      });

      test('when prop label is not given', () => {
        const label = undefined;
        const controlLabel = getWrapper({ label }).find(ControlLabel);
        expect(controlLabel).toHaveLength(0);
      });
    });

    test('ToggleButtonGroup', () => {
      const toggleButtonGroup = getWrapper().find(ToggleButtonGroup);
      expect(toggleButtonGroup).toHaveLength(1);
      expect(toggleButtonGroup.prop('className')).toBe('app-ButtonGroupField__buttons');
      expect(toggleButtonGroup.prop('onChange')).toBe(defaultProps.onChange);
      expect(toggleButtonGroup.prop('type')).toBe(defaultProps.type);
      expect(toggleButtonGroup.prop('value')).toBe(defaultProps.value);
    });

    test('ToggleButtons', () => {
      const toggleButtons = getWrapper().find(ToggleButton);
      expect(toggleButtons).toHaveLength(defaultProps.options.length);
      toggleButtons.forEach((button, index) => {
        expect(button.prop('className')).toBe('app-ButtonGroupField__button');
        expect(button.prop('value')).toBe(defaultProps.options[index].value);
        expect(button.props().children).toBe(defaultProps.options[index].label);
      });
    });
  });

  describe('functions', () => {
    describe('ToggleButtonGroup', () => {
      afterEach(() => {
        defaultProps.onChange.mockClear();
      });

      test('calls correct onChange function', () => {
        const toggleButtonGroup = getWrapper().find(ToggleButtonGroup);
        const event = { target: { value: 'test-value' } };
        toggleButtonGroup.simulate('change', event);
        expect(defaultProps.onChange.mock.calls.length).toBe(1);
        expect(defaultProps.onChange.mock.calls[0][0]).toBe(event);
      });
    });
  });
});
