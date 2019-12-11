import React from 'react';

import userManager from 'utils/userManager';

class SignInRedirectRoute extends React.Component {
  componentDidMount() {
    userManager.signinRedirect();
  }

  render() {
    return <div />;
  }
}

export default SignInRedirectRoute;
