import PropTypes from 'prop-types';
import moment from 'moment';
import React, { Component } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchFavoritedResources, favoriteResource, unfavoriteResource } from 'actions/resourceActions';
import { fetchUnits } from 'actions/unitActions';
import { clearFavorites } from 'actions/uiActions';
import { injectT } from 'i18n';
import PageWrapper from 'pages/PageWrapper';
import favoritesPageSelector from './favoritesPageSelector';
import FavoriteItem from './favoriteItem';

class UnconnectedFavoritesPage extends Component {
  constructor(props) {
    super(props);
    this.fetchResources = this.fetchResources.bind(this);
  }

  componentDidMount() {
    this.fetchResources();
  }

  componentWillUnmount() {
    this.props.actions.clearFavorites();
  }

  handleLinkClick = () => {
    const scrollTop = window.pageYOffset
      || document.documentElement.scrollTop
      || document.body.scrollTop;
    const { location, history } = this.props;
    const { pathname, search } = location;
    history.replace({ pathname, search, state: { scrollTop } });
  };

  fetchResources(date = this.props.date) {
    this.props.actions.fetchFavoritedResources(moment(date), 'favoritesPage');
    this.props.actions.fetchUnits();
  }

  render() {
    const {
      isFetchingResources,
      t, resources, resourcesLoaded,
      date, actions, isLargerFontSize, fontSize
    } = this.props;
    const isBiggestFontSize = fontSize === '__font-size-large';

    return (
      <div className="app-Favorites">
        <PageWrapper title={t('Navbar.userFavorites')}>
          <Loader loaded={Boolean(!isFetchingResources || resources.length)}>
            {resourcesLoaded && (
            <React.Fragment>
              <h1>{t('Navbar.userFavorites')}</h1>
              <div className="favorites-list">
                <div className={`favorite-row${isBiggestFontSize ? '__large' : ''}`}>
                  {resources.map((resource, key) => (
                    <FavoriteItem
                      actions={actions}
                      date={date}
                      handleClick={this.handleLinkClick}
                      isLarger={isLargerFontSize}
                      key={key}
                      resource={resource}
                    />
                  ))
                  }
                </div>
              </div>
            </React.Fragment>
            )}
            {!resourcesLoaded && (
            <div className="">
              <h1>{t('Notifications.errorMessage')}</h1>
            </div>
            )}
          </Loader>
        </PageWrapper>
      </div>
    );
  }
}

UnconnectedFavoritesPage.propTypes = {
  actions: PropTypes.object.isRequired,
  date: PropTypes.string,
  fontSize: PropTypes.string,
  isLargerFontSize: PropTypes.bool,
  t: PropTypes.func.isRequired,
  isFetchingResources: PropTypes.bool.isRequired,
  resources: PropTypes.array.isRequired,
  resourcesLoaded: PropTypes.bool,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

UnconnectedFavoritesPage = injectT(UnconnectedFavoritesPage); // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    fetchFavoritedResources,
    fetchUnits,
    favoriteResource,
    unfavoriteResource,
    clearFavorites,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedFavoritesPage };

export default (
  connect(favoritesPageSelector, mapDispatchToProps)(injectT(UnconnectedFavoritesPage))
);
