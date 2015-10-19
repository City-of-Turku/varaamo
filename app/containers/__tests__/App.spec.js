import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import { UnconnectedApp as App } from 'containers/App';
import User from 'fixtures/User';

describe('Container: App', () => {
  const props = {
    actions: {
      logout: simple.stub(),
      pushState: simple.stub(),
    },
    children: <div id="child-div" />,
    user: Immutable(User.build()),
  };
  const tree = sd.shallowRender(<App {...props} />);
  const instance = tree.getMountedInstance();

  describe('rendering Navbar', () => {
    const navbarTrees = tree.everySubTree('Navbar');

    it('should render Navbar component', () => {
      expect(navbarTrees.length).to.equal(1);
    });

    it('should pass correct props to Navbar component', () => {
      const navbarVdom = navbarTrees[0].getRenderOutput();
      const actualProps = navbarVdom.props;

      expect(actualProps.logout).to.equal(instance.handleLogout);
      expect(actualProps.user).to.equal(props.user);
    });
  });

  describe('rendering props.children', () => {
    it('should render props.children', () => {
      const childTrees = tree.everySubTree('#child-div');

      expect(childTrees.length).to.equal(1);
    });
  });

  it('should render Footer component', () => {
    const footerTrees = tree.everySubTree('Footer');
    expect(footerTrees.length).to.equal(1);
  });

  describe('handleLogout', () => {
    instance.handleLogout();

    it('should call logout function', () => {
      expect(props.actions.logout.callCount).to.equal(1);
    });

    it('should redirect to login page', () => {
      expect(props.actions.pushState.callCount).to.equal(1);
      expect(props.actions.pushState.lastCall.args).to.deep.equal([null, '/login']);
    });
  });
});
