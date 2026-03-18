import React from 'react';
import { connect } from 'react-redux';
import { CallbackComponent } from 'redux-oidc';
import PropTypes from 'prop-types';
import Loader from 'react-loader';

import userManager from 'utils/userManager';

class UnconnectedLoginCallback extends React.Component {
  constructor(props) {
    super(props);

    this.loginSuccessful = this.loginSuccessful.bind(this);
    this.loginUnsuccessful = this.loginUnsuccessful.bind(this);
  }

  loginSuccessful(user) {
    const redirectUrl = user.state && (user.state.data?.redirectUrl ?? user.state.redirectUrl);
    const isValidPath = typeof redirectUrl === 'string' && redirectUrl.startsWith('/') && !redirectUrl.includes('[object');
    this.props.history.push(isValidPath ? redirectUrl : '/');
  }

  loginUnsuccessful() {
    this.props.history.push('/');
  }

  render() {
    return (
      <CallbackComponent
        errorCallback={error => this.loginUnsuccessful(error)}
        successCallback={user => this.loginSuccessful(user)}
        userManager={userManager}
      >
        <Loader />
      </CallbackComponent>
    );
  }
}

UnconnectedLoginCallback.propTypes = {
  history: PropTypes.object.isRequired,
};

export { UnconnectedLoginCallback };
export default connect()(UnconnectedLoginCallback);
