import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import injectT from '../../i18n/injectT';


/**
 * Returns a single star radio input
 * @param {object} props
 * @param {number} props.currentStars
 * @param {function} props.handleHoverEnter
 * @param {function} props.handleSetStars
 * @param {number} props.hoverTargetStar
 * @param {number} props.value
 * @param {function} props.t
 * @returns {JSX.Element} star radio input
 */
function StarInput({
  currentStars, handleHoverEnter, handleSetStars, hoverTargetStar, value, t
}) {
  // is user hovering over stars
  const isHovering = hoverTargetStar > 0;
  // is this star active due to hovering
  const isHoverActive = value <= hoverTargetStar;
  // is this star active due to chosen star. Hovering overrides this
  const isActive = isHoverActive || (!isHovering && value <= currentStars);
  const isChecked = value === currentStars;

  return (
    <label
      className={classNames('star-label', { 'is-checked': isChecked }, { active: isActive }, { inactive: !isActive })}
      htmlFor={`star${value}`}
      onMouseEnter={() => handleHoverEnter(value)}
    >
      <input
        checked={value === currentStars}
        className="visually-hidden"
        id={`star${value}`}
        name="star-rating"
        onChange={handleSetStars}
        type="radio"
        value={value}
      />
      <span
        className="visually-hidden"
      >
        {value === 1 ? t('qualityTools.starInput.label.star', { count: value })
          : t('qualityTools.starInput.label.stars', { count: value })}
      </span>
      <svg viewBox="0 0 512 512">
        <path d="M512 198.525l-176.89-25.704-79.11-160.291-79.108 160.291-176.892 25.704 128 124.769-30.216 176.176 158.216-83.179 158.216 83.179-30.217-176.176 128.001-124.769z" />
      </svg>
    </label>
  );
}

StarInput.propTypes = {
  currentStars: PropTypes.number.isRequired,
  handleHoverEnter: PropTypes.func.isRequired,
  handleSetStars: PropTypes.func.isRequired,
  hoverTargetStar: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(StarInput);
