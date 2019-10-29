import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SignoutCallbackComponent } from 'redux-oidc';
import Loader from 'react-loader';

import userManager from 'utils/userManager';

class UnconnectedLogoutCallback extends React.Component {
  constructor(props) {
    super(props);

    this.logoutSuccessful = this.logoutSuccessful.bind(this);
    this.logoutUnsuccessful = this.logoutUnsuccessful.bind(this);
  }

  logoutSuccessful() {
    console.log('logout successful');
    this.props.history.push('/');
  }

  logoutUnsuccessful(error) {
    console.log(`logout unsuccessful... ${error}`);
    this.props.history.push('/');
  }

  render() {
    return (
      <SignoutCallbackComponent
        errorCallback={this.logoutUnsuccessful}
        successCallback={this.logoutSuccessful}
        userManager={userManager}
      >
        <Loader />
      </SignoutCallbackComponent>
    );
  }
}

UnconnectedLogoutCallback.propTypes = {
  history: PropTypes.object.isRequired,
};

export { UnconnectedLogoutCallback };
export default connect()(UnconnectedLogoutCallback);
