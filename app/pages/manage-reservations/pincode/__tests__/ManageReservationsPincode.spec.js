import { shallow } from 'enzyme';
import React from 'react';

import Resource from '../../../../utils/fixtures/Resource';
import GeneratedAccessCode from '../GeneratedAccessCode';
import ManageReservationsPincode from '../ManageReservationsPincode';
import PendingAccessCode from '../PendingAccessCode';

describe('ManageReservationsPincode', () => {
  const defaultProps = {
    reservation: {
      accessCode: '123456',
      resource: Resource.build()
    }
  };

  function getWrapper(props) {
    return shallow(<ManageReservationsPincode {...defaultProps} {...props} />);
  }
  describe('renders', () => {
    test('wrapping div', () => {
      const wrapper = getWrapper().find('.app-ManageReservationPincode');
      expect(wrapper).toHaveLength(1);
    });

    test('empty string for wrapping div if theres no pin for reservation', () => {
      const resource = Resource.build({ generateAccessCodes: undefined });
      const reservation = { resource, accessCode: null };
      const wrapper = getWrapper({ reservation }).find('.app-ManageReservationPincode');
      expect(wrapper).toHaveLength(1);
      expect(wrapper.text()).toBe('');
    });

    test('PendingAccessCode when reservation is waiting for pin', () => {
      const resource = Resource.build({ generateAccessCodes: false });
      const reservation = { resource, accessCode: null };
      const pendingCode = getWrapper({ reservation }).find(PendingAccessCode);
      expect(pendingCode).toHaveLength(1);
    });

    test('GeneratedAccessCode when reservation has a pin code', () => {
      const resource = Resource.build({ generateAccessCodes: false });
      const reservation = { resource, accessCode: '123456' };
      const generatedCode = getWrapper({ reservation }).find(GeneratedAccessCode);
      expect(generatedCode).toHaveLength(1);
    });
  });
});
