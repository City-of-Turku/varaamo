import React from 'react';
import PropTypes from 'prop-types';

import injectT from '../../i18n/injectT';

function OvernightHiddenHeading({
  date, localeUtils, locale, t
}) {
  const dateText = localeUtils.formatMonthTitle(date, locale);
  return (
    <div className="sr-only">
      <h3>{t('Overnight.calendar')}</h3>
      <p role="status">{dateText}</p>
    </div>
  );
}

OvernightHiddenHeading.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  localeUtils: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(OvernightHiddenHeading);
