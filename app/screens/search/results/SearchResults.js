import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import Loader from 'react-loader';

import ResourceList from 'screens/shared/resource-list';
import { scrollTo } from 'utils/DOMUtils';

class SearchResults extends Component {
  componentDidMount() {
    scrollTo(findDOMNode(this));
  }

  render() {
    const { isFetching, searchResultIds } = this.props;

    return (
      <div id="search-results">
        <Loader loaded={!isFetching}>
          <ResourceList
            emptyMessage="Yhtään hakutulosta ei löytynyt."
            resourceIds={searchResultIds}
          />
        </Loader>
      </div>
    );
  }
}

SearchResults.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  searchResultIds: PropTypes.array.isRequired,
};

export default SearchResults;
