import React from 'react';
import PropTypes from 'prop-types';

import TooltipOverlay from '../../../shared/tooltip/TooltipOverlay';


function GeneratedAccessCode({ accessCode }) {
  return (
    <TooltipOverlay
      content={(
        <p>{accessCode}</p>
          )}
    >
      <span>
        <span aria-hidden="true">****</span>
        <span className="sr-only">{accessCode}</span>
      </span>
    </TooltipOverlay>
  );
}

GeneratedAccessCode.propTypes = {
  accessCode: PropTypes.string.isRequired,
};

export default GeneratedAccessCode;
