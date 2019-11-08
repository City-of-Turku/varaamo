import React from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
import SelectControl from './SelectControl';

const defaults = {
  id: 'some-id',
  name: 'some-name',
  isLoading: false,
  label: 'some-label',
  onChange: () => null,
  options: [
    { value: 'filter-1', label: 'Label 1' },
    { value: 'filter-2', label: 'Label 2' },
  ],
  value: 'filter-1',
};
function getWrapper(props) {
  return shallowWithIntl(<SelectControl {...defaults} {...props} />);
}

describe('pages/search/controls/SelectControl', () => {
  afterEach(() => {
    simple.restore();
  });

  test('renders a section.app-SelectControl with correct props', () => {
    const wrapper = getWrapper({});
    expect(wrapper.is('section.app-SelectControl')).toBe(true);
  });

  test('renders a FormGroup with correct props', () => {
    const formGroup = getWrapper({}).find(FormGroup);
    expect(formGroup).toHaveLength(1);
    expect(formGroup.prop('controlId')).toBe(defaults.id);
  });

  test('renders a ControlLabel', () => {
    const controlLabel = getWrapper({}).find(ControlLabel);
    expect(controlLabel).toHaveLength(1);
  });

  test('hide Select when isLoading=true', () => {
    const select = getWrapper({ isLoading: true }).find('select');

    expect(select).toHaveLength(0);
  });

  test('disable select when isDisabled is true', () => {
    const select = getWrapper({ isDisabled: true }).find('select');

    expect(select.length).toBe(1);
    expect(select.prop('disabled')).toBe(true);
    expect(select.hasClass('app-Select--is-disabled')).toBe(true);
  });

  test('renders select element with correct props', () => {
    const select = getWrapper({}).find('select');
    expect(select).toHaveLength(1);
    expect(select.prop('id')).toBe(defaults.id);
    expect(select.prop('name')).toBe(defaults.name);
    expect(typeof select.prop('onChange')).toBe('function');
    expect(select.prop('value')).toBe(defaults.options[0].value);
    expect(select.prop('multiple')).toBe(defaults.isMulti);
  });

  test(
    'renders select element with props className contain app-Select, so the styling will work',
    () => {
      const select = getWrapper({ className: 'foo' }).find('select');
      const defaultSelect = getWrapper().find('select');

      expect(select).toHaveLength(1);
      expect(select.prop('className')).toContain('app-Select');
      expect(select.prop('className')).toContain('foo');
      expect(defaultSelect.prop('className')).toContain('app-Select');
    }
  );

  test('select onChange calls prop onChange', () => {
    const onChange = simple.mock();
    const select = getWrapper({ onChange }).find('select');
    expect(select).toHaveLength(1);

    const onChangeEventParam = { target: { value: defaults.value } };
    select.prop('onChange')(onChangeEventParam);
    expect(onChange.callCount).toBe(1);
    expect(onChange.lastCall.args[0]).toEqual({ value: defaults.value });
  });

  describe('clear button', () => {
    test('renders with correct props', () => {
      const clearButton = getWrapper().find('.app-SelectControl__clear-button');
      expect(clearButton.length).toBe(1);
      expect(clearButton.prop('aria-describedby')).toEqual(defaults.id);
      expect(typeof clearButton.prop('onClick')).toBe('function');
      expect(clearButton.prop('type')).toEqual('button');
    });

    test('renders child image with correct props', () => {
      const clearButton = getWrapper().find('.app-SelectControl__clear-button');
      expect(clearButton.length).toBe(1);
      const image = clearButton.find('img');
      expect(image.length).toBe(1);
      expect(image.prop('alt')).toEqual('SelectControl.clearLabel');
      expect(image.prop('src')).toBeDefined();
    });

    test('has className is-visible, if prop value is not empty', () => {
      const clearButton = getWrapper({ value: 'some value' }).find('.app-SelectControl__clear-button');
      expect(clearButton.length).toBe(1);
      expect(clearButton.hasClass('is-visible')).toBe(true);
    });

    test('does not have className is-visible, if prop value is empty', () => {
      const clearButton = getWrapper({ value: '' }).find('.app-SelectControl__clear-button');
      expect(clearButton.length).toBe(1);
      expect(clearButton.hasClass('is-visible')).toBe(false);
    });

    test('clear button onClick calls prop onChange with empty string', () => {
      const onChange = simple.mock();
      const clearButton = getWrapper({ onChange }).find('.app-SelectControl__clear-button');
      expect(clearButton).toHaveLength(1);

      clearButton.prop('onClick')();
      expect(onChange.callCount).toBe(1);
      expect(onChange.lastCall.args[0]).toEqual({ value: '' });
    });
  });

  describe('getValue', () => {
    test('fill selected option when default value is passed in', () => {
      const wrapper = getWrapper({});
      const selectedOption = wrapper.instance().getValue(
        defaults.options[0].value, defaults.options
      );
      expect(selectedOption).toEqual(defaults.options[0].value);
    });

    test('return an empty string if value is not found in options ', () => {
      const wrapper = getWrapper({});
      const selectedOption = wrapper.instance().getValue('foo', defaults.options);
      expect(selectedOption).toBe('');
    });
  });

  describe('displays noOptions-text when no options available', () => {
    test('no options at all', () => {
      const wrapper = getWrapper({ menuIsOpen: true, options: [] });
      const text = wrapper.render().text();
      expect(text).toContain('SelectControl.noOptions');
    });
  });
});
