import types from 'constants/ActionTypes';

import Immutable from 'seamless-immutable';

import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import reducer, { updateResults } from './manageReservationsPageReducer';

describe('/state/reducers/ui/manageReservationsPageReducer', () => {
  const initialState = Immutable({
    results: []
  });

  const reservationA = Immutable(Reservation.build({ resource: Resource.build(), id: 'id-a' }));
  const reservationB = Immutable(Reservation.build({ resource: Resource.build(), id: 'id-b' }));
  const reservationC = Immutable(Reservation.build({ resource: Resource.build(), id: 'id-c' }));

  const action = {
    type: types.API.RESERVATIONS_GET_SUCCESS,
    payload: {
      entities: {
        reservations: [
          reservationA,
          reservationB,
          reservationC,
        ]
      }
    }
  };

  const expectedState = {
    results: [
      action.payload.entities.reservations[0],
      action.payload.entities.reservations[1],
      action.payload.entities.reservations[2],
    ]
  };

  test('initialState is correct', () => {
    const state = reducer(undefined, { type: 'nothing' });
    expect(state).toEqual(initialState);
  });

  test('sets correct state when action type and values are set', () => {
    const state = reducer(undefined, action);
    expect(state).toEqual(expectedState);
  });

  test('returns previous state when case for given type is not defined', () => {
    const state = reducer(expectedState, { type: 'thisIsWrong' });
    expect(state).toEqual(expectedState);
  });

  describe('util functions', () => {
    describe('updateResults', () => {
      test('returns correct results when state is not given', () => {
        const reservation = { ...reservationB, comments: 'test comment' };
        const oldResults = [reservationA, reservationB, reservationC];
        const expectedResults = [reservationA, reservation, reservationC];
        expect(updateResults(reservation, oldResults)).toStrictEqual(expectedResults);
      });

      test('returns correct results when state is given', () => {
        const reservation = { ...reservationB, comments: 'test comment' };
        const oldResults = [reservationA, reservationB, reservationC];
        const reservationState = 'cancelled';

        const expectedResults = [
          reservationA,
          { ...reservation, state: reservationState },
          reservationC
        ];
        expect(updateResults(
          reservation, oldResults, reservationState
        )).toStrictEqual(expectedResults);
      });
    });
  });
});
