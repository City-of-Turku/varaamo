import React from 'react';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

import injectT from '../../../i18n/injectT';
import ReservationDataRow from './ReservationDataRow';

function ManageReservationsList({
  t, reservations, locale, onInfoClick, onEditClick, onEditReservation
}) {
  return (
    <div className="app-ManageReservationsList">
      <Table className="app-ManageReservationsList__table">
        <thead>
          <tr>
            <th>{t('ManageReservationsList.nameHeader')}</th>
            <th>{t('ManageReservationsList.emailHeader')}</th>
            <th>{t('ManageReservationsList.resourceHeader')}</th>
            <th>{t('ManageReservationsList.premiseHeader')}</th>
            <th>{t('ManageReservationsList.dateAndTimeHeader')}</th>
            <th>{t('ManageReservationsList.pinHeader')}</th>
            <th>{t('common.comments')}</th>
            <th>{t('ManageReservationsList.statusHeader')}</th>
            <th>{t('ManageReservationsList.actionsHeader')}</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(reservation => (
            <ReservationDataRow
              key={`reservation-${reservation.id}`}
              locale={locale}
              onEditClick={onEditClick}
              onEditReservation={onEditReservation}
              onInfoClick={onInfoClick}
              reservation={reservation}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

ManageReservationsList.propTypes = {
  t: PropTypes.func.isRequired,
  reservations: PropTypes.array.isRequired,
  onInfoClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onEditReservation: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
};

export default injectT(ManageReservationsList);
