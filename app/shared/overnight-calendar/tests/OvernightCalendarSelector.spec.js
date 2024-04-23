import { getState } from 'utils/testUtils';
import OvernightCalendarSelector from '../OvernightCalendarSelector';

describe('app/shared/overnight-calendar/OvernightCalendarSelector', () => {
  function getProps(id = 'some-id') {
    return {
      location: {
        search: 'date=2015-10-10',
      },
      params: {
        id,
      },
    };
  }

  function getSelected(extraState) {
    const state = getState(extraState);
    const props = getProps();
    return OvernightCalendarSelector(state, props);
  }

  test('returns selected', () => {
    expect(getSelected().selected).toBeDefined();
  });

  test('returns isMaintenanceModeOn', () => {
    expect(getSelected().isMaintenanceModeOn).toBeDefined();
  });

  test('returns isStrongAuthSatisfied', () => {
    expect(getSelected().isStrongAuthSatisfied).toBeDefined();
  });

  test('returns currentLanguage', () => {
    expect(getSelected().currentLanguage).toBeDefined();
  });

  test('returns isStaff', () => {
    expect(getSelected().isStaff).toBeDefined();
  });

  test('returns isSuperUserSelector', () => {
    expect(getSelected().isSuperuser).toBeDefined();
  });
});
