import { getState } from 'utils/testUtils';
import manageReservationsPageSelector from '../manageReservationsPageSelector';

jest.mock('state/selectors/dataSelectors', () => {
  const originalModule = jest.requireActual('state/selectors/dataSelectors');
  return {
    __esModule: true,
    ...originalModule,
    userFavouriteResourcesSelector: jest.fn(() => ['test123']),
  };
});

describe('/pages/manage-reservations/manageReservationsPageSelector', () => {
  function getSelector() {
    const state = getState();
    return manageReservationsPageSelector(state);
  }

  test('returns isAdmin', () => {
    expect(getSelector().isAdmin).toBeDefined();
  });

  test('returns userFavoriteResources', () => {
    expect(getSelector().userFavoriteResources).toBeDefined();
  });

  test('returns locale', () => {
    expect(getSelector().locale).toBeDefined();
  });

  test('returns isFetchingUnits', () => {
    expect(getSelector().isFetchingUnits).toBeDefined();
  });

  test('returns isFetchingReservations', () => {
    expect(getSelector().isFetchingReservations).toBeDefined();
  });

  test('returns units', () => {
    expect(getSelector().units).toBeDefined();
  });

  test('returns reservations', () => {
    expect(getSelector().reservations).toBeDefined();
  });

  test('returns reservationsTotalCount', () => {
    expect(getSelector().reservationsTotalCount).toBeDefined();
  });

  test('returns resources', () => {
    expect(getSelector().resources).toBeDefined();
  });

  test('returns isFetchingResource', () => {
    expect(getSelector().isFetchingResource).toBeDefined();
  });

  test('returns fontSize', () => {
    expect(getSelector().fontSize).toBeDefined();
  });
});
