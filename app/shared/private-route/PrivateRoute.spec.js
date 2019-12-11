import React from 'react';
import simple from 'simple-mock';
import * as redux from 'redux';
import { shallow } from 'enzyme';
import { Route } from 'react-router-dom';

import * as routeActions from 'actions/routeActions';
import {
  UnconnectedPrivateRoute as PrivateRoute,
  mapStateToProps,
  mapDispatchToProps,
} from './PrivateRoute';
import userManager from 'utils/userManager';
import SignInRedirectRoute from './sign-in-redirect/SignInRedirectRoute';

describe('shared/private-route/PrivateRoute', () => {
  describe('UnconnectedPrivateRoute', () => {
    const component = () => <div>private route</div>;

    const updateRoute = simple.mock();
    const scrollToMock = simple.mock();
    const redirectMock = simple.mock();

    beforeEach(() => {
      updateRoute.reset();
      scrollToMock.reset();
      redirectMock.reset();
      simple.mock(window, 'scrollTo', scrollToMock);
      simple.mock(userManager, 'signinRedirect', redirectMock);
    });

    const getWrapper = (componentName, userId, isLoadingUser = false) => {
      const props = {
        actions: { updateRoute },
        location: {},
        componentName,
        component,
        isLoadingUser,
        userId,
      };
      return shallow(<PrivateRoute {...props} />);
    };

    test('renders Route from react-router-dom if isLoadingUser is false', () => {
      const wrapper = getWrapper('AdminPage', '1234', false);

      expect(wrapper.is(Route)).toBe(true);
    });

    test('does not render Route from react-router-dom if isLoadingUser is true', () => {
      const wrapper = getWrapper('AdminPage', '1234', true);

      expect(wrapper.is(Route)).toBe(false);
    });

    test('calls updateRoute when the component did mount', () => {
      const wrapper = getWrapper('AdminPage', '1234');
      wrapper.instance().componentDidMount();

      expect(updateRoute.callCount).toBe(1);
    });

    test('calls scrollTo when the component did update', () => {
      const wrapper = getWrapper('AdminPage', '1234');
      wrapper.instance().componentDidMount();

      expect(scrollToMock.callCount).toBe(1);
    });

    test('calls updateRoute when the component did update', () => {
      const wrapper = getWrapper('AdminPage', '1234');
      wrapper.instance().componentDidUpdate();

      expect(updateRoute.callCount).toBe(1);
    });

    describe('renderOrRedirect', () => {
      test('returns props.component if user is defined', () => {
        const instance = getWrapper('AdminPage', '1234', false).instance();
        expect(instance.renderOrRedirect()).toStrictEqual(<instance.props.component />);
      });

      test('returns SignInRedirectRoute if user is not defined', () => {
        const instance = getWrapper('AdminPage', null, false).instance();
        expect(instance.renderOrRedirect()).toStrictEqual(<SignInRedirectRoute />);
      });
    });
  });

  describe('mapStateToProps', () => {
    test('returns an object with userId property', () => {
      const auth = { user: null };
      expect(mapStateToProps({ auth })).toHaveProperty('userId');
    });
    test('returns an object with userId property', () => {
      const auth = { user: null };
      expect(mapStateToProps({ auth })).toHaveProperty('isLoadingUser');
    });
  });

  describe('mapDispatchToProps', () => {
    beforeEach(() => {
      simple.mock(redux, 'bindActionCreators');
      simple.mock(routeActions, 'updateRoute').returnWith(() => { });
    });

    afterEach(() => {
      simple.restore();
    });

    const dispatch = () => {};
    const ownProps = { componentName: 'adminPage' };

    test('returns an object with actions property', () => {
      expect(mapDispatchToProps(dispatch, ownProps)).toHaveProperty('actions');
    });

    test('calls updateRoute with componentName prop', () => {
      mapDispatchToProps(dispatch, ownProps);

      expect(routeActions.updateRoute.calls[0].arg).toBe(ownProps.componentName);
    });

    test('calls bindActionCreators with the correct arguments', () => {
      mapDispatchToProps(dispatch, ownProps);

      expect(redux.bindActionCreators.calls[0].args[0]).toHaveProperty('updateRoute', routeActions.updateRoute(ownProps.componentName));
      expect(redux.bindActionCreators.calls[0].args[1]).toBe(dispatch);
    });
  });
});
