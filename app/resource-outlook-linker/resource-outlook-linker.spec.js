import reducer from './reducer';
import {
  actionTypes
} from './actions';

function randomString() {
  return Math.random()
    .toString(36)
    .substring(7)
    .split('')
    .join('.');
}

function unknownAction() {
  return {
    type: `@@redux/UNKNOWN-ACTION${randomString()}`,
  };
}

describe('Reducer', () => {
  it('should return initial state when state is undefined', () => {
    // Act
    const initialState = reducer(undefined, unknownAction());
    // Assert
    expect(typeof initialState).toBe('object');
  });

  it('should return current state when action is unknown', () => {
    // Arrange
    const currentState = {};
    // Act
    const initialState = reducer(currentState, unknownAction());
    // Assert
    expect(initialState).toBe(currentState);
  });
});

describe('Successful request to calendar link creation', () => {
  const { location } = window;

  beforeAll(() => {
    delete window.location;
    window.location = {
      href: '',
    };
  });

  afterAll(() => {
    window.location = location;
  });

  it('should redirect to returned redirect address', () => {
    // Arrange
    const initialState = reducer({}, unknownAction());
    const redirectLocation = `http://expected.rerdirect.address/${randomString()}`;
    // Act
    reducer(initialState, {
      type: actionTypes.RESOURCE_OUTLOOK_CALENDAR_LINK_CREATE_SUCCESS,
      payload: {
        redirect_link: redirectLocation,
      }
    });
    // Assert
    expect(window.location).toBe(redirectLocation);
  });
});

describe('Successful request to calendar link list', () => {
  it('should return state where resource id as the key', () => {
    // Arrange
    const initialState = reducer({}, unknownAction());
    const link1 = {
      id: 'l1',
      resource: 'r1',
    };
    const link2 = {
      id: 'l2',
      resource: 'r2',
    };
    // Act
    const finalState = reducer(initialState, {
      type: actionTypes.RESOURCE_OUTLOOK_CALENDAR_LINKS_GET_SUCCESS,
      payload: { results: [link1, link2] },
    });
    // Assert
    expect(finalState).toEqual({
      r1: link1,
      r2: link2,
    });
  });
});

describe('Successful link remove request', () => {
  // Creates state containing given links using the reducer,
  // that way test does not know how states are manipulated inside reducer.
  function stateWithLinks(...links) {
    const initialState = reducer({}, unknownAction());
    const state = reducer(initialState, {
      type: actionTypes.RESOURCE_OUTLOOK_CALENDAR_LINKS_GET_SUCCESS,
      payload: { results: links },
    });
    return state;
  }

  it('should remove link from the state', () => {
    // Arrange
    const link1 = {
      id: 'l1',
      resource: 'r1',
    };
    const link2 = {
      id: 'l2',
      resource: 'r2',
    };
    const initialState = stateWithLinks(link1, link2);
    // Act
    const finalState = reducer(initialState, {
      type: actionTypes.RESOURCE_OUTLOOK_CALENDAR_LINK_DELETE_SUCCESS,
      meta: { resourceId: 'r1' },
    });
    // Assert
    expect(finalState).toEqual({
      r2: link2,
    });
  });
});
