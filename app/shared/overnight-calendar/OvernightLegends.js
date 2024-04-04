import React from 'react';
// import PropTypes from 'prop-types';

import injectT from '../../i18n/injectT';


function OvernightLegends() {
  return (
    <div className="overnight-legends">
      <div className="overnight-row">
        <div className="overnight-legend">
          <div className="overnight-legend-box overnight-free">21</div>
          <span className="overnight-legend-text">Vapaa</span>
        </div>
        <div className="overnight-legend">
          <div className="overnight-legend-box overnight-disabled">21</div>
          <span className="overnight-legend-text">Ei valittavissa</span>
        </div>
      </div>
      <div className="overnight-row">
        <div className="overnight-legend">
          <div className="overnight-legend-box overnight-booked">21</div>
          <span className="overnight-legend-text">Varattu</span>
        </div>
        <div className="overnight-legend">
          <div className="overnight-legend-box overnight-selection">21</div>
          <span className="overnight-legend-text">Oma valinta</span>
        </div>
      </div>
    </div>
  );
}

OvernightLegends.propTypes = {
  // t: PropTypes.func.isRequired,
};

export default injectT(OvernightLegends);
