import { shallow } from 'enzyme';
import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import RBCheckbox from 'react-bootstrap/lib/Checkbox';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import simple from 'simple-mock';

import TermsField from './TermsField';

describe('shared/form-fields/TermsField', () => {
  const defaultProps = {
    input: {
      name: 'terms',
    },
    label: 'some label',
    labelLink: 'some link label',
    meta: {},
    onClick: () => null,
    isRequired: false
  };

  function getWrapper(props) {
    return shallow(<TermsField {...defaultProps} {...props} />);
  }

  describe('FormGroup component', () => {
    test('is rendered', () => {
      const formGroup = getWrapper().find(FormGroup);
      expect(formGroup.length).toBe(1);
    });

    test('gets correct props', () => {
      const actualProps = getWrapper().find(FormGroup).props();
      expect(actualProps.controlId).toBe(defaultProps.input.name);
    });

    test('gets correct props if error', () => {
      const meta = { error: 'some error', touched: true };
      const actualProps = getWrapper({ meta }).find(FormGroup).props();
      expect(actualProps.validationState).toBe('error');
    });
  });

  describe('Col component', () => {
    test('is rendered', () => {
      const col = getWrapper().find(Col);
      expect(col.length).toBe(1);
    });

    test('gets correct props', () => {
      const actualProps = getWrapper().find(Col).props();
      expect(actualProps.sm).toBe(9);
    });
  });

  describe('React Bootstrap Checkbox component', () => {
    test('is rendered', () => {
      const rbCheckbox = getWrapper().find(RBCheckbox);
      expect(rbCheckbox.length).toBe(1);
    });

    test('gets correct props', () => {
      const rbCheckbox = getWrapper().find(RBCheckbox);
      expect(rbCheckbox.prop('aria-required')).toBe(defaultProps.isRequired);
      const inputKeys = Object.keys(defaultProps.input);
      inputKeys.forEach((key) => {
        expect(rbCheckbox.prop(key)).toBe(defaultProps.input[key]);
      });
    });

    test('gets the label as its children', () => {
      const rbCheckbox = getWrapper().find(RBCheckbox);
      expect(rbCheckbox.props().children).toEqual(expect.arrayContaining([defaultProps.label]));
    });

    test('gets * in its children if isRequired is true', () => {
      const rbCheckbox = getWrapper({ isRequired: true }).find(RBCheckbox);
      expect(rbCheckbox.props().children).toContain('*');
    });

    test('does not get * in its children if isRequired is false', () => {
      const rbCheckbox = getWrapper({ isRequired: false }).find(RBCheckbox);
      expect(rbCheckbox.props().children).not.toContain('*');
    });
  });

  describe('Button component with link', () => {
    test('is rendered', () => {
      const link = getWrapper().find('.terms-checkbox-field-link');
      expect(link.length).toBe(1);
    });

    test('gets correct props', () => {
      const link = getWrapper().find('.terms-checkbox-field-link');
      expect(link.prop('onClick')).toBe(defaultProps.onClick);
      expect(link.prop('variant')).toBe('link');
    });

    test('displays the help text given in props', () => {
      const link = getWrapper().find('.terms-checkbox-field-link');
      expect(link.props().children).toBe(defaultProps.labelLink);
    });

    test('onClick calls prop onClick', () => {
      const onClick = simple.mock();
      const link = getWrapper({ onClick }).find('.terms-checkbox-field-link');
      expect(link.length).toBe(1);
      expect(link.prop('onClick')).toBeDefined();
      link.prop('onClick')();
      expect(onClick.callCount).toBe(1);
    });
  });

  describe('HelpBlock component', () => {
    describe('if error', () => {
      const meta = { error: 'some error', touched: true };
      test('is rendered', () => {
        const helpBlock = getWrapper({ meta }).find(HelpBlock);
        expect(helpBlock.length).toBe(1);
      });

      test('displays the error text given in props', () => {
        const helpBlock = getWrapper({ meta }).find(HelpBlock);
        expect(helpBlock.props().children).toBe(meta.error);
      });
    });

    describe('if error is not given in props', () => {
      const meta = {};
      test('is not rendered', () => {
        const helpBlock = getWrapper({ meta }).find(HelpBlock);
        expect(helpBlock.length).toBe(0);
      });
    });
  });
});
