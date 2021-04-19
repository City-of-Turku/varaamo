import React from 'react';
import CookieConsent from 'react-cookie-consent';
import PropTypes from 'prop-types';

import { addCookieScript } from '../../utils/cookieUtils';
import { injectT } from 'i18n';

function CookieBar({ t, currentLanguage }) {
  return (
    <CookieConsent
      buttonClasses="cookie-button"
      buttonId="cookie-accept-button"
      buttonText={t('CookieBar.accept')}
      contentClasses="cookie-content"
      declineButtonClasses="cookie-button"
      declineButtonId="cookie-decline-button"
      declineButtonText={t('CookieBar.decline')}
      disableStyles
      enableDeclineButton
      expires={90}
      onAccept={addCookieScript}
      setDeclineCookie
    >
      {t('CookieBar.description')}
      <div className="cookiePolicy">
        <a
          href={SETTINGS.COOKIE_POLICY_BASE_URL + currentLanguage}
          style={{ color: 'white' }}
        >
          {t('CookieBar.link.text')}
        </a>
      </div>
    </CookieConsent>
  );
}

CookieBar.propTypes = {
  currentLanguage: PropTypes.string,
  t: PropTypes.func.isRequired,
};

export default injectT(CookieBar);
