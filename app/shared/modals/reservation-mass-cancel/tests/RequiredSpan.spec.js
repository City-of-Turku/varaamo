import React from 'react';
import { shallow } from 'enzyme';

import RequiredSpan from '../RequiredSpan';

describe('RequiredSpan', () => {
  function getWrapper() {
    return shallow(<RequiredSpan />);
  }

  test('renders correctly', () => {
    const span = getWrapper();
    expect(span.length).toBe(1);
    expect(span.prop('aria-hidden')).toBe('true');
    expect(span.text()).toBe('*');
  });
});
