import PropTypes from 'prop-types';
import React from 'react';

import { injectT } from 'i18n';
import { getCurrentCustomization } from 'utils/customizationUtils';
import espooLogoSrc from './espoo-blue-logo.png';
import vantaaLogoSrc from './vantaa-logo.png';
import turkuLogoSrc from './logo_footer.png';

function Logo({ t }) {
  switch (getCurrentCustomization()) {
    case 'ESPOO': {
      return (
        <img
          alt={t('Logo.espooAlt')}
          src={espooLogoSrc}
        />
      );
    }

    case 'VANTAA': {
      return (
        <img
          alt={t('Logo.vantaaAlt')}
          src={vantaaLogoSrc}
        />
      );
    }

    default: {
      return (
        <img
          alt={t('Logo.cityAlt')}
          src={turkuLogoSrc}
          title="Turun vaakuna"
        />
      );
    }
  }
}

Logo.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(Logo);
