import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import PopoverOverlay from '../../../shared/popover/PopoverOverlay';
import iconClock from 'assets/icons/clock-o.svg';
import { injectT } from 'i18n';

function PendingAccessCode({ t }) {
  return (
    <PopoverOverlay
      content={<FormattedMessage id="common.pincode.waitingForCreation" />}
    >
      <img alt={t('common.pincode.waitingForCreation')} src={iconClock} />
    </PopoverOverlay>
  );
}

PendingAccessCode.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(PendingAccessCode);
