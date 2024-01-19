import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { clearSearchResults } from 'actions/searchActions';
import { isAdminSelector, isLoggedInSelector, authUserAmrSelector } from 'state/selectors/authSelectors';
import { contrastSelector } from 'state/selectors/accessibilitySelectors';
import { changeLocale } from 'i18n';
import { currentLanguageSelector } from 'state/selectors/translationSelectors';
import MainNavbar from './MainNavbar';

const contrastOptionsSelector = state => contrastSelector(state);

export const selector = createStructuredSelector({
  isAdmin: isAdminSelector,
  isLoggedIn: isLoggedInSelector,
  contrast: contrastOptionsSelector,
  currentLanguage: currentLanguageSelector,
  authUserAmr: authUserAmrSelector,
});

const actions = {
  changeLocale,
  clearSearchResults,
};

export default connect(selector, actions)(MainNavbar);
