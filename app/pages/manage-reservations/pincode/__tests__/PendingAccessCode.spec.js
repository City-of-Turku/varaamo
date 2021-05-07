import React from 'react';
import { FormattedMessage } from 'react-intl';

import PopoverOverlay from '../../../../shared/popover/PopoverOverlay';
import PendingAccessCode from '../PendingAccessCode';
import iconClock from 'assets/icons/clock-o.svg';
import { shallowWithIntl } from 'utils/testUtils';


describe('PendingAccessCode', () => {
  function getWrapper(props) {
    return shallowWithIntl(<PendingAccessCode {...props} />);
  }
  describe('renders', () => {
    test('PopoverOverlay', () => {
      const overlay = getWrapper().find(PopoverOverlay);
      expect(overlay).toHaveLength(1);
      expect(overlay.prop('content')).toStrictEqual(<FormattedMessage id="common.pincode.waitingForCreation" />);
      expect(overlay.props().children).toStrictEqual(<img alt="common.pincode.waitingForCreation" src={iconClock} />);
    });
  });
});
