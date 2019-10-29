import { selector } from './TopNavbarContainer';

describe('shared/top-navbar/TopNavbarContainer', () => {
  describe('selector', () => {
    function getState(locale = 'fi', user = {}) {
      return {
        auth: {
          user: {
            profile: {
              sub: user.id,
            },
          },
        },
        data: {
          users: { [user.id]: user },
        },
        intl: {
          locale,
        },
        ui: {
          accessibility: { isNormalContrast: true }
        }
      };
    }

    describe('contrast', () => {
      test('returns contrast', () => {
        const selected = selector(getState());
        expect(selected.contrast).toBeDefined();
      });
    });

    describe('currentLanguage', () => {
      test('returns sv is current locale is se', () => {
        const selected = selector(getState('se'));
        expect(selected.currentLanguage).toBe('sv');
      });

      test('returns the current locale', () => {
        const selected = selector(getState('en'));
        expect(selected.currentLanguage).toBe('en');
      });
    });

    test('returns isLoggedIn', () => {
      const selected = selector(getState());
      expect(selected.isLoggedIn).toBeDefined();
    });

    describe('userName', () => {
      test('returns an empty string if user is not logged in', () => {
        const selected = selector(getState());
        expect(selected.userName).toBe('');
      });

      test('returns user firstName + lastName', () => {
        const user = { firstName: 'Luke', lastName: 'Skywalker' };
        const selected = selector(getState(null, user));
        expect(selected.userName).toBe('Luke Skywalker');
      });

      test('returns user email if no firstName or lastName', () => {
        const user = { email: 'luke@skywalker.com' };
        const selected = selector(getState(null, user));
        expect(selected.userName).toBe('luke@skywalker.com');
      });

      test(
        'returns user email from emails array if no firstName or lastName',
        () => {
          const user = { emails: [{ value: 'luke@skywalker.com' }] };
          const selected = selector(getState(null, user));
          expect(selected.userName).toBe('luke@skywalker.com');
        }
      );
    });
  });
});
