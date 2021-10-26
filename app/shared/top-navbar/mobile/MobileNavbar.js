import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { Col, Row } from 'react-bootstrap';

import FontChanger from 'shared/top-navbar/accessibility/TopNavbarFontContainer';
import ContrastChanger from 'shared/top-navbar/accessibility/TopNavbarContrastContainer';

class MobileNavbar extends React.Component {
  static propTypes = {
    toggle: PropTypes.bool,
    contrast: PropTypes.string
  };


  getCollapseStatus = () => (this.props.toggle ? '' : 'is-collapsed')

  render() {
    const element = this.getCollapseStatus();
    return (
      <div aria-hidden={!this.props.toggle} aria-live="polite" className={classNames('mobile-Navbar_mobile', element, this.props.contrast)} id="mobileNavbar">
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
}


export default MobileNavbar;
