import { createStructuredSelector } from 'reselect';

import { currentLanguageSelector } from 'state/selectors/translationSelectors';
import { isLoggedInSelector, isAdminSelector } from 'state/selectors/authSelectors';

const selectedSelector = state => state.ui.reservations.selected;
const isMaintenanceModeOnSelector = state => state.ui.maintenance.isMaintenanceModeOn;

const OvernightCalendarSelector = createStructuredSelector({
  selected: selectedSelector,
  isMaintenanceModeOn: isMaintenanceModeOnSelector,
  currentLanguage: currentLanguageSelector,
  isLoggedIn: isLoggedInSelector,
  isAdmin: isAdminSelector,
});

export default OvernightCalendarSelector;
