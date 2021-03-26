
import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';

import { createSelector, createStructuredSelector } from 'reselect';

import { isAdminSelector } from 'state/selectors/authSelectors';
import { createResourceSelector } from 'state/selectors/dataSelectors';
import modalIsOpenSelectorFactory from 'state/selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';
import { hasOrder } from '../../../utils/reservationUtils';

function reservationSelector(state) {
  return state.ui.reservations.toCancel[0] || {};
}

const resourceIdSelector = createSelector(
  reservationSelector,
  reservation => reservation.resource
);

const cancelAllowedSelector = createSelector(
  isAdminSelector,
  reservationSelector,
  (isAdmin, reservation) => (
    isAdmin
    || (!reservation.needManualConfirmation && !hasOrder(reservation))
    || (reservation.state !== 'confirmed' && !hasOrder(reservation))
  )
);

const reservationCancelModalSelector = createStructuredSelector({
  cancelAllowed: cancelAllowedSelector,
  isCancellingReservations: requestIsActiveSelectorFactory(
    ActionTypes.API.RESERVATION_DELETE_REQUEST
  ),
  reservation: reservationSelector,
  resource: createResourceSelector(resourceIdSelector),
  show: modalIsOpenSelectorFactory(ModalTypes.RESERVATION_CANCEL),
});

export default reservationCancelModalSelector;
