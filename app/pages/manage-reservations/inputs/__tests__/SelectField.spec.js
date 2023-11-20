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
        expect(controlLabel.props().children).toStrictEqual(['test-label', undefined]);
      });

      test('when prop label is given and the field is required', () => {
        const label = 'test-label';
        const controlLabel = getWrapper({ label, isRequired: true }).find(ControlLabel);
        expect(controlLabel).toHaveLength(1);
        expect(controlLabel.props().children).toStrictEqual([
          'test-label',
          <span aria-hidden>*</span>,
        ]);
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
      expect(select.prop('inputId')).toBe(defaultProps.id);
      expect(select.prop('isClearable')).toBe(defaultProps.isClearable);
      expect(select.prop('isMulti')).toBe(defaultProps.isMulti);
      expect(select.prop('isSearchable')).toBe(defaultProps.isSearchable);
      expect(select.prop('noOptionsMessage')).toBeDefined();
      expect(select.prop('onChange')).toBeDefined();
      expect(select.prop('options')).toBe(defaultProps.options);
      expect(select.prop('placeholder')).toBe(defaultProps.placeholder);
      expect(select.prop('value')).toBe(getOption(defaultProps.value, defaultProps.options));
    });

    test('HelpBlock is not rendered when error is not given', () => {
      const helpBlock = getWrapper().find('.has-error');
      expect(helpBlock).toHaveLength(0);
    });

    test('HelpBlock is rendered when error is given', () => {
      const error = 'MassCancel.error.required.resource';
      const wrapper = getWrapper({ error });
      const helpBlock = wrapper.find('.has-error');
      expect(helpBlock).toHaveLength(1);
      expect(helpBlock.children().at(0).text()).toBe(error);
      expect(helpBlock.prop('id')).toBe(`${defaultProps.id}-error`);
      expect(helpBlock.prop('role')).toBe('alert');
    });
  });
});
