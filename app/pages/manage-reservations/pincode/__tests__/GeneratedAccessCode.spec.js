import { shallow } from 'enzyme';
import React from 'react';

import TooltipOverlay from '../../../../shared/tooltip/TooltipOverlay';
import GeneratedAccessCode from '../GeneratedAccessCode';


describe('GeneratedAccessCode', () => {
  const defaultProps = {
    accessCode: '123456',
  };

  function getWrapper(props) {
    return shallow(<GeneratedAccessCode {...defaultProps} {...props} />);
  }
  describe('renders', () => {
    test('TooltipOverlay', () => {
      const overlay = getWrapper().find(TooltipOverlay);
      const expectedChildren = (
        <span>
          <span aria-hidden="true">****</span>
          <span className="sr-only">{defaultProps.accessCode}</span>
        </span>
      );
      expect(overlay).toHaveLength(1);
      expect(overlay.prop('content')).toStrictEqual(<p>{defaultProps.accessCode}</p>);
      expect(overlay.props().children).toStrictEqual(expectedChildren);
    });
  });
});
