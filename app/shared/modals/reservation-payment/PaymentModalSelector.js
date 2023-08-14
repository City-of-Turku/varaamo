
import { createSelector, createStructuredSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';
import { createResourceSelector } from 'state/selectors/dataSelectors';
import modalIsOpenSelectorFactory from 'state/selectors/factories/modalIsOpenSelectorFactory';
import { contrastSelector, fontSizeSelector } from 'state/selectors/accessibilitySelectors';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';
import { isLoggedInSelector, loginExpiresAtSelector } from 'state/selectors/authSelectors';

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
  isLoggedIn: isLoggedInSelector,
  isSaving: requestIsActiveSelectorFactory(ActionTypes.API.RESERVATION_PUT_REQUEST),
  loginExpiresAt: loginExpiresAtSelector,
  reservation: reservationSelector,
  resource: createResourceSelector(resourceIdSelector),
  show: modalIsOpenSelectorFactory(ModalTypes.RESERVATION_PAYMENT),
});

export default paymentModalSelector;
