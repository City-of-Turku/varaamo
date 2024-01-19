
import sortBy from 'lodash/sortBy';
import values from 'lodash/values';
import { createSelector, createStructuredSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import { contrastSelector, isLargerFontSizeSelector } from 'state/selectors/accessibilitySelectors';
import { purposesSelector } from 'state/selectors/dataSelectors';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';
import { authUserAmrSelector, isAdminSelector } from '../../state/selectors/authSelectors';
import { currentLanguageSelector } from '../../state/selectors/translationSelectors';

const contrastOptionsSelector = state => contrastSelector(state);
const purposeOptionsSelector = createSelector(
  purposesSelector,
  (purposes) => {
    const purposeOptions = values(purposes)
      .filter(purpose => purpose.parent === null)
      .map(purpose => ({
        value: purpose.id,
        label: purpose.name,
        image: purpose.image,
      }));
    return sortBy(purposeOptions, 'label');
  }
);

const homePageSelector = createStructuredSelector({
  isFetchingPurposes: requestIsActiveSelectorFactory(ActionTypes.API.PURPOSES_GET_REQUEST),
  isLargerFontSize: isLargerFontSizeSelector,
  purposes: purposeOptionsSelector,
  contrast: contrastOptionsSelector,
  authUserAmr: authUserAmrSelector,
  isAdmin: isAdminSelector,
  currentLanguage: currentLanguageSelector,
});

export default homePageSelector;
