import APP from 'constants/AppConstants';

import { getState } from 'utils/testUtils';
import { isLargerFontSizeSelector, contrastSelector, fontSizeSelector } from './accessibilitySelectors';

describe('state/selectors/accessibilitySelectors', () => {
  describe('isLargerFontSizeSelector', () => {
    function getSelected(fontSize = APP.FONT_SIZES.SMALL) {
      const state = getState({
        'ui.accessibility': { fontSize }
      });
      return isLargerFontSizeSelector(state);
    }

    test('returns false if font size is small/default', () => {
      expect(getSelected()).toBe(false);
    });

    test('returns true if font size is medium', () => {
      expect(getSelected(APP.FONT_SIZES.MEDIUM)).toBe(true);
    });

    test('returns true if font size is large', () => {
      expect(getSelected(APP.FONT_SIZES.LARGE)).toBe(true);
    });
  });

  describe('fontSizeSelector', () => {
    function getSelected(fontSize = APP.FONT_SIZES.SMALL) {
      const state = getState({
        'ui.accessibility': { fontSize }
      });
      return fontSizeSelector(state);
    }
    test('returns current font size css className', () => {
      expect(getSelected()).toBe(APP.FONT_SIZES.SMALL);
      expect(getSelected(APP.FONT_SIZES.MEDIUM)).toBe(APP.FONT_SIZES.MEDIUM);
      expect(getSelected(APP.FONT_SIZES.LARGE)).toBe(APP.FONT_SIZES.LARGE);
    });
  });

  describe('contrastSelector', () => {
    function getSelected(isHighContrast = false) {
      const state = getState({
        'ui.accessibility': { isHighContrast }
      });
      return contrastSelector(state);
    }

    test('returns default contrast', () => {
      expect(getSelected()).toBe('');
    });

    test('returns "high-contrast" when true', () => {
      expect(getSelected(true)).toBe('high-contrast');
    });
  });
});
