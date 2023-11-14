import { shallow } from 'enzyme';
import React from 'react';

import RadioGroup from './RadioGroup';

describe('shared/form-fields/Checkbox', () => {
  const defaultProps = {
    legend: 'some legend',
    radioOptions: [{
      name: 'some name 1',
      value: 'some value 1',
      label: 'some label 1',
      hint: 'some hint 1'
    },
    {
      name: 'some name 2',
      value: 'some value 2',
      label: 'some label 2',
      hint: 'some hint 2'
    }]
  };

  function getWrapper(props) {
    return shallow(<RadioGroup {...defaultProps} {...props} />);
  }

  describe('renders', () => {
    test('a fieldset with the correct class name', () => {
      const fieldset = getWrapper().find('fieldset.form-radio-group');
      expect(fieldset.length).toBe(1);
    });

    test('a legend with the correct text', () => {
      const legend = getWrapper().find('legend');
      expect(legend.length).toBe(1);
      expect(legend.text()).toBe(defaultProps.legend);
    });

    describe('legend hint', () => {
      test('is not rendered if not given in props', () => {
        const legendHint = undefined;
        const hint = getWrapper({ legendHint }).find('p');
        expect(hint.length).toBe(0);
      });

      test('is rendered if given in props', () => {
        const legendHint = 'some hint';
        const hint = getWrapper({ legendHint }).find('p');
        expect(hint.length).toBe(1);
        expect(hint.text()).toBe(legendHint);
      });
    });

    describe('options', () => {
      test('labels with correct props', () => {
        const labels = getWrapper().find('label');
        expect(labels.length).toBe(defaultProps.radioOptions.length);
        labels.forEach((label, index) => {
          expect(label.props().htmlFor).toBe(`radio-${defaultProps.radioOptions[index].value}`);
          expect(label.text()).toBe(defaultProps.radioOptions[index].label);
        });
      });

      test('Fields with correct props', () => {
        const fields = getWrapper().find('Field');
        expect(fields.length).toBe(defaultProps.radioOptions.length);
        fields.forEach((field, index) => {
          expect(field.prop('aria-describedby')).toBe(`radio-hint-${defaultProps.radioOptions[index].value}`);
          expect(field.prop('component')).toBe('input');
          expect(field.prop('id')).toBe(`radio-${defaultProps.radioOptions[index].value}`);
          expect(field.prop('name')).toBe(defaultProps.radioOptions[index].name);
          expect(field.prop('type')).toBe('radio');
          expect(field.prop('value')).toBe(defaultProps.radioOptions[index].value);
        });
      });

      test('HelpBlocks with correct props', () => {
        const helpBlocks = getWrapper().find('HelpBlock');
        expect(helpBlocks.length).toBe(defaultProps.radioOptions.length);
        helpBlocks.forEach((helpBlock, index) => {
          expect(helpBlock.prop('id')).toBe(`radio-hint-${defaultProps.radioOptions[index].value}`);
          expect(helpBlock.prop('children')).toBe(defaultProps.radioOptions[index].hint);
        });
      });

      describe('when option hint is not given', () => {
        const radioOptions = [{
          name: 'some name 1',
          value: 'some value 1',
          label: 'some label 1'
        },
        {
          name: 'some name 2',
          value: 'some value 2',
          label: 'some label 2'
        }];

        test('HelpBlock is not rendered', () => {
          const helpBlock = getWrapper({ radioOptions }).find('HelpBlock');
          expect(helpBlock.length).toBe(0);
        });
      });
    });
  });
});
