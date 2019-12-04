import { connect } from 'react-redux';

import { currentLanguageSelector } from 'state/selectors/translationSelectors';
import AboutPage from './AboutPage';

export const mapStateToProps = state => ({
  currentLanguage: currentLanguageSelector(state)
});

export default connect(mapStateToProps, null)(AboutPage);
