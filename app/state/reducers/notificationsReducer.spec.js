
import Immutable from 'seamless-immutable';
import { createAction } from 'redux-actions';

import types from 'constants/ActionTypes';
import constants from 'constants/AppConstants';
import notificationsReducer from './notificationsReducer';

describe('state/reducers/notificationReducer', () => {
  describe('initial state', () => {
    const initialState = notificationsReducer(undefined, {});

    test('notifications is an empty array', () => {
      expect(initialState).toEqual([]);
    });
  });

  describe('handling actions', () => {
    describe('UI.ADD_NOTIFICATION', () => {
      const addNotification = createAction(types.UI.ADD_NOTIFICATION);

      const mockNotification = {
        message: 'successMessage',
        type: 'success',
        timeOut: 5000
      };

      const initialState = Immutable([]);
      const action = addNotification(mockNotification);
      const actualNotifications = notificationsReducer(initialState, action);

      test('add new notification object to state array', () => {
        expect(actualNotifications[0]).toMatchObject(mockNotification);
      });

      test('will contain hidden property false by default', () => {
        expect(actualNotifications[0].hidden).toBeFalsy();
      });

      test('will have default id as 1 if there is only no other noti', () => {
        expect(actualNotifications[0].id).toEqual(1);
      });

      test('have increased id number', () => {
        const nextAction = addNotification(mockNotification);
        const nextState = notificationsReducer(actualNotifications, nextAction);

        expect(nextState[0].id).toEqual(1);

        expect(nextState[1].id).toEqual(2);
      });

      test('will fill object with default data', () => {
        const nextAction = addNotification({});
        const nextState = notificationsReducer(actualNotifications, nextAction);

        expect(nextState[1]).toMatchObject(constants.NOTIFICATION_DEFAULTS);
        expect(nextState[1].id).toEqual(2);
      });
    });

    describe('UI.HIDE_NOTIFICATION', () => {
      const hideNotification = createAction(types.UI.HIDE_NOTIFICATION);

      const initialState = Immutable([{
        message: 'foo',
        id: 1,
        hidden: false
      }]);

      test('hide current notification', () => {
        const action = hideNotification({
          id: initialState[0].id
        });

        const actualNotifications = notificationsReducer(initialState, action);

        expect(actualNotifications[0].hidden).toBeTruthy();
      });

      test('will not delete current notification', () => {
        const action = hideNotification({
          id: initialState[0].id
        });

        const actualNotifications = notificationsReducer(initialState, action);

        expect(actualNotifications[0].message).toEqual(initialState[0].message);
      });

      test('will not do anything if id was provided wrong', () => {
        const action = hideNotification({
          id: 'foo'
        });

        const actualNotifications = notificationsReducer(initialState, action);

        expect(actualNotifications[0].message).toEqual(initialState[0].message);
        expect(actualNotifications[0].hidden).toEqual(initialState[0].hidden);
      });
    });

    describe('API.RESERVATION_DELETE_SUCCESS', () => {
      const addNotification = createAction(types.API.RESERVATION_DELETE_SUCCESS);

      const mockNotification = {
        messageId: 'Notifications.reservationDeleteSuccessMessage',
        type: 'success',
        timeOut: 5000
      };

      const initialState = Immutable([]);
      const action = addNotification(mockNotification);
      const actualNotifications = notificationsReducer(initialState, action);

      test('add new notification object to state array', () => {
        expect(actualNotifications[0]).toMatchObject(mockNotification);
      });
    });

    describe('API.RESERVATION_PUT_SUCCESS', () => {
      const addNotification = createAction(types.API.RESERVATION_PUT_SUCCESS);

      const mockNotification = {
        messageId: 'Notifications.reservationUpdateSuccessMessage',
        type: 'success',
        timeOut: 5000
      };

      const initialState = Immutable([]);
      const action = addNotification(mockNotification);

      test('add new notification object to state array', () => {
        const actualNotifications = notificationsReducer(initialState, action);
        expect(actualNotifications[0]).toMatchObject(mockNotification);
      });

      test('notification is omitted when meta.omitNotification is true', () => {
        const notificationAction = createAction(
          types.API.RESERVATION_PUT_SUCCESS,
          payload => payload,
          () => ({ omitNotification: true })
        );
        const actualNotifications = notificationsReducer(initialState, notificationAction);
        expect(actualNotifications).toStrictEqual([]);
      });
    });

    describe('error handlers', () => {
      const errorAction = createAction(types.API.RESERVATION_DELETE_ERROR);
      const initialState = Immutable([]);

      const defaults = {
        messageId: 'Notifications.errorMessage',
        type: 'error',
        timeOut: 10000,
      };

      test('will return default error message if no status', () => {
        const action = errorAction({
          message: 'System error'
        });

        const actualNotifications = notificationsReducer(initialState, action);
        expect(actualNotifications[0]).toMatchObject(defaults);
      });

      test('show login message when status is 401', () => {
        const action = errorAction({
          message: 'System error',
          status: 401
        });

        const actualNotifications = notificationsReducer(initialState, action);
        expect(actualNotifications[0].messageId).toEqual('Notifications.loginMessage');
      });

      test('show non field error when non_field_errors is specified and there is at least one error', () => {
        const nonFieldErrors = ['error_1', 'error_2', 'error_3'];
        const expected = nonFieldErrors.join('. ');
        const action = errorAction({
          response: {
            non_field_errors: nonFieldErrors,
          },
        });

        const actualNotifications = notificationsReducer(initialState, action);
        expect(actualNotifications[0].message).toEqual(expected);
      });

      test('show recurring reservation error when recurring_validation_error is specified', () => {
        const action = errorAction({
          response: {
            recurring_validation_error: 'some recurring error'
          },
        });

        const actualNotifications = notificationsReducer(initialState, action);
        expect(actualNotifications[0].message).toEqual('some recurring error');
      });

      test('show period error when period is specified', () => {
        const action = errorAction({
          response: {
            period: 'some period error'
          },
        });

        const actualNotifications = notificationsReducer(initialState, action);
        expect(actualNotifications[0].messageId).toEqual('Notifications.error.period');
      });

      test('show detail message when response is specified', () => {
        const action = errorAction({
          response: {
            detail: 'System error'
          },
          status: 500,
        });

        const actualNotifications = notificationsReducer(initialState, action);
        expect(actualNotifications[0].message).toEqual('System error');
      });

      test('show correct error when user get error occurs', () => {
        const userGetErrorAction = createAction(types.API.USER_GET_ERROR);
        const action = userGetErrorAction();
        const expectedNotification = {
          messageId: 'Notifications.userFetchErrorMessage',
          type: 'error',
          timeOut: 30000,
        };
        const actualNotifications = notificationsReducer(initialState, action);
        expect(actualNotifications[0]).toMatchObject(expectedNotification);
      });
    });
  });
});
