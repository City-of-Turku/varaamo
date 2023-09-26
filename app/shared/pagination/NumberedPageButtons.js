
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import constants from 'constants/AppConstants';


function NumberedPageButtons({ pages, currentPage, onChange }) {
  const buttons = [];
  const linkCount = constants.MANAGE_RESERVATIONS.MAX_SHOWN_PAGINATION_BUTTONS;

  // calculate which buttons are shown to not show over max amount
  const links = Math.floor(linkCount / 2);
  let start = Math.max(currentPage - links, 1);
  let end = Math.min(currentPage + links, pages);

  if (end - start < linkCount - 1) {
    if (start === 1 && end < pages) {
      end = Math.min(start + (linkCount - 1), pages);
    } else if (end === pages && start > 1) {
      start = Math.max(end - (linkCount - 1), 1);
    }
  }

  for (let i = start - 1; i < end; i += 1) {
    buttons.push(
      <Button
        className={classNames('app-SearchPagination__page', `app-SearchPagination__page-${i + 1}`, {
          'app-SearchPagination__selected': i + 1 === currentPage,
        })}
        key={`pageButton-${i}`}
        onClick={() => onChange(i + 1)}
      >
        {i + 1}
      </Button>,
    );
  }

  return (
    <React.Fragment>{buttons}</React.Fragment>
  );
}

NumberedPageButtons.propTypes = {
  pages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default NumberedPageButtons;
