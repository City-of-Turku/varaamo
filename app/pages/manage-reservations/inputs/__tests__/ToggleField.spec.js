import { shallow } from 'enzyme';
import React from 'react';
import { ControlLabel } from 'react-bootstrap';
import Toggle from 'react-toggle';

import ToggleField from '../ToggleField';

describe('ToggleField', () => {
  const defaultProps = {
    id: 'test-id',
    label: 'My label',
    onChange: jest.fn(),
    value: false,
  };

  function getWrapper(props) {
    return shallow(<ToggleField {...defaultProps} {...props} />);
  }

  describe('renders', () => {
    test('wrapping div', () => {
      const div = getWrapper().find('div');
      expect(div).toHaveLength(1);
      expect(div.prop('className')).toBe('app-ToggleField');
    });

    test('Toggle', () => {
      const toggle = getWrapper().find(Toggle);
      expect(toggle).toHaveLength(1);
      expect(toggle.prop('checked')).toBe(defaultProps.value);
      expect(toggle.prop('id')).toBe(defaultProps.id);
      expect(toggle.prop('onChange')).toBe(defaultProps.onChange);
    });

    test('ControlLabel', () => {
      const label = getWrapper().find(ControlLabel);
      expect(label).toHaveLength(1);
      expect(label.prop('className')).toBe('app-ToggleFieldLabel');
      expect(label.prop('htmlFor')).toBe(defaultProps.id);
      expect(label.prop('children')).toBe(defaultProps.label);
    });
  });
});
