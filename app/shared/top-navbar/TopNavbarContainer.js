import trim from 'lodash/trim';
import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { addNotification } from 'actions/notificationsActions';
import { clearSearchResults } from 'actions/searchActions';
import { authUserSelector, currentUserSelector, isLoggedInSelector } from 'state/selectors/authSelectors';
import { currentLanguageSelector } from 'state/selectors/translationSelectors';
import { contrastSelector } from 'state/selectors/accessibilitySelectors';
import { changeLocale } from 'i18n';
import TopNavbar from './TopNavbar';


const userNameSelector = createSelector(
  currentUserSelector,
  (user) => {
    if (user.firstName || user.lastName) {
      return trim([user.firstName, user.lastName].join(' '));
    } if (user.email) {
      return user.email;
    }
    return user.emails && user.emails.length ? user.emails[0].value : '⠀⠀-⠀⠀';
  }
);

const userIdTokenSelector = createSelector(
  authUserSelector,
  (user) => {
    if (user) {
      return user.id_token;
    }
    return '';
  }
);

const contrastOptionsSelector = state => contrastSelector(state);

export const selector = createStructuredSelector({
  isLoggedIn: isLoggedInSelector,
  currentLanguage: currentLanguageSelector,
  userName: userNameSelector,
  contrast: contrastOptionsSelector,
  idToken: userIdTokenSelector,
});

const actions = {
  addNotification,
  changeLocale,
  clearSearchResults,
};

export default connect(selector, actions)(TopNavbar);
