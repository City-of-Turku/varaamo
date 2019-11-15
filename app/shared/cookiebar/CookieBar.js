import React from 'react';
import CookieConsent from 'react-cookie-consent';
import PropTypes from 'prop-types';

import { injectT } from 'i18n';

function CookieBar({ t }) {
  return (
    <CookieConsent
      buttonClasses="cookie-accept-button"
      buttonId="cookie-accept-button"
      buttonText={t('CookieBar.accept')}
      contentStyle={{ flex: 'auto' }}
      declineButtonClasses="cookie-decline-button"
      declineButtonId="cookie-decline-button"
      declineButtonText={t('CookieBar.decline')}
      disableButtonStyles
      enableDeclineButton
      expires={90}
      onDecline={() => { window.location.replace('http://www.turku.fi'); }}
      setDeclineCookie={false}
    >
      {t('CookieBar.description')}
      <div className="cookiePolicy">
        <a href={t('CookieBar.link.href')} style={{ color: 'white' }}>{t('CookieBar.link.text')}</a>
      </div>
    </CookieConsent>
  );
}

CookieBar.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(CookieBar);
