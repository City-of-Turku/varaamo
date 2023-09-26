import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import { Link } from 'react-router-dom';

// eslint-disable-next-line import/no-unresolved
import logoFi from '@city-assets/images/logo_footer.png';
// eslint-disable-next-line import/no-unresolved
import logoSv from '@city-assets/images/logo_footer_sv.png';
import { injectT } from 'i18n';
import { getFeedbackLink } from 'utils/languageUtils';

function FooterContent({ t, currentLang }) {
  const currentLogo = (currentLang !== 'sv') ? logoFi : logoSv;
  const currentLink = getFeedbackLink(currentLang);
  return (
    <Grid>
      <Row>
        <Col lg={3} md={3}>
          <div className="brand-link">
            <img
              alt={t('Logo.cityAlt')}
              src={currentLogo}
              title={t('Logo.cityAlt')}
            />
          </div>
        </Col>
        <Col lg={6} md={6}>
          <h2>Varaamo</h2>
          <p>
            <FormattedHTMLMessage id="Footer.addressText" />
            <br />
            <br />
            <Link className="accessibility-info-link" to="/accessibility-info">{t('AccessibilityInfo.title')}</Link>
            <br />
            <a className="feedback-link" href={currentLink} rel="noopener noreferrer" target="_blank">
              {t('Footer.feedbackLink')}
            </a>
          </p>
        </Col>
      </Row>
    </Grid>
  );
}

FooterContent.propTypes = {
  t: PropTypes.func.isRequired,
  currentLang: PropTypes.string.isRequired,
};

export default injectT(FooterContent);
