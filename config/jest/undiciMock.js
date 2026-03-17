/**
 * Mock for undici (used by cheerio for fetch).
 * Jest cannot resolve undici's node: built-ins; enzyme tests don't need real fetch.
 */
module.exports = {
  fetch: () => Promise.reject(new Error('fetch not available in tests')),
};
