import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import get from 'lodash/get';
import { Table } from 'react-bootstrap';
import { injectIntl, intlShape } from 'react-intl';

import * as dataUtils from '../../../../common/data/utils';
import injectT from '../../../../app/i18n/injectT';
import ManageReservationsStatus from '../status/ManageReservationsStatus';
import ManageReservationsPincode from '../pincode/ManageReservationsPincode';
import ManageReservationsComment from '../comment/ManageReservationsComment';
import ManageReservationsDropdown from '../action/ManageReservationsDropdown';

export const getDateAndTime = (reservation) => {
  const begin = moment(reservation.begin);
  const end = moment(reservation.end);

  return `${begin.format('ddd L HH:mm')} - ${end.format('HH:mm')}`;
};

const ManageReservationsList = ({
  intl,
  t,
  reservations = [],
  onInfoClick
}) => {
  return (
    <div className="app-ManageReservationsList">
      <Table className="app-ManageReservationsList__table">
        <thead>
          <tr>
            <th>{t('ManageReservationsList.subjectHeader')}</th>
            <th>{t('ManageReservationsList.nameHeader')}</th>
            <th>{t('ManageReservationsList.emailHeader')}</th>
            <th>{t('ManageReservationsList.resourceHeader')}</th>
            <th>{t('ManageReservationsList.locationHeader')}</th>
            <th>{t('ManageReservationsList.dateAndTimeHeader')}</th>
            <th />
            <th>{t('ManageReservationsList.pinHeader')}</th>
            <th />
            <th>{t('ManageReservationsList.statusHeader')}</th>
            <th>{t('ManageReservationsList.actionsHeader')}</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => {
            return (
              <tr key={`reservation-${reservation.id}`}>
                <td>{get(reservation, 'event_description', '')}</td>
                <td>{get(reservation, 'user.display_name', '')}</td>
                <td>{get(reservation, 'user.email', '')}</td>
                <td>{dataUtils.getLocalizedFieldValue(get(reservation, 'resource.name'), intl.locale)}</td>
                <td>{dataUtils.getLocalizedFieldValue(get(reservation, 'resource.unit.name'), intl.locale)}</td>
                <td>{getDateAndTime(reservation)}</td>
                <td />
                <td><ManageReservationsPincode reservation={reservation} /></td>
                <td><ManageReservationsComment comments={reservation.comments} /></td>
                <td><ManageReservationsStatus reservation={reservation} /></td>
                <td><ManageReservationsDropdown onInfoClick={onInfoClick} reservation={reservation} /></td>
              </tr>

            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

ManageReservationsList.propTypes = {
  t: PropTypes.func.isRequired,
  reservations: PropTypes.array,
  intl: intlShape,
  onInfoClick: PropTypes.func
};

export const UnwrappedManageReservationsList = injectT(ManageReservationsList);
export default injectIntl(UnwrappedManageReservationsList);
