import { RSAA } from 'redux-api-middleware';

import {
  buildAPIUrl,
  getHeadersCreator
} from 'utils/apiUtils';

const actionTypes = {
  RESOURCE_OUTLOOK_CALENDAR_LINKS_GET_REQUEST: 'RESOURCE_OUTLOOK_CALENDAR_LINKS_GET_REQUEST',
  RESOURCE_OUTLOOK_CALENDAR_LINKS_GET_SUCCESS: 'RESOURCE_OUTLOOK_CALENDAR_LINKS_GET_SUCCESS',
  RESOURCE_OUTLOOK_CALENDAR_LINKS_GET_ERROR: 'RESOURCE_OUTLOOK_CALENDAR_LINKS_GET_ERROR',
  RESOURCE_OUTLOOK_CALENDAR_LINK_CREATE_REQUEST: 'RESOURCE_OUTLOOK_CALENDAR_LINK_CREATE_REQUEST',
  RESOURCE_OUTLOOK_CALENDAR_LINK_CREATE_SUCCESS: 'RESOURCE_OUTLOOK_CALENDAR_LINK_CREATE_SUCCESS',
  RESOURCE_OUTLOOK_CALENDAR_LINK_CREATE_ERROR: 'RESOURCE_OUTLOOK_CALENDAR_LINK_CREATE_ERROR',
  RESOURCE_OUTLOOK_CALENDAR_LINK_DELETE_REQUEST: 'RESOURCE_OUTLOOK_CALENDAR_LINK_DELETE_REQUEST',
  RESOURCE_OUTLOOK_CALENDAR_LINK_DELETE_SUCCESS: 'RESOURCE_OUTLOOK_CALENDAR_LINK_DELETE_SUCCESS',
  RESOURCE_OUTLOOK_CALENDAR_LINK_DELETE_ERROR: 'RESOURCE_OUTLOOK_CALENDAR_LINK_DELETE_ERROR',
};

function isString(obj) {
  return (Object.prototype.toString.call(obj) === '[object String]');
}

function isInteger(n) {
  return Number.isInteger(n);
}


function fetchResourceOutlookCalendarLinks(resourceId) {
  if (!isString(resourceId)) {
    throw new TypeError(`Expected string for resourceId but got something else. (Value was ${resourceId}).`);
  }

  return {
    [RSAA]: {
      types: [
        actionTypes.RESOURCE_OUTLOOK_CALENDAR_LINKS_GET_REQUEST,
        actionTypes.RESOURCE_OUTLOOK_CALENDAR_LINKS_GET_SUCCESS,
        actionTypes.RESOURCE_OUTLOOK_CALENDAR_LINKS_GET_ERROR,
      ],
      endpoint: buildAPIUrl('o365/calendar_links', { resourceId, isOwn: true }),
      method: 'GET',
      headers: getHeadersCreator(),
    }
  };
}

function createResourceOutlookCalendarLink(resourceId) {
  if (!isString(resourceId)) {
    throw new TypeError(`Expected string for resourceId but got something else. (Value was ${resourceId}).`);
  }

  return {
    [RSAA]: {
      types: [
        {
          type: actionTypes.RESOURCE_OUTLOOK_CALENDAR_LINK_CREATE_REQUEST,
          meta: { resourceId },
        },
        {
          type: actionTypes.RESOURCE_OUTLOOK_CALENDAR_LINK_CREATE_SUCCESS,
          meta: { resourceId },
        },
        {
          type: actionTypes.RESOURCE_OUTLOOK_CALENDAR_LINK_CREATE_ERROR,
          meta: { resourceId },
        },
      ],
      endpoint: buildAPIUrl('o365/start_connect_resource_to_calendar', { resourceId, return_to: location.href }),
      method: 'GET',
      headers: getHeadersCreator(),
    }
  };
}

function removeResourceOutlookCalendarLink(resourceId, linkId) {
  if (!isString(resourceId)) {
    throw new TypeError(`Expected string for resourceId but got something else. (Value was ${resourceId}).`);
  }
  if (!isInteger(linkId)) {
    throw new TypeError(`Expected string for linkId but got something else. (Value was ${linkId}).`);
  }

  return {
    [RSAA]: {
      types: [
        {
          type: actionTypes.RESOURCE_OUTLOOK_CALENDAR_LINK_DELETE_REQUEST,
          meta: { resourceId },
        },
        {
          type: actionTypes.RESOURCE_OUTLOOK_CALENDAR_LINK_DELETE_SUCCESS,
          meta: { resourceId },
        },
        {
          type: actionTypes.RESOURCE_OUTLOOK_CALENDAR_LINK_DELETE_ERROR,
          meta: { resourceId },
        },
      ],
      endpoint: buildAPIUrl(`o365/calendar_links/${linkId}`),
      method: 'DELETE',
      headers: getHeadersCreator(),
    }
  };
}

export {
  fetchResourceOutlookCalendarLinks,
  createResourceOutlookCalendarLink,
  removeResourceOutlookCalendarLink,
  actionTypes,
};
