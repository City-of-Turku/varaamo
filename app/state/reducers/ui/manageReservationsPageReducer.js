import types from 'constants/ActionTypes';

import Immutable from 'seamless-immutable';

/**
 * Updates reservation results array with given reservation. Keeps previous
 * reservation.resource details which would be otherwise lost in updates.
 * When updating a deleted/cancelled reservation, new reservation state
 * must be given because delete api calls don't return updated state info.
 * @param {object} reservation which is to be updated in the results
 * @param {array} oldResults reservations
 * @param {string|undefined} reservationState desired state for updated reservation e.g. 'cancelled'
 * @returns {array} reservation list with updated given reservation and its state
 */
export function updateResults(reservation, oldResults, reservationState) {
  const results = [...oldResults];
  const modifiedIndex = results.findIndex((result => result.id === reservation.id));

  // return results as is if modified reservation was not found
  if (modifiedIndex === -1) {
    return results;
  }

  const resource = results[modifiedIndex].resource;

  const updatedReservation = {
    ...results[modifiedIndex],
    ...reservation,
    state: reservationState || reservation.state,
    resource
  };
  results[modifiedIndex] = updatedReservation;
  return results;
}

const initialState = Immutable({
  results: [],
});

function manageReservationsPageReducer(state = initialState, action) {
  switch (action.type) {
    case types.API.RESERVATIONS_GET_SUCCESS: {
      const results = Object.values(action.payload.entities.reservations || {});
      return state.merge({
        results,
      });
    }
    case types.API.RESERVATION_PUT_SUCCESS: {
      const reservation = action.payload;
      const results = updateResults(reservation, state.results);
      return state.merge({ results });
    }
    case types.API.RESERVATION_DELETE_SUCCESS: {
      const reservation = action.payload;
      const results = updateResults(reservation, state.results, 'cancelled');
      return state.merge({ results });
    }

    default: {
      return state;
    }
  }
}

export default manageReservationsPageReducer;
