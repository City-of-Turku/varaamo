import { get } from 'lodash';
import React from 'react';
import { Label } from 'react-bootstrap';

import { shallowWithIntl } from 'utils/testUtils';
import Reservation from '../../../../utils/fixtures/Reservation';
import ManageReservationsStatus from '../ManageReservationsStatus';
import { getLabelStyle, getLabelText } from '../statusUtils';


describe('PendingAccessCode', () => {
  const defaultProps = {
    reservation: Reservation.build(),
  };

  function getWrapper(props) {
    return shallowWithIntl(<ManageReservationsStatus {...defaultProps} {...props} />);
  }

  describe('renders', () => {
    describe('when reservation.state is truthy', () => {
      test('wrapping div', () => {
        const wrapper = getWrapper().find('.app-ManageReservationsStatus');
        expect(wrapper).toHaveLength(1);
      });

      test('Label', () => {
        const label = getWrapper().find(Label);
        const t = key => key;
        const status = get(defaultProps.reservation, 'state', '');
        expect(label).toHaveLength(1);
        expect(label.prop('bsStyle')).toBe(getLabelStyle(status));
        expect(label.props().children).toBe(getLabelText(status, t));
      });
    });

    describe('when reservation.state is falsy', () => {
      const reservation = Reservation.build({ state: undefined });

      test('empty component', () => {
        const component = getWrapper({ reservation });
        expect(component.isEmptyRender()).toBe(true);
      });
    });
  });
});
