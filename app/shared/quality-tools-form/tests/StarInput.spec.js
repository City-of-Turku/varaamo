import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import StarInput from '../StarInput';


describe('shared/quality-tools-form/StarInput', () => {
  const defaultProps = {
    currentStars: 3,
    handleHoverEnter: () => {},
    handleSetStars: () => {},
    hoverTargetStar: -1,
    value: 2,
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<StarInput {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    describe('label', () => {
      test('with correct props', () => {
        const label = getWrapper().find('label');
        expect(label).toHaveLength(1);
        expect(label.prop('htmlFor')).toBe(`star${defaultProps.value}`);
        expect(label.prop('onMouseEnter')).toBeDefined();
      });

      test('with className is-checked when currentStars equals value', () => {
        const label = getWrapper({ currentStars: 4, value: 4 }).find('label');
        expect(label.prop('className')).toContain('is-checked');
      });

      test('without className is-checked when currentStars does not equal value', () => {
        const label = getWrapper({ currentStars: 2, value: 3 }).find('label');
        expect(label.prop('className')).not.toContain('is-checked');
      });

      test('with className active when value <= hoverTargetStar', () => {
        const label = getWrapper({ value: 3, hoverTargetStar: 4, currentStars: 2 }).find('label');
        expect(label.prop('className')).toContain('active');
      });

      test('with className inactive when value > hoverTargetStar', () => {
        const label = getWrapper({ value: 4, hoverTargetStar: 2, currentStars: 1 }).find('label');
        expect(label.prop('className')).toContain('inactive');
      });
    });

    test('input', () => {
      const input = getWrapper().find('input');
      expect(input).toHaveLength(1);
      expect(input.prop('checked')).toBe(defaultProps.value === defaultProps.currentStars);
      expect(input.prop('className')).toBe('visually-hidden');
      expect(input.prop('id')).toBe(`star${defaultProps.value}`);
      expect(input.prop('name')).toBe('star-rating');
      expect(input.prop('onChange')).toBe(defaultProps.handleSetStars);
      expect(input.prop('type')).toBe('radio');
      expect(input.prop('value')).toBe(defaultProps.value);
    });

    describe('label span', () => {
      test('with correct props', () => {
        const labelSpan = getWrapper().find('label').find('span');
        expect(labelSpan).toHaveLength(1);
        expect(labelSpan.prop('className')).toBe('visually-hidden');
      });

      test('with correct text when value is 1', () => {
        const labelSpan = getWrapper({ value: 1 }).find('label').find('span');
        expect(labelSpan.text()).toBe('qualityTools.starInput.label.star');
      });

      test('with correct text when value is not 1', () => {
        const labelSpan = getWrapper({ value: 4 }).find('label').find('span');
        expect(labelSpan.text()).toBe('qualityTools.starInput.label.stars');
      });
    });

    test('label svg', () => {
      const labelSvg = getWrapper().find('label').find('svg');
      expect(labelSvg).toHaveLength(1);
      expect(labelSvg.prop('viewBox')).toBe('0 0 512 512');
    });

    test('label svg path', () => {
      const labelSvgPath = getWrapper().find('label').find('svg').find('path');
      expect(labelSvgPath).toHaveLength(1);
      expect(labelSvgPath.prop('d')).toBeDefined();
    });
  });
});
