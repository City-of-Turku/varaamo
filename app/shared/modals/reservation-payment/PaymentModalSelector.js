
import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';

import { createSelector, createStructuredSelector } from 'reselect';

import { createResourceSelector } from 'state/selectors/dataSelectors';
import modalIsOpenSelectorFactory from 'state/selectors/factories/modalIsOpenSelectorFactory';
import { contrastSelector, fontSizeSelector } from 'state/selectors/accessibilitySelectors';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

function reservationSelector(state) {
  return state.ui.reservations.toShow[0] || state.ui.reservations.toShowEdited[0] || {};
}

const resourceIdSelector = createSelector(
  reservationSelector,
  reservation => reservation.resource
);

const paymentModalSelector = createStructuredSelector({
  contrast: contrastSelector,
  fontSize: fontSizeSelector,
  isSaving: requestIsActiveSelectorFactory(ActionTypes.API.RESERVATION_PUT_REQUEST),
  reservation: reservationSelector,
  resource: createResourceSelector(resourceIdSelector),
  show: modalIsOpenSelectorFactory(ModalTypes.RESERVATION_PAYMENT),
});

export default paymentModalSelector;
