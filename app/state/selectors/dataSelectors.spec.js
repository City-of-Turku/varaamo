import { getState } from 'utils/testUtils';
import Resource from '../../utils/fixtures/Resource';
import {
  createResourceSelector,
  purposesSelector,
  reservationsSelector,
  resourcesSelector,
  unitsSelector,
  createStrongAuthSatisfiedSelector,
} from './dataSelectors';
import { isStrongAuthSatisfied } from 'utils/resourceUtils';

jest.mock('utils/resourceUtils', () => {
  const originalModule = jest.requireActual('utils/resourceUtils');
  return {
    __esModule: true,
    ...originalModule,
    isStrongAuthSatisfied: jest.fn(),
  };
});

describe('state/selectors/dataSelectors', () => {
  describe('purposesSelector', () => {
    test('returns purposes translated in current language from the state', () => {
      const locale = 'en';
      const state = getState({
        'data.purposes': {
          1: { id: 1, name: { en: 'Meetings' } },
          2: { id: 2, name: { en: 'Gaming' } },
        },
        intl: { locale },
      });
      const expected = {
        1: { id: 1, name: 'Meetings' },
        2: { id: 2, name: 'Gaming' },
      };
      const selected = purposesSelector(state);
      expect(selected).toEqual(expected);
    });
  });

  describe('reservationsSelector', () => {
    test('returns reservations from the state', () => {
      const locale = 'en';
      const state = getState({
        'data.reservations': {
          1: { id: 1, foo: 'bar' },
          2: { id: 2, foo: 'bar' },
        },
        intl: { locale },
      });
      const expected = {
        1: { id: 1, foo: 'bar' },
        2: { id: 2, foo: 'bar' },
      };
      const selected = reservationsSelector(state);
      expect(selected).toEqual(expected);
    });
  });

  describe('resourcesSelector', () => {
    test('returns resources translated in current language from the state', () => {
      const locale = 'en';
      const state = getState({
        'data.resources': {
          1: { id: 1, name: { en: 'Meetings' } },
          2: { id: 2, name: { en: 'Gaming' } },
        },
        intl: { locale },
      });
      const expected = {
        1: { id: 1, name: 'Meetings' },
        2: { id: 2, name: 'Gaming' },
      };
      const selected = resourcesSelector(state);
      expect(selected).toEqual(expected);
    });
  });

  describe('unitsSelector', () => {
    test('returns units translated in current language from the state', () => {
      const locale = 'en';
      const state = getState({
        'data.units': {
          1: { id: 1, name: { en: 'Meetings' } },
          2: { id: 2, name: { en: 'Gaming' } },
        },
        intl: { locale },
      });
      const expected = {
        1: { id: 1, name: 'Meetings' },
        2: { id: 2, name: 'Gaming' },
      };
      const selected = unitsSelector(state);
      expect(selected).toEqual(expected);
    });
  });

  describe('createResourceSelector', () => {
    test('returns the resource specified by the given id selector', () => {
      const resource = { id: 'r-1' };
      const idSelector = () => resource.id;
      const state = getState({
        'data.resources': { [resource.id]: resource },
      });
      const selected = createResourceSelector(idSelector)(state);
      expect(selected).toEqual(resource);
    });

    test('returns an empty object if resource does not exist', () => {
      const idSelector = () => 'r-999';
      const state = getState();
      const selected = createResourceSelector(idSelector)(state);
      expect(selected).toEqual({});
    });
  });

  describe('createStrongAuthSatisfiedSelector', () => {
    beforeEach(() => { isStrongAuthSatisfied.mockClear(); });
    afterEach(() => { isStrongAuthSatisfied.mockClear(); });

    test('calls isStrongAuthSatisfied with correct params', () => {
      const user = { id: 'u-1', isStrongAuth: true };
      const state = getState({
        auth: {
          user: {
            profile: {
              sub: user.id
            },
          },
        },
        data: {
          users: { [user.id]: user },
        },
      });
      const resource = Resource.build({ authentication: 'strong' });
      const resourceSelector = () => resource;
      createStrongAuthSatisfiedSelector(resourceSelector)(state);
      expect(isStrongAuthSatisfied.mock.calls.length).toBe(1);
      expect(isStrongAuthSatisfied.mock.calls[0][0]).toBe(resource);
      expect(isStrongAuthSatisfied.mock.calls[0][1]).toBe(true);
    });
  });
});
