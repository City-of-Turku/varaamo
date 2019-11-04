import { mapStateToProps } from './AccessibilityInfoPageContainer';

describe('pages/accessibility-info/AccessibilityInfoPageContainer', () => {
  describe('selector', () => {
    function getState(locale = 'fi') {
      return {
        intl: {
          locale,
        }
      };
    }

    describe('currentLanguage', () => {
      test('returns Finnish current locale', () => {
        const selected = mapStateToProps(getState('fi'));
        expect(selected.currentLanguage).toBe('fi');
      });

      test('returns Swedish current locale', () => {
        const selected = mapStateToProps(getState('sv'));
        expect(selected.currentLanguage).toBe('sv');
      });
    });
  });
});
