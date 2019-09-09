import { createStructuredSelector } from 'reselect';

import {
  isAdminSelector,
  isLoggedInSelector,
} from '../../../state/selectors/authSelectors';
import dateSelector from '../../../state/selectors/dateSelector';

const reservationCalendarSelector = createStructuredSelector({
  date: dateSelector,
  isAdmin: isAdminSelector,
  isLoggedIn: isLoggedInSelector,
});

export default reservationCalendarSelector;
