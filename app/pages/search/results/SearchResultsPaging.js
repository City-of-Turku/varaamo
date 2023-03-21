
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';

import constants from 'constants/AppConstants';
import { injectT } from 'i18n';
import { getSearchPageUrl } from 'utils/searchUtils';

class SearchResultsPaging extends React.Component {
  static propTypes = {
    filters: PropTypes.object.isRequired,
    resultCount: PropTypes.number.isRequired,
    history: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
  };

  handleClick(page) {
    const { filters, history } = this.props;
    const nextPageFilters = { ...filters, page };
    history.push(getSearchPageUrl(nextPageFilters));
  }

  renderPageButtons(pageCount, currentPage) {
    let current = 1;
    const pages = [];
    while (current <= pageCount) {
      pages.push(this.renderPageButton(current, currentPage));
      current += 1;
    }
    return pages;
  }

  renderPageButton(page, currentPage) {
    return (
      <Button
        className={classNames('app-SearchResultsPaging__page', {
          'app-SearchResultsPaging__selected': currentPage === page,
        })}
        key={`page${page}`}
        onClick={() => this.handleClick(page)}
      >
        {page}
      </Button>
    );
  }

  render() {
    const { resultCount, t } = this.props;
    if (!resultCount) {
      return <section />;
    }

    const { page } = this.props.filters || 1;
    const pages = Math.ceil(resultCount / constants.SEARCH_PAGE_SIZE);

    return (
      <section aria-label={t('SearchResultsPaging.section.name')} className="app-SearchResultsPaging">
        <Button
          aria-label={t('SearchResultsPaging.previous')}
          className="app-SearchResultsPaging__prev"
          disabled={page === 1}
          id="Previous page"
          onClick={() => this.handleClick(page - 1)}
        >


          &laquo;
        </Button>
        {this.renderPageButtons(pages, page)}
        <Button
          aria-label={t('SearchResultsPaging.next')}
          className="app-SearchResultsPaging__next"
          disabled={page >= pages}
          id="Next page"
          onClick={() => this.handleClick(page + 1)}
        >


          &raquo;
        </Button>
      </section>
    );
  }
}
export default injectT(SearchResultsPaging);
