import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import { Link } from 'react-router-dom';

import FeedbackLink from 'shared/feedback-link';
import Logo from 'shared/logo';
import { injectT } from 'i18n';
import { getCurrentCustomization } from 'utils/customizationUtils';

function FooterContent({ t }) {
  const feedbackLink = <FeedbackLink>{t('Footer.feedbackLink')}</FeedbackLink>;

  switch (getCurrentCustomization()) {
    case 'ESPOO': {
      return (
        <Grid>
          <Row>
            <Col lg={3} md={3}>
              <Link className="brand-link" to="/">
                <Logo />


                Varaamo
              </Link>
            </Col>
            <Col lg={6} md={6}>
              <p>
                <FormattedHTMLMessage id="Footer.espooText" />
              </p>
              <p>
                {feedbackLink}
              </p>
            </Col>
          </Row>
        </Grid>
      );
    }

    case 'VANTAA': {
      return (
        <Grid>
          <Row>
            <Col lg={3} md={3}>
              <Link className="brand-link" to="/">
                <Logo />


                Varaamo
              </Link>
            </Col>
            <Col lg={6} md={6}>
              <p>
                <FormattedHTMLMessage id="Footer.vantaaText" />
              </p>
              <p>
                {feedbackLink}
              </p>
            </Col>
          </Row>
        </Grid>
      );
    }

    default: {
      return (
        <Grid>
          <Row>
            <Col lg={3} md={3}>
              <div className="brand-link">
                <Logo />
              </div>
              <p className="text-left" style={{ paddingTop: '20px' }}>Turun Kaupunki</p>
              <p className="text-left">
                PL 355, 20101 TURKU
                <br />
                vaihde (02) 330 000
                <br />
                <a href="mailto:turun.kaupunki@turku.fi">turun.kaupunki.turku.fi</a>
                <br />
                <a href="mailto:etunimi.sukunimi@turku.fi">etunimi.sukunimi@turku.fi</a>
              </p>
            </Col>
            <Col lg={6} md={6}>
              <h5>Varaamo</h5>
              <p>
                <FormattedHTMLMessage id="Footer.turkuText_2" />
              </p>
              <p>
                {feedbackLink}
              </p>
            </Col>
          </Row>
        </Grid>
      );
    }
  }
}

FooterContent.propTypes = {
  t: PropTypes.func.isRequired,
};

FooterContent.defaultProps = {
  onLinkClick: () => {},
};

export default injectT(FooterContent);
