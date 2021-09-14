import React from 'react';
import { shallow } from 'enzyme';
import { OverlayTrigger } from 'react-bootstrap';

import TooltipOverlay from '../TooltipOverlay';

describe('TooltipOverlay', () => {
  const defaultProps = {
    children: <span>foo</span>,
    content: <span>bar</span>,
    placement: 'bottom',
  };

  function getWrapper(props) {
    return shallow(<TooltipOverlay {...defaultProps} {...props} />);
  }

  describe('renders', () => {
    test('wrapping div', () => {
      const wrapper = getWrapper().find('.app-TooltipOverlay');
      expect(wrapper).toHaveLength(1);
    });

    test('OverlayTrigger', () => {
      const overlayTrigger = getWrapper().find(OverlayTrigger);
      expect(overlayTrigger).toHaveLength(1);
      expect(overlayTrigger.prop('overlay')).toBeDefined();
      expect(overlayTrigger.prop('placement')).toBe(defaultProps.placement);
      expect(overlayTrigger.props().children).toBe(defaultProps.children);
    });
  });
});
