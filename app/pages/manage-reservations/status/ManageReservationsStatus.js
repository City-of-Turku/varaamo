import * as React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Label from 'react-bootstrap/lib/Label';

import injectT from 'i18n/injectT';
import { getLabelStyle, getLabelText } from './statusUtils';

function ManageReservationsStatus({ reservation, t }) {
  const status = get(reservation, 'state', '');

  if (!status) {
    return null;
  }

  return (
    <div className="app-ManageReservationsStatus">
      <Label bsStyle={getLabelStyle(status)}>
        {getLabelText(status, t)}
      </Label>
    </div>
  );
}

ManageReservationsStatus.propTypes = {
  reservation: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ManageReservationsStatus);
