import { createStructuredSelector } from 'reselect';
import queryString from 'query-string';

import {
  currentUserSelector,
  isAdminSelector,
} from '../../state/selectors/authSelectors';
import dateSelector from '../../state/selectors/dateSelector';
import recurringReservations from '../../state/recurringReservations';

const queriesSelector = (state, props) => {
  const query = props && props.location ? queryString.parse(props.location.search) : {};
  return query;
};

const reservationPageSelector = createStructuredSelector({
  date: dateSelector,
  isAdmin: isAdminSelector,
  queries: queriesSelector,
  recurringReservations: recurringReservations.selectReservations,
  user: currentUserSelector,
});

export default reservationPageSelector;
