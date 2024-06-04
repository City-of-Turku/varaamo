import React from 'react';
import PropTypes from 'prop-types';

import injectT from '../../i18n/injectT';


function OvernightLegends({ t }) {
  return (
    <div aria-hidden className="overnight-legends">
      <div className="overnight-row">
        <div className="overnight-legend">
          <div className="overnight-legend-box overnight-free">21</div>
          <span className="overnight-legend-text">{t('Overnight.legend.available')}</span>
        </div>
        <div className="overnight-legend">
          <div className="overnight-legend-box overnight-disabled">21</div>
          <span className="overnight-legend-text">{t('Overnight.legend.notSelectable')}</span>
        </div>
      </div>
      <div className="overnight-row">
        <div className="overnight-legend">
          <div className="overnight-legend-box overnight-booked">21</div>
          <span className="overnight-legend-text">{t('Overnight.legend.reserved')}</span>
        </div>
        <div className="overnight-legend">
          <div className="overnight-legend-box overnight-selection">21</div>
          <span className="overnight-legend-text">{t('Overnight.legend.ownSelection')}</span>
        </div>
      </div>
    </div>
  );
}

OvernightLegends.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(OvernightLegends);
