import { buildAPIUrl, getHeadersCreator } from '../../utils/apiUtils';

/**
 * Makes a GET request to retrieve announcements
 * @returns {object} response announcement data
 */
async function fetchAnnouncement() {
  const apiUrl = buildAPIUrl('announcements');

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: getHeadersCreator(),
  });
  if (!response.ok) {
    throw new Error('announcement_fetch_error');
  }
  const data = await response.json();
  return data;
}

export {
  fetchAnnouncement
};
