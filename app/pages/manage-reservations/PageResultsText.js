import React from 'react';
import PropTypes from 'prop-types';

import injectT from 'i18n/injectT';
import { getHiddenReservationCount, getPageResultsText } from './manageReservationsPageUtils';


function PageResultsText({
  currentPage, pageSize, reservations, totalReservations, filteredReservations, t
}) {
  const resultNumbersText = getPageResultsText(
    currentPage - 1, pageSize, reservations.length, totalReservations
  );
  const hidden = getHiddenReservationCount(reservations, filteredReservations);

  const resultsText = `${t('ManageReservationsPage.searchResults', { results: resultNumbersText })}`;
  const noResultsText = t('ManageReservationsPage.noSearchResults');
  const hiddenResultsText = hidden > 0 ? ` (${t('ManageReservationsPage.searchResultsHidden', { count: hidden })})` : '';

  return (
    <span role="status">
      {totalReservations > 0 ? resultsText + hiddenResultsText : noResultsText}
    </span>
  );
}

PageResultsText.propTypes = {
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  reservations: PropTypes.array.isRequired,
  totalReservations: PropTypes.number.isRequired,
  filteredReservations: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(PageResultsText);
