import React from 'react';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import BTTooltip from 'react-bootstrap/lib/Tooltip';
import PropTypes from 'prop-types';

function TooltipOverlay({
  children, content, placement, ...rest
}) {
  return (
    <div className="app-TooltipOverlay">
      <OverlayTrigger
        overlay={(
          <BTTooltip id={`tooltip-${placement}`}>
            {content}
          </BTTooltip>
        )}
        placement={placement || 'top'}
        {...rest}
      >
        {children}
      </OverlayTrigger>
    </div>
  );
}

TooltipOverlay.propTypes = {
  children: PropTypes.element.isRequired,
  content: PropTypes.element.isRequired,
  placement: PropTypes.string,
};

export default TooltipOverlay;
