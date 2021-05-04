import React from 'react';
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

import { shallowWithIntl } from 'utils/testUtils';
import TextField from '../TextField';

describe('TextField', () => {
  const defaultProps = {
    onChange: jest.fn(),
    onKeyPress: jest.fn(),
    label: 'some label',
    value: 'test-value',
    id: 'test-id',
    placeholder: 'some placeholder',
  };

  function getWrapper(props) {
    return shallowWithIntl(<TextField {...defaultProps} {...props} />);
  }

  describe('renders', () => {
    test('wrapping div', () => {
      const wrapper = getWrapper().find('.app-TextField');
      expect(wrapper).toHaveLength(1);
    });

    test('FormGroup', () => {
      const formGroup = getWrapper().find(FormGroup);
      expect(formGroup).toHaveLength(1);
      expect(formGroup.prop('controlId')).toBe(`textField-${defaultProps.id}`);
    });

    describe('ControlLabel', () => {
      test('when prop label is given', () => {
        const label = 'test-label';
        const controlLabel = getWrapper({ label }).find(ControlLabel);
        expect(controlLabel).toHaveLength(1);
        expect(controlLabel.prop('className')).toBe('app-TextField__label');
        expect(controlLabel.props().children).toBe(label);
      });

      test('when prop label is not given', () => {
        const label = undefined;
        const controlLabel = getWrapper({ label }).find(ControlLabel);
        expect(controlLabel).toHaveLength(0);
      });
    });

    test('FormControl', () => {
      const controlLabel = getWrapper().find(FormControl);
      expect(controlLabel).toHaveLength(1);
      expect(controlLabel.prop('className')).toBe('app-TextField__input');
      expect(controlLabel.prop('onChange')).toBe(defaultProps.onChange);
      expect(controlLabel.prop('onKeyPress')).toBe(defaultProps.onKeyPress);
      expect(controlLabel.prop('placeholder')).toBe(defaultProps.placeholder);
      expect(controlLabel.prop('type')).toBe('text');
      expect(controlLabel.prop('value')).toBe(defaultProps.value);
    });
  });

  describe('functions', () => {
    describe('FormControl', () => {
      beforeAll(() => {
        defaultProps.onChange.mockClear();
        defaultProps.onKeyPress.mockClear();
      });

      afterAll(() => {
        defaultProps.onChange.mockClear();
        defaultProps.onKeyPress.mockClear();
      });

      test('calls correct onChange function', () => {
        const controlLabel = getWrapper().find(FormControl);
        const event = { target: { value: 'test-value' } };
        controlLabel.simulate('change', event);
        expect(defaultProps.onChange.mock.calls.length).toBe(1);
        expect(defaultProps.onChange.mock.calls[0][0]).toBe(event);
      });

      test('calls correct onKeyPress function', () => {
        const controlLabel = getWrapper().find(FormControl);
        controlLabel.simulate('keypress', { key: 'Enter' });
        expect(defaultProps.onKeyPress.mock.calls.length).toBe(1);
      });
    });
  });
});
