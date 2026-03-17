import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';

import { injectT } from 'i18n';
import PageWrapper from 'pages/PageWrapper';
import { getFeedbackLink } from 'utils/languageUtils';
import { getAboutContent } from './content/aboutContent';


function AboutPage({ t, currentLanguage }) {
  return (
    <PageWrapper className="about-page" title={t('AboutPage.title')}>
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={
        { __html: getAboutContent(currentLanguage, getFeedbackLink(currentLanguage)) }}
      />

      <h2>{t('AboutPageContent.customerRegisterHeader')}</h2>
      <p>
        <FormattedHTMLMessage id="AboutPageContent.customerRegisterParagraph" />
      </p>
      <p>
        <FormattedHTMLMessage id="AboutPageContent.customerRegisterLink" />
      </p>
      <p>
        <FormattedHTMLMessage id="AboutPageContent.customerRegisterLinkVR" />
      </p>
      <p>
        <FormattedHTMLMessage id="AboutPageContent.customerRegisterLinkSUO" />
      </p>
      <br />
    </PageWrapper>
  );
}

AboutPage.propTypes = {
  t: PropTypes.func.isRequired,
  currentLanguage: PropTypes.string.isRequired,
};

export default injectT(AboutPage);
