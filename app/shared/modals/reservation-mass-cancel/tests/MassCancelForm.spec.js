import React from 'react';

import Resource from '../../../../utils/fixtures/Resource';
import { mapResourceOptions } from '../massCancelUtils';
import MassCancelForm from '../MassCancelForm';
import { shallowWithIntl } from 'utils/testUtils';
import SelectField from '../../../../pages/manage-reservations/inputs/SelectField';


describe('MassCancelForm', () => {
  const resourceA = Resource.build();
  const resourceB = Resource.build();
  const resources = [resourceA, resourceB];
  const defaultProps = {
    resources,
    selectedResource: '',
    setSelectedResource: () => {},
    errors: {},
    startDate: '',
    setStartDate: () => {},
    endDate: '',
    setEndDate: () => {},
    confirmCancel: false,
    setConfirmCancel: () => {},
    handleOnBlur: () => {},
    t: () => {},
  };
  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<MassCancelForm {...defaultProps} {...extraProps} />);
  }

  describe('rendering', () => {
    test('renders without crashing', () => {
      getWrapper();
    });

    test('renders instructions', () => {
      const wrapper = getWrapper();
      expect(wrapper.find('p').text()).toEqual('MassCancel.instructions');
    });

    test('renders resource select field', () => {
      const select = getWrapper().find(SelectField);
      expect(select).toHaveLength(1);
      expect(select.prop('error')).toBe(defaultProps.errors.selectedResource);
      expect(select.prop('id')).toBe('mass-cancel-resource');
      expect(select.prop('isRequired')).toBe(true);
      expect(select.prop('label')).toBe('MassCancel.resourceLabel');
      expect(select.prop('onChange')).toBeDefined();
      expect(select.prop('options')).toEqual(mapResourceOptions(resources));
      expect(select.prop('value')).toBe(defaultProps.selectedResource);
    });

    test('renders FormGroup for start date', () => {
      const formGroup = getWrapper().find('FormGroup');
      expect(formGroup.at(0).prop('controlId')).toBe('mass-cancel-start-date');
    });

    test('renders ControlLabel for start date', () => {
      const controlLabel = getWrapper().find('ControlLabel').at(0);
      expect(controlLabel.children().at(0).text()).toBe('MassCancel.datetime.startLabel');

      const requiredSpan = controlLabel.find('RequiredSpan');
      expect(requiredSpan).toHaveLength(1);
    });

    test('renders FormControl for start date', () => {
      const formControl = getWrapper().find('FormControl').at(0);
      expect(formControl.prop('aria-describedby')).toBe(defaultProps.errors.startDate ? 'mass-cancel-start-date-error' : null);
      expect(formControl.prop('aria-required')).toBe('true');
      expect(formControl.prop('id')).toBe('mass-cancel-start-date');
      expect(formControl.prop('onBlur')).toBeDefined();
      expect(formControl.prop('onChange')).toBeDefined();
      expect(formControl.prop('type')).toBe('datetime-local');
      expect(formControl.prop('value')).toBe(defaultProps.startDate);
    });

    describe('start errors', () => {
      test('renders error message for start date', () => {
        const wrapper = getWrapper({ errors: { startDate: 'MassCancel.error.required.start' } });
        const helpBlock = wrapper.find('HelpBlock').at(0);
        expect(helpBlock).toHaveLength(1);
        expect(helpBlock.children().at(0).text()).toEqual('MassCancel.error.required.start');
        expect(helpBlock.prop('id')).toBe('mass-cancel-start-date-error');
        expect(helpBlock.prop('role')).toBe('alert');
        expect(helpBlock.prop('className')).toBe('has-error');
      });

      test('does not render error message for start date if no error', () => {
        const wrapper = getWrapper({ errors: { startDate: null } });
        const helpBlock = wrapper.find('HelpBlock').at(0);
        expect(helpBlock).toHaveLength(0);
      });
    });

    test('renders FormGroup for end date', () => {
      const formGroup = getWrapper().find('FormGroup');
      expect(formGroup.at(1).prop('controlId')).toBe('mass-cancel-end-date');
    });

    test('renders ControlLabel for end date', () => {
      const controlLabel = getWrapper().find('ControlLabel').at(1);
      expect(controlLabel.children().at(0).text()).toBe('MassCancel.datetime.endLabel');

      const requiredSpan = controlLabel.find('RequiredSpan');
      expect(requiredSpan).toHaveLength(1);
    });

    test('renders FormControl for end date', () => {
      const formControl = getWrapper().find('FormControl').at(1);
      expect(formControl.prop('aria-describedby')).toBe(defaultProps.errors.endDate ? 'mass-cancel-end-date-error' : null);
      expect(formControl.prop('aria-required')).toBe('true');
      expect(formControl.prop('id')).toBe('mass-cancel-end-date');
      expect(formControl.prop('onBlur')).toBeDefined();
      expect(formControl.prop('onChange')).toBeDefined();
      expect(formControl.prop('type')).toBe('datetime-local');
      expect(formControl.prop('value')).toBe(defaultProps.endDate);
    });

    describe('end errors', () => {
      test('renders error message for end date', () => {
        const wrapper = getWrapper({ errors: { endDate: 'MassCancel.error.required.end' } });
        const helpBlock = wrapper.find('HelpBlock').at(0);
        expect(helpBlock).toHaveLength(1);
        expect(helpBlock.children().at(0).text()).toEqual('MassCancel.error.required.end');
        expect(helpBlock.prop('id')).toBe('mass-cancel-end-date-error');
        expect(helpBlock.prop('role')).toBe('alert');
        expect(helpBlock.prop('className')).toBe('has-error');
      });

      test('does not render error message for end date if no error', () => {
        const wrapper = getWrapper({ errors: { endDate: null } });
        const helpBlock = wrapper.find('HelpBlock').at(0);
        expect(helpBlock).toHaveLength(0);
      });
    });

    test('renders checkbox for confirming cancellation', () => {
      const checkbox = getWrapper().find('Checkbox');
      expect(checkbox.prop('aria-required')).toBe('true');
      expect(checkbox.prop('checked')).toBe(defaultProps.confirmCancel);
      expect(checkbox.prop('onBlur')).toBeDefined();
      expect(checkbox.prop('onChange')).toBeDefined();
      expect(checkbox.children().at(0).text()).toBe('MassCancel.confirmCancel');
    });
  });
});
