
import { connect } from 'react-redux';

import AccessibilityInfoPage from './AccessibilityInfoPage';
import { currentLanguageSelector } from 'state/selectors/translationSelectors';

export const mapStateToProps = state => ({
  currentLanguage: currentLanguageSelector(state)
});
export default connect(mapStateToProps, null)(AccessibilityInfoPage);
