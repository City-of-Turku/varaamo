import React from 'react';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import Select from 'react-select';

import { shallowWithIntl } from 'utils/testUtils';
import SelectField, { getOption } from '../SelectField';

describe('SelectField', () => {
  const defaultProps = {
    onChange: jest.fn(),
    label: 'test-label',
    options: [
      { value: 'foo', label: 'Foo' },
      { value: 'bar', label: 'Bar' },
    ],
    value: 'foo',
    id: 'foo',
    isClearable: false,
    isMulti: false,
    isSearchable: false,
    placeholder: 'test-placeholder',
  };

  function getWrapper(props) {
    return shallowWithIntl(<SelectField {...defaultProps} {...props} />);
  }

  describe('renders', () => {
    test('wrapping div', () => {
      const wrapper = getWrapper().find('.app-SelectField');
      expect(wrapper).toHaveLength(1);
    });

    test('FormGroup', () => {
      const formGroup = getWrapper().find(FormGroup);
      expect(formGroup).toHaveLength(1);
      expect(formGroup.prop('controlId')).toBe(defaultProps.id);
    });

    describe('ControlLabel', () => {
      test('when prop label is given', () => {
        const label = 'test-label';
        const controlLabel = getWrapper({ label }).find(ControlLabel);
        expect(controlLabel).toHaveLength(1);
        expect(controlLabel.props().children).toBe(label);
      });

      test('when prop label is not given', () => {
        const label = undefined;
        const controlLabel = getWrapper({ label }).find(ControlLabel);
        expect(controlLabel).toHaveLength(0);
      });
    });

    test('Select', () => {
      const select = getWrapper().find(Select);
      expect(select).toHaveLength(1);
      expect(select.prop('className')).toBe('app-Select');
      expect(select.prop('classNamePrefix')).toBe('app-Select');
      expect(select.prop('id')).toBe(defaultProps.id);
      expect(select.prop('isClearable')).toBe(defaultProps.isClearable);
      expect(select.prop('isMulti')).toBe(defaultProps.isMulti);
      expect(select.prop('isSearchable')).toBe(defaultProps.isSearchable);
      expect(select.prop('noOptionsMessage')).toBeDefined();
      expect(select.prop('onChange')).toBeDefined();
      expect(select.prop('options')).toBe(defaultProps.options);
      expect(select.prop('placeholder')).toBe(defaultProps.placeholder);
      expect(select.prop('value')).toBe(getOption(defaultProps.value, defaultProps.options));
    });
  });
});
