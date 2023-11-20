import React from 'react';
import { Modal } from 'react-bootstrap';

import { shallowWithIntl } from 'utils/testUtils';
import Resource from '../../../../utils/fixtures/Resource';
import { UnconnectedMassCancelModal as MassCancelModal } from '../MassCancelModal';
import MassCancelForm from '../MassCancelForm';
import { FORM_INITIAL_VALUES } from '../massCancelUtils';


describe('MassCancelForm', () => {
  const resourceA = Resource.build();
  const resourceB = Resource.build();
  const resources = { [resourceA.id]: resourceA, [resourceB.id]: resourceB };
  const defaultProps = {
    resources,
    show: true,
    fontSize: '__font-size-small',
    onCancelSuccess: jest.fn(),
    onClose: jest.fn(),
    t: () => {},
    actions: {
      addNotification: jest.fn(),
      fetchResources: jest.fn(),
    },
    state: {},
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<MassCancelModal {...defaultProps} {...extraProps} />);
  }

  describe('rendering', () => {
    test('renders a Modal', () => {
      const modal = getWrapper().find(Modal);
      expect(modal).toHaveLength(1);
      expect(modal.prop('show')).toBe(true);
      expect(modal.prop('className')).toBe(defaultProps.fontSize);
      expect(modal.prop('onHide')).toBeDefined();
      expect(modal.prop('animation')).toBe(false);
    });

    test('renders a Modal.Header', () => {
      const header = getWrapper().find(Modal.Header);
      expect(header).toHaveLength(1);
      expect(header.prop('closeButton')).toBe(true);
    });

    test('renders a Modal.Title', () => {
      const title = getWrapper().find(Modal.Title);
      expect(title).toHaveLength(1);
      expect(title.children().text()).toBe('common.cancelReservations');
      expect(title.prop('componentClass')).toBe('h2');
    });

    test('renders a Modal.Body', () => {
      const body = getWrapper().find(Modal.Body);
      expect(body).toHaveLength(1);
    });

    test('renders a MassCancelForm', () => {
      const form = getWrapper().find(MassCancelForm);
      expect(form).toHaveLength(1);
      expect(form.prop('resources')).toStrictEqual(Object.values(defaultProps.resources));
      expect(form.prop('selectedResource')).toBe(FORM_INITIAL_VALUES.selectedResource);
      expect(form.prop('confirmCancel')).toBe(FORM_INITIAL_VALUES.confirmCancel);
      expect(form.prop('endDate')).toBe(FORM_INITIAL_VALUES.endDate);
      expect(form.prop('errors')).toBe(FORM_INITIAL_VALUES.errors);
      expect(form.prop('setConfirmCancel')).toBeDefined();
      expect(form.prop('setEndDate')).toBeDefined();
      expect(form.prop('setSelectedResource')).toBeDefined();
      expect(form.prop('setStartDate')).toBeDefined();
      expect(form.prop('startDate')).toBe(FORM_INITIAL_VALUES.startDate);
      expect(form.prop('handleOnBlur')).toBeDefined();
    });

    test('renders a Modal.Footer', () => {
      const footer = getWrapper().find(Modal.Footer);
      expect(footer).toHaveLength(1);
    });

    test('renders a back button', () => {
      const backButton = getWrapper().find('Button').at(0);
      expect(backButton).toHaveLength(1);
      expect(backButton.prop('bsStyle')).toBe('primary');
      expect(backButton.prop('className')).toBe(defaultProps.fontSize);
      expect(backButton.prop('onClick')).toBeDefined();
      expect(backButton.children().text()).toBe('common.back');
    });

    test('renders a cancel reservations button', () => {
      const cancelButton = getWrapper().find('Button').at(1);
      expect(cancelButton).toHaveLength(1);
      expect(cancelButton.prop('bsStyle')).toBe('danger');
      expect(cancelButton.prop('className')).toBe(defaultProps.fontSize);
      expect(cancelButton.prop('disabled')).toBe(true);
      expect(cancelButton.prop('onClick')).toBeDefined();
      expect(cancelButton.children().text()).toBe('MassCancel.cancelReservations');
    });
  });
});
