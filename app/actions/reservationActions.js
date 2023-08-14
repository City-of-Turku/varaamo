
import pickBy from 'lodash/pickBy';
import mapValues from 'lodash/mapValues';
import { decamelizeKeys } from 'humps';
import { RSAA } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import schemas from 'store/middleware/Schemas';
import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
} from 'utils/apiUtils';
import { getMissingValues, isStaffEvent } from 'utils/reservationUtils';

function commentReservation(reservation, resource, comments) {
  const missingValues = getMissingValues(reservation);
  const staffEvent = isStaffEvent(reservation, resource);
  return putReservation(Object.assign(
    {},
    reservation,
    missingValues,
    { comments },
    { staffEvent }
  ));
}

function confirmPreliminaryReservation(reservation) {
  return putReservation(Object.assign({}, reservation, { state: 'confirmed' }));
}

function deleteReservation(reservation) {
  return {
    [RSAA]: {
      types: [
        getRequestTypeDescriptor(
          types.API.RESERVATION_DELETE_REQUEST,
          {
            countable: true,
            meta: { track: getTrackingInfo('cancel', reservation.resource) },
          }
        ),
        getSuccessTypeDescriptor(
          types.API.RESERVATION_DELETE_SUCCESS,
          {
            countable: true,
            payload: () => reservation,
          }
        ),
        getErrorTypeDescriptor(
          types.API.RESERVATION_DELETE_ERROR,
          { countable: true }
        ),
      ],
      endpoint: reservation.url,
      method: 'DELETE',
      headers: getHeadersCreator(),
    },
  };
}

function denyPreliminaryReservation(reservation) {
  return putReservation(Object.assign({}, reservation, { state: 'denied' }));
}

function fetchReservations(params = {}) {
  const fetchParams = Object.assign({}, { pageSize: 100 }, params);

  return {
    [RSAA]: {
      types: [
        getRequestTypeDescriptor(types.API.RESERVATIONS_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.API.RESERVATIONS_GET_SUCCESS,
          { schema: schemas.paginatedReservationsSchema }
        ),
        getErrorTypeDescriptor(types.API.RESERVATIONS_GET_ERROR),
      ],
      endpoint: buildAPIUrl('reservation', fetchParams),
      method: 'GET',
      headers: getHeadersCreator(),
    },
  };
}

/**
 * Trims, parses and returns given reservation values in JSON form.
 * @param {Object} reservation reservation values
 * @returns reservation values in JSON form
 */
function parseReservationData(reservation) {
  const trimmedValues = mapValues(reservation, (value) => {
    if (typeof (value) === 'string') {
      return value.trim();
    }
    return value;
  });

  const parsed = pickBy(trimmedValues, value => value || value === 0 || typeof (value) === 'boolean');
  return JSON.stringify(decamelizeKeys(parsed));
}


function postRecurringReservations(reservations) {
  const url = buildAPIUrl('reservation_bulk');

  return {
    [RSAA]: {
      types: [
        getRequestTypeDescriptor(
          types.API.RESERVATION_POST_REQUEST,
          {
            countable: true,
            meta: { track: getTrackingInfo('add', reservations.resource) },
          }
        ),
        getSuccessTypeDescriptor(
          types.API.RESERVATION_POST_SUCCESS,
          { countable: true }
        ),
        getErrorTypeDescriptor(
          types.API.RESERVATION_POST_ERROR,
          { countable: true, meta: { reservations } }
        ),
      ],
      endpoint: url,
      method: 'POST',
      headers: getHeadersCreator(),
      body: parseReservationData(reservations),
    },
  };
}


function postReservation(reservation) {
  const url = buildAPIUrl('reservation');

  return {
    [RSAA]: {
      types: [
        getRequestTypeDescriptor(
          types.API.RESERVATION_POST_REQUEST,
          {
            countable: true,
            meta: { track: getTrackingInfo('add', reservation.resource) },
          }
        ),
        getSuccessTypeDescriptor(
          types.API.RESERVATION_POST_SUCCESS,
          { countable: true }
        ),
        getErrorTypeDescriptor(
          types.API.RESERVATION_POST_ERROR,
          { countable: true, meta: { reservation } }
        ),
      ],
      endpoint: url,
      method: 'POST',
      headers: getHeadersCreator(),
      body: parseReservationData(reservation),
    },
  };
}

function putReservation(reservation, omitSuccessNotification = false) {
  return {
    [RSAA]: {
      types: [
        getRequestTypeDescriptor(
          types.API.RESERVATION_PUT_REQUEST,
          {
            countable: true,
            meta: { track: getTrackingInfo('edit', reservation.resource) },
          }
        ),
        getSuccessTypeDescriptor(
          types.API.RESERVATION_PUT_SUCCESS,
          {
            countable: true,
            meta: { omitNotification: omitSuccessNotification }
          }
        ),
        getErrorTypeDescriptor(
          types.API.RESERVATION_PUT_ERROR,
          { countable: true }
        ),
      ],
      endpoint: reservation.url,
      method: 'PUT',
      headers: getHeadersCreator(),
      body: parseReservationData(reservation),
    },
  };
}

function getTrackingInfo(type, resource) {
  return ({
    event: 'trackEvent',
    args: [
      'Reservation',
      `reservation-${type}`,
      resource,
    ],
  });
}

export {
  commentReservation,
  confirmPreliminaryReservation,
  deleteReservation,
  denyPreliminaryReservation,
  fetchReservations,
  postReservation,
  postRecurringReservations,
  putReservation,
};
