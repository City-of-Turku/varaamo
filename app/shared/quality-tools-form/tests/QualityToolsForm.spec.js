import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import QualityToolsForm from '../QualityToolsForm';
import { getFormFieldText, getFormTitleText } from '../qualityToolsUtils';
import StarInput from '../StarInput';

describe('shared/quality-tools-form/QualityToolsForm', () => {
  const defaultProps = {
    currentLanguage: 'fi',
    formData: {
      fi: {
        title: 'title fi',
        starRating: {
          name: 'star rating name fi',
          label: 'star rating label fi',
          hint: 'star rating hint fi'
        },
        textArea: {
          label: 'text area label fi',
          hint: 'text area hint fi',
          placeholder: 'text area placeholder fi'
        }
      }
    },
    handleHoverEnter: () => {},
    handleHoverLeave: () => {},
    handleSetStars: () => {},
    handleSubmit: () => {},
    handleTextChange: () => {},
    hoverTargetStar: -1,
    stars: 3,
    textFeedback: '',
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<QualityToolsForm {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    test('form', () => {
      const form = getWrapper().find('form');
      expect(form).toHaveLength(1);
      expect(form.prop('className')).toBe('quality-tools-form');
      expect(form.prop('onSubmit')).toBe(defaultProps.handleSubmit);
    });

    test('title text', () => {
      const title = getWrapper().find('#quality-tools-form-title');
      expect(title).toHaveLength(1);
      expect(title.text()).toBe(
        getFormTitleText(defaultProps.formData, defaultProps.currentLanguage)
      );
    });

    test('fieldset', () => {
      const fieldset = getWrapper().find('fieldset');
      expect(fieldset).toHaveLength(1);
      expect(fieldset.prop('onMouseLeave')).toBe(defaultProps.handleHoverLeave);
    });

    test('legend', () => {
      const legend = getWrapper().find('legend');
      expect(legend).toHaveLength(1);
      expect(legend.text()).toBe(`${
        getFormFieldText(defaultProps.formData, defaultProps.currentLanguage, 'starRating', 'label')} (${
        getFormFieldText(defaultProps.formData, defaultProps.currentLanguage, 'starRating', 'hint')})`);
    });

    test('StarInputs', () => {
      const starInputs = getWrapper().find(StarInput);
      expect(starInputs).toHaveLength(5);
      starInputs.forEach((starInput, index) => {
        expect(starInput.prop('currentStars')).toBe(defaultProps.stars);
        expect(starInput.prop('handleHoverEnter')).toBe(defaultProps.handleHoverEnter);
        expect(starInput.prop('handleSetStars')).toBe(defaultProps.handleSetStars);
        expect(starInput.prop('hoverTargetStar')).toBe(defaultProps.hoverTargetStar);
        expect(starInput.prop('value')).toBe(index + 1);
      });
    });

    test('text area label', () => {
      const label = getWrapper().find('label#quality-tools-feedback-text-label');
      expect(label).toHaveLength(1);
      expect(label.prop('htmlFor')).toBe('quality-tools-feedback-text');
    });

    test('text area label main span', () => {
      const span = getWrapper().find('span#quality-tools-feedback-text-label-main');
      expect(span).toHaveLength(1);
      expect(span.text()).toBe(getFormFieldText(
        defaultProps.formData, defaultProps.currentLanguage, 'textArea', 'label'
      ));
    });

    test('text area label hint span', () => {
      const span = getWrapper().find('span#quality-tools-feedback-text-hint');
      expect(span).toHaveLength(1);
      expect(span.text()).toBe(getFormFieldText(
        defaultProps.formData, defaultProps.currentLanguage, 'textArea', 'hint'
      ));
    });

    test('textarea', () => {
      const textarea = getWrapper().find('textarea#quality-tools-feedback-text');
      expect(textarea).toHaveLength(1);
      expect(textarea.prop('id')).toBe('quality-tools-feedback-text');
      expect(textarea.prop('onChange')).toBe(defaultProps.handleTextChange);
      expect(textarea.prop('placeholder')).toBe(getFormFieldText(
        defaultProps.formData, defaultProps.currentLanguage, 'textArea', 'placeholder'
      ));
      expect(textarea.prop('rows')).toBe(5);
      expect(textarea.prop('value')).toBe(defaultProps.textFeedback);
    });

    test('div container for submit button', () => {
      const div = getWrapper().find('div');
      expect(div).toHaveLength(1);
    });

    test('submit button', () => {
      const button = getWrapper().find('#quality-tools-feedback-submit-btn');
      expect(button).toHaveLength(1);
      expect(button.prop('id')).toBe('quality-tools-feedback-submit-btn');
      expect(button.prop('onClick')).toBe(defaultProps.handleSubmit);
      expect(button.prop('type')).toBe('submit');
      expect(button.prop('children')).toBe('qualityTools.sendFeedback');
    });
  });
});
