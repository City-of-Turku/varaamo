import { createStructuredSelector } from 'reselect';

import { currentLanguageSelector } from 'state/selectors/translationSelectors';
import {
  isLoggedInSelector, createIsStaffSelector, isSuperUserSelector
} from 'state/selectors/authSelectors';
import { createResourceSelector, createStrongAuthSatisfiedSelector } from 'state/selectors/dataSelectors';

const resourceIdSelector = (state, props) => props.params.id;
const resourceSelector = createResourceSelector(resourceIdSelector);
const selectedSelector = state => state.ui.reservations.selected;
const isMaintenanceModeOnSelector = state => state.ui.maintenance.isMaintenanceModeOn;

const OvernightCalendarSelector = createStructuredSelector({
  selected: selectedSelector,
  isMaintenanceModeOn: isMaintenanceModeOnSelector,
  isStrongAuthSatisfied: createStrongAuthSatisfiedSelector(resourceSelector),
  currentLanguage: currentLanguageSelector,
  isLoggedIn: isLoggedInSelector,
  isStaff: createIsStaffSelector(resourceSelector),
  isSuperuser: isSuperUserSelector,
});

export default OvernightCalendarSelector;
