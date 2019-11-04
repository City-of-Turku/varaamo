import { getState } from 'utils/testUtils';
import favoritesPageSelector from './favoritesPageSelector';

describe('/pages/favorites/favoritesPageSelector', () => {
  function getSelector(extraState) {
    const state = getState(extraState);
    return favoritesPageSelector(state);
  }

  test('returns date', () => {
    expect(getSelector().date).toBeDefined();
  });

  test('returns isLoggedIn', () => {
    expect(getSelector().isLoggedIn).toBeDefined();
  });

  test('returns isFetchingResources', () => {
    expect(getSelector().isFetchingResources).toBeDefined();
  });

  test('returns resources', () => {
    expect(getSelector().resources).toBeDefined();
  });

  test('returns resourcesLoaded', () => {
    expect(getSelector().resourcesLoaded).toBeDefined();
  });

  test('returns fontSize', () => {
    expect(getSelector().fontSize).toBeDefined();
  });

  test('returns isLargerFontSize', () => {
    expect(getSelector().isLargerFontSize).toBeDefined();
  });
});
