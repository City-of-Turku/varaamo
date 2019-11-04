import userManager from 'utils/userManager';

describe('Utils: userManager', () => {
  test('returns userManager object', () => {
    expect(typeof (userManager)).toBe('object');
  });
});
