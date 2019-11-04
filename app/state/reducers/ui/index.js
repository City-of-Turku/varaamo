import { combineReducers } from 'redux';

import adminResourcesPageReducer from './adminResourcesPageReducer';
import modalsReducer from './modalsReducer';
import reservationInfoModalReducer from './reservationInfoModalReducer';
import reservationsReducer from './reservationsReducer';
import resourceMapReducer from './resourceMapReducer';
import searchReducer from './searchReducer';
import accessibilityReducer from './accessibilityReducer';
import favoritesPagesReducer from './favoritesPageReducer';

const uiReducers = combineReducers({
  modals: modalsReducer,
  pages: combineReducers(
    {
      adminResources: adminResourcesPageReducer,
      favorites: favoritesPagesReducer
    }
  ),
  reservationInfoModal: reservationInfoModalReducer,
  reservations: reservationsReducer,
  resourceMap: resourceMapReducer,
  search: searchReducer,
  accessibility: accessibilityReducer,
});

export default uiReducers;
