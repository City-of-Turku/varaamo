import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { contrastSelector } from 'state/selectors/accessibilitySelectors';
import { currentLanguageSelector } from 'state/selectors/translationSelectors';
import FooterContent from './FooterContent';

export function Footer(props) {
  return (
    <footer className={props.contrast}>
      <FooterContent currentLang={props.currentLanguage} onLinkClick={props.onLinkClick} />
    </footer>
  );
}

Footer.propTypes = {
  onLinkClick: PropTypes.func,
  contrast: PropTypes.string,
  currentLanguage: PropTypes.string,

};

const mapStateToProps = state => ({
  contrast: contrastSelector(state),
  currentLanguage: currentLanguageSelector(state),
});

export default connect(mapStateToProps, null)(Footer);
