import React from 'react';
import { Modal } from 'react-bootstrap';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import { shallowWithIntl } from 'utils/testUtils';
import Resource from '../../../../utils/fixtures/Resource';
import { UnconnectedResourceOrderModal as ResourceOrderModal } from '../ResourceOrderModal';


describe('ResourceOrderModal', () => {
  const resourceA = Resource.build();
  const resourceB = Resource.build();
  const resources = [resourceA, resourceB];
  const defaultProps = {
    resources,
    show: true,
    fontSize: '__font-size-small',
    onClose: jest.fn(),
    t: () => {},
    actions: {
      addNotification: jest.fn(),
      fetchUser: jest.fn(),
    },
    state: {},
    resourceOrder: [resourceA.id, resourceB.id],
    user: { uuid: 'user-uuid' },
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<ResourceOrderModal {...defaultProps} {...extraProps} />);
  }

  describe('rendering', () => {
    test('renders a Modal', () => {
      const modal = getWrapper().find(Modal);
      expect(modal).toHaveLength(1);
      expect(modal.prop('show')).toBe(true);
      expect(modal.prop('className')).toBe(`resource-order-modal ${defaultProps.fontSize}`);
      expect(modal.prop('onHide')).toBe(defaultProps.onClose);
      expect(modal.prop('animation')).toBe(false);
    });

    test('renders a Modal.Header', () => {
      const header = getWrapper().find(Modal.Header);
      expect(header).toHaveLength(1);
      expect(header.prop('closeButton')).toBe(true);
      expect(header.prop('closeLabel')).toBe('ModalHeader.closeButtonText');
    });

    test('renders a Modal.Title', () => {
      const title = getWrapper().find(Modal.Title);
      expect(title).toHaveLength(1);
      expect(title.children().text()).toBe('ResourceOrder.label');
      expect(title.prop('componentClass')).toBe('h2');
    });

    test('renders a Modal.Body', () => {
      const body = getWrapper().find(Modal.Body);
      expect(body).toHaveLength(1);
      expect(body.prop('style')).toStrictEqual({ overflowY: 'initial', maxHeight: 'fit-content' });
      expect(body.find('p').text()).toBe('ResourceOrder.dragAndDropHelp');
    });

    test('renders a DragDropContext', () => {
      const context = getWrapper().find(DragDropContext);
      expect(context).toHaveLength(1);
      expect(context.prop('onDragEnd')).toBeDefined();
    });

    test('renders a Droppable', () => {
      const droppable = getWrapper().find(Droppable);
      expect(droppable).toHaveLength(1);
      expect(droppable.prop('droppableId')).toBe('droppable');
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
      expect(backButton.prop('onClick')).toBe(defaultProps.onClose);
      expect(backButton.children().text()).toBe('common.back');
    });

    test('renders a reset button', () => {
      const resetButton = getWrapper().find('Button').at(1);
      expect(resetButton).toHaveLength(1);
      expect(resetButton.prop('bsStyle')).toBe('warning');
      expect(resetButton.prop('className')).toBe(defaultProps.fontSize);
      expect(resetButton.prop('onClick')).toBeDefined();
      expect(resetButton.children().text()).toBe('ResourceOrder.resetOrder');
    });

    test('renders a save order button', () => {
      const cancelButton = getWrapper().find('Button').at(2);
      expect(cancelButton).toHaveLength(1);
      expect(cancelButton.prop('bsStyle')).toBe('success');
      expect(cancelButton.prop('className')).toBe(defaultProps.fontSize);
      expect(cancelButton.prop('onClick')).toBeDefined();
      expect(cancelButton.children().text()).toBe('common.save');
    });
  });
});
