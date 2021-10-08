import APP from 'constants/AppConstants';

function isLargerFontSizeSelector(state) {
  return state.ui.accessibility.fontSize !== APP.FONT_SIZES.SMALL;
}

const contrastSelector = state => (state.ui.accessibility.isHighContrast ? 'high-contrast' : '');

/**
 * Returns currently selected fontsize as a css className
 * @param {object} state
 * @returns {string} className for different font size settings
 */
function fontSizeSelector(state) {
  return state.ui.accessibility.fontSize;
}

export {
  isLargerFontSizeSelector,
  contrastSelector,
  fontSizeSelector,
};
