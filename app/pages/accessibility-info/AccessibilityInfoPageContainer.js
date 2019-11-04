import { connect } from 'react-redux';

import AccessibilityInfoPage from './AccessibilityInfoPage';

export const mapStateToProps = state => ({
  currentLanguage: state.intl.locale,
});

export default connect(mapStateToProps, null)(AccessibilityInfoPage);
