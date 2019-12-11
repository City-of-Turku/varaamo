import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SignInRedirectRoute from './sign-in-redirect/SignInRedirectRoute';
import { updateRoute } from 'actions/routeActions';
import userIdSelector from 'state/selectors/userIdSelector';
import { isLoadingUserSelector } from 'state/selectors/authSelectors';

export class UnconnectedPrivateRoute extends Component {
  constructor(props) {
    super(props);

    this.renderOrRedirect = this.renderOrRedirect.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.actions.updateRoute(this.props.location);
  }

  componentDidUpdate() {
    this.props.actions.updateRoute(this.props.location);
  }

  renderOrRedirect(routerProps) {
    const { userId, component: RouteComponent } = this.props;

    // if user id is defined, route to given component/page
    if (userId) {
      return <RouteComponent {...routerProps} />;
    }

    // if user id isn't defined, route to sign in redirect component/page
    return <SignInRedirectRoute />;
  }

  render() {
    const { component, isLoadingUser, ...rest } = this.props; // eslint-disable-line no-unused-vars
    if (isLoadingUser) {
      return <div />;
    }

    return <Route {...rest} render={this.renderOrRedirect} />;
  }
}

UnconnectedPrivateRoute.propTypes = {
  actions: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  isLoadingUser: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  component: PropTypes.func.isRequired,
  componentName: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
};

export const mapStateToProps = state => ({
  userId: userIdSelector(state),
  isLoadingUser: isLoadingUserSelector(state),
});

export const mapDispatchToProps = (dispatch, ownProps) => {
  const actionCreators = {
    updateRoute: updateRoute(ownProps.componentName),
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedPrivateRoute);
