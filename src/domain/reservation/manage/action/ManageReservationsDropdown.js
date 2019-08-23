import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import PropTypes from 'prop-types';

import injectT from '../../../../app/i18n/injectT';

const ManageReservationsDropdown = ({
  t, onInfoClick, reservation
}) => {
  return (
    <div className="app-ManageReservationDropdown">
      <DropdownButton
        id="app-ManageReservationDropdown"
        title={t('ManageReservationsList.actionsHeader')}
      >
        <MenuItem onClick={e => onInfoClick(e, reservation)}>
          {t('ManageReservationsList.actionLabel.information')}
        </MenuItem>
        <MenuItem>{t('ManageReservationsList.actionLabel.approve')}</MenuItem>
        <MenuItem>{t('ManageReservationsList.actionLabel.deny')}</MenuItem>
        <MenuItem>{t('ManageReservationsList.actionLabel.edit')}</MenuItem>
      </DropdownButton>
    </div>
  );
};

ManageReservationsDropdown.propTypes = {
  t: PropTypes.func,
  onInfoClick: PropTypes.func,
  reservation: PropTypes.object
};
export default injectT(ManageReservationsDropdown);
