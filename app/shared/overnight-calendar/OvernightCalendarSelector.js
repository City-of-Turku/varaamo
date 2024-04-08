import { createStructuredSelector } from 'reselect';

const selectedSelector = state => state.ui.reservations.selected;
const isMaintenanceModeOnSelector = state => state.ui.maintenance.isMaintenanceModeOn;

const OvernightCalendarSelector = createStructuredSelector({
  selected: selectedSelector,
  isMaintenanceModeOn: isMaintenanceModeOnSelector,
});

export default OvernightCalendarSelector;
