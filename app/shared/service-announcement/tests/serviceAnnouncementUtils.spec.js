import { buildAPIUrl, getHeadersCreator } from '../../../utils/apiUtils';
import { fetchAnnouncement } from '../serviceAnnouncementUtils';

describe('serviceAnnouncementUtils', () => {
  describe('fetchAnnouncement', () => {
    const testResult = { results: [{ message: { fi: 'testi', en: 'test', sv: 'test' } }] };
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(testResult),
    }));

    afterAll(() => {
      fetch.mockClear();
    });

    test('calls fetch with correct params', async () => {
      const request = { method: 'GET', headers: getHeadersCreator() };
      const result = await fetchAnnouncement();
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch.mock.calls[0][0]).toBe(buildAPIUrl('announcements'));
      expect(JSON.stringify(fetch.mock.calls[0][1])).toBe(JSON.stringify(request));
      expect(result).toBe(testResult);
    });
  });
});
