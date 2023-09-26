import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

import FontChanger from 'shared/top-navbar/accessibility/TopNavbarFontContainer';
import ContrastChanger from 'shared/top-navbar/accessibility/TopNavbarContrastContainer';

function MobileNavbar({ toggle, contrast }) {
  const getCollapseStatus = () => (toggle ? '' : 'is-collapsed');
  const element = getCollapseStatus();
  return (
    <div aria-hidden={!toggle} aria-live="polite" className={classNames('mobile-Navbar_mobile', element, contrast)} id="mobileNavbar">
      <div className="container">
        <Row>
          <Col sm={6} smOffset={6} xs={12}>
            <ul>
              <ContrastChanger idPrefix="mobile" />
              <FontChanger />
            </ul>
          </Col>
        </Row>
      </div>
    </div>
  );
}

MobileNavbar.propTypes = {
  toggle: PropTypes.bool,
  contrast: PropTypes.string
};

export default MobileNavbar;
