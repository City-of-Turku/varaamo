import ACC from 'constants/AppConstants';
import { selector } from './TopNavbarFontContainer';

describe('shared/top-navbar/accessibility/TopNavbarFontContainer', () => {
  describe('selector', () => {
    function getState() {
      return {
        ui: {
          accessibility: { fontSize: ACC.FONT_SIZES.SMALL }
        }
      };
    }

    describe('font size', () => {
      test('return font size', () => {
        const selected = selector(getState());
        expect(selected.fontSize).toBeDefined();
      });
    });
  });
});
