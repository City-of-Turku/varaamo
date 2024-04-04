import { createStructuredSelector } from 'reselect';

const selectedSelector = state => state.ui.reservations.selected;

const OvernightCalendarSelector = createStructuredSelector({
  selected: selectedSelector,
});

export default OvernightCalendarSelector;
