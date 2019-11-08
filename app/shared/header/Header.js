import PropTypes from 'prop-types';
import React from 'react';
import Sticky from 'react-sticky-el';

import MainNavbar from 'shared/main-navbar';
import TopNavbar from 'shared/top-navbar';

function Header({ children, location }) {
  const { pathname } = location;
  const activeLink = pathname === '/' ? 'home' : pathname.replace('/', '');
  return (
    <header className="app-Header">
      <TopNavbar />
      <Sticky>
        <MainNavbar activeLink={activeLink} />
      </Sticky>
      {children}
    </header>
  );
}

Header.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};

export default Header;
