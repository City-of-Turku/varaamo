import constants from 'constants/AppConstants';

import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';

import { injectT } from 'i18n';
import turkuLogoSrc from 'shared/logo/logo_footer.png';
import aboLogoSrc from 'shared/logo/logo_footer_sv.png';

class FooterContent extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    currentLang: PropTypes.string,
  };

  render() {
    const { t, currentLang } = this.props;
    const currentLogo = (currentLang === 'se') ? aboLogoSrc : turkuLogoSrc;
    const currentLink = (currentLang === 'se') ? constants.FEEDBACK_URL.SV : constants.FEEDBACK_URL.FI;
    return (
      <Grid>
        <Row>
          <Col lg={3} md={3}>
            <div className="brand-link">
              <img
                alt={t('Logo.turkuAlt')}
                src={currentLogo}
                title={t('Logo.turkuAlt')}
              />
            </div>
          </Col>
          <Col lg={6} md={6}>
            <h5>Varaamo</h5>
            <p>
              <FormattedHTMLMessage id="Footer.turkuText" />
            </p>
            <p>
              <a className="feedback-link" href={currentLink}>
                {t('Footer.feedbackLink')}
              </a>
            </p>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default injectT(FooterContent);
