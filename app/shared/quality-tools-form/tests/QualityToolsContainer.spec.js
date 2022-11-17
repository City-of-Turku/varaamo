import React from 'react';
import Loader from 'react-loader';

import { shallowWithIntl } from 'utils/testUtils';
import Reservation from '../../../utils/fixtures/Reservation';
import { UnconnectedQualityToolsForm as QualityToolsContainer } from '../QualityToolsContainer';
import QualityToolsForm from '../QualityToolsForm';
import { getFeedbackForm, postFeedback } from '../qualityToolsUtils';

const mockFormData = { fi: {}, en: {}, sv: {} };

jest.mock('../qualityToolsUtils', () => {
  const originalModule = jest.requireActual('../qualityToolsUtils');
  return {
    __esModule: true,
    ...originalModule,
    getFeedbackForm: jest.fn(() => Promise.resolve(mockFormData)),
    postFeedback: jest.fn(),
  };
});

describe('shared/quality-tools-form/QualityToolsContainer', () => {
  const defaultProps = {
    currentLanguage: 'fi',
    reservation: Reservation.build({ id: 123 }),
    state: {},
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<QualityToolsContainer {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    describe('when form has not been submitted yet', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      instance.setState({ isFormSubmitted: false });

      test('Loader', () => {
        const loader = wrapper.find(Loader);
        expect(loader).toHaveLength(1);
        expect(loader.prop('loaded')).toBe(false);
      });

      test('QualityToolsForm', () => {
        const form = wrapper.find(QualityToolsForm);
        expect(form).toHaveLength(1);
        expect(form.prop('currentLanguage')).toBe(defaultProps.currentLanguage);
        expect(form.prop('formData')).toBe(instance.state.formData);
        expect(form.prop('handleHoverEnter')).toBe(instance.handleHoverEnter);
        expect(form.prop('handleHoverLeave')).toBe(instance.handleHoverLeave);
        expect(form.prop('handleSetStars')).toBe(instance.handleSetStars);
        expect(form.prop('handleSubmit')).toBe(instance.handleSubmit);
        expect(form.prop('handleTextChange')).toBe(instance.handleTextChange);
        expect(form.prop('hoverTargetStar')).toBe(instance.state.hoverTargetStar);
        expect(form.prop('stars')).toBe(instance.state.stars);
        expect(form.prop('textFeedback')).toBe(instance.state.textFeedback);
      });
    });

    describe('when form has been submitted', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      instance.setState({ isFormSubmitted: true });

      test('does not render Loader', () => {
        const loader = wrapper.find(Loader);
        expect(loader).toHaveLength(0);
      });

      test('does not render QualityToolsForm', () => {
        const form = wrapper.find(QualityToolsForm);
        expect(form).toHaveLength(0);
      });
    });

    test('thank you container div', () => {
      const div = getWrapper().find('div#quality-tools-feedback-post-thank-you');
      expect(div).toHaveLength(1);
      expect(div.prop('role')).toBe('alert');
    });

    test('thank you text when form has not been submitted yet', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      instance.setState({ isFormSubmitted: false });
      const text = wrapper.find('#quality-tools-feedback-post-thank-you').find('p');
      expect(text).toHaveLength(1);
      expect(text.prop('className')).toBe('hidden');
      expect(text.text()).toBe('qualityTools.thankYouForFeedback');
    });

    test('thank you text when form has been submitted', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      instance.setState({ isFormSubmitted: true });
      const text = wrapper.find('#quality-tools-feedback-post-thank-you').find('p');
      expect(text).toHaveLength(1);
      expect(text.prop('className')).not.toContain('hidden');
      expect(text.text()).toBe('qualityTools.thankYouForFeedback');
    });
  });

  describe('methods', () => {
    describe('componentDidMount', () => {
      test('calls getFeedbackForm and sets correct state', async () => {
        const instance = getWrapper().instance();
        const spy = jest.spyOn(instance, 'setState');
        await instance.componentDidMount();
        expect(getFeedbackForm).toHaveBeenCalledTimes(1);
        expect(getFeedbackForm).toHaveBeenCalledWith(defaultProps.state);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ formData: mockFormData, isFormLoaded: true });
      });
    });

    describe('handleSetStars', () => {
      test('calls setState', () => {
        const instance = getWrapper().instance();
        const spy = jest.spyOn(instance, 'setState');
        const event = { target: { value: '4' } };
        instance.handleSetStars(event);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ stars: 4 });
      });
    });

    describe('handleHoverEnter', () => {
      test('calls setState', () => {
        const instance = getWrapper().instance();
        const spy = jest.spyOn(instance, 'setState');
        instance.handleHoverEnter(2);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ hoverTargetStar: 2 });
      });
    });

    describe('handleHoverLeave', () => {
      test('calls setState', () => {
        const instance = getWrapper().instance();
        const spy = jest.spyOn(instance, 'setState');
        instance.handleHoverLeave();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ hoverTargetStar: -1 });
      });
    });

    describe('handleTextChange', () => {
      test('calls setState', () => {
        const instance = getWrapper().instance();
        const spy = jest.spyOn(instance, 'setState');
        const event = { target: { value: 'test text' } };
        instance.handleTextChange(event);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ textFeedback: 'test text' });
      });
    });

    describe('handleSubmit', () => {
      test('calls postFeedback', () => {
        const instance = getWrapper().instance();
        const event = { preventDefault: () => {} };
        instance.handleSubmit(event);
        expect(postFeedback).toHaveBeenCalledTimes(1);
        expect(postFeedback).toHaveBeenCalledWith(
          defaultProps.reservation.id,
          instance.state.stars,
          instance.state.textFeedback,
          defaultProps.state
        );
      });

      test('calls setState', () => {
        const instance = getWrapper().instance();
        const spy = jest.spyOn(instance, 'setState');
        const event = { preventDefault: () => {} };
        instance.handleSubmit(event);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ isFormSubmitted: true });
      });
    });
  });
});
