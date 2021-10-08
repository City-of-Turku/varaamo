import ActionTypes from 'constants/ActionTypes';

import moment from 'moment';
import { createSelector, createStructuredSelector } from 'reselect';

import { createIsStaffSelector, isAdminSelector } from 'state/selectors/authSelectors';
import { createResourceSelector } from 'state/selectors/dataSelectors';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';
import { currentLanguageSelector } from 'state/selectors/translationSelectors';
import { contrastSelector, fontSizeSelector, isLargerFontSizeSelector } from 'state/selectors/accessibilitySelectors';

function reservationSelector(state) {
  return state.ui.reservationInfoModal.reservation || {};
}

const reservationIsEditableSelector = createSelector(
  reservationSelector,
  (reservation) => {
    const isPastReservation = moment(reservation.end).isBefore(moment());
    return !isPastReservation && reservation.state !== 'cancelled';
  }
);

const resourceIdSelector = createSelector(
  reservationSelector,
  reservation => reservation.resource
);

const resourceSelector = createResourceSelector(resourceIdSelector);

const reservationInfoModalSelector = createStructuredSelector({
  contrast: contrastSelector,
  currentLanguage: currentLanguageSelector,
  fontSize: fontSizeSelector,
  isAdmin: isAdminSelector,
  isEditing: state => state.ui.reservationInfoModal.isEditing,
  isLargerFontSize: isLargerFontSizeSelector,
  isSaving: requestIsActiveSelectorFactory(ActionTypes.API.RESERVATION_PUT_REQUEST),
  isStaff: createIsStaffSelector(resourceSelector),
  reservation: reservationSelector,
  reservationIsEditable: reservationIsEditableSelector,
  resource: resourceSelector,
  show: state => state.ui.reservationInfoModal.show,
});

export default reservationInfoModalSelector;
