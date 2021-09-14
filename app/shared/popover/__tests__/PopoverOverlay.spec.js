import React from 'react';
import { shallow } from 'enzyme';
import { OverlayTrigger } from 'react-bootstrap';

import PopoverOverlay from '../PopoverOverlay';

describe('PopoverOverlay', () => {
  const defaultProps = {
    content: <span>test content</span>,
    title: <span>test title</span>,
    trigger: 'hover',
    children: <span>test children</span>,
    placement: 'bottom'
  };

  function getWrapper(props) {
    return shallow(<PopoverOverlay {...defaultProps} {...props} />);
  }
  describe('renders', () => {
    test('wrapping div', () => {
      const wrapper = getWrapper().find('.app-PopoverOverlay');
      expect(wrapper).toHaveLength(1);
    });

    test('OverlayTrigger', () => {
      const overlayTrigger = getWrapper().find(OverlayTrigger);
      expect(overlayTrigger).toHaveLength(1);
      expect(overlayTrigger.prop('overlay')).toBeDefined();
      expect(overlayTrigger.prop('placement')).toBe(defaultProps.placement);
      expect(overlayTrigger.prop('trigger')).toBe(defaultProps.trigger);
      expect(overlayTrigger.props().children).toBe(defaultProps.children);
    });
  });
});
