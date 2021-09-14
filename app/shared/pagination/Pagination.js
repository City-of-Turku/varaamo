import PropTypes from 'prop-types';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';

import injectT from '../../i18n/injectT';
import NumberedPageButtons from './NumberedPageButtons';

function Pagination({
  pages, currentPage, onChange, t
}) {
  return (
    <div className="app-SearchPagination">
      <Button
        className="app-SearchPagination__prev"
        disabled={currentPage === 1}
        onClick={() => onChange(Math.max(1, currentPage - 1))}
      >
        {t('common.previous')}
      </Button>
      {!!pages
       && (
       <NumberedPageButtons
         currentPage={currentPage}
         onChange={onChange}
         pages={pages}
       />
       )}
      <Button
        className="app-SearchPagination__next"
        disabled={currentPage >= pages}
        onClick={() => onChange(Math.min(pages, currentPage + 1))}
      >
        {t('common.next')}
      </Button>
    </div>
  );
}

Pagination.propTypes = {
  pages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(Pagination);
