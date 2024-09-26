import { getAboutContent } from './aboutContent';
import getAboutContentEn from './aboutEn';
import getAboutContentFi from './aboutFi';
import getAboutContentSv from './aboutSv';

describe('aboutContent', () => {
  describe('getAboutContent', () => {
    const testUrl = 'https://example.com';
    test('should return the correct content for the given language', () => {
      const contentEn = getAboutContent('en', testUrl);
      expect(contentEn).toContain(testUrl);
      expect(contentEn).toBe(getAboutContentEn(testUrl));

      const contentSv = getAboutContent('sv', testUrl);
      expect(contentSv).toContain(testUrl);
      expect(contentSv).toBe(getAboutContentSv(testUrl));

      const contentFi = getAboutContent('fi', testUrl);
      expect(contentFi).toContain(testUrl);
      expect(contentFi).toBe(getAboutContentFi(testUrl));

      const contentRandom = getAboutContent('foo', testUrl);
      expect(contentRandom).toContain(testUrl);
      expect(contentRandom).toBe(getAboutContentFi(testUrl));
    });
  });
});
