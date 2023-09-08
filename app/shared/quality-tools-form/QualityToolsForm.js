import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/lib/Button';

import injectT from '../../i18n/injectT';
import StarInput from './StarInput';
import { getFormFieldText, getFormTitleText } from './qualityToolsUtils';

/**
 * Returns quality tools jsx form
 * @param {object} props
 * @param {string} props.currentLanguage
 * @param {object} props.formData
 * @param {function} props.handleHoverEnter
 * @param {function} props.handleHoverLeave
 * @param {function} props.handleSetStars
 * @param {function} props.handleSubmit
 * @param {function} props.handleTextChange
 * @param {number} props.hoverTargetStar
 * @param {number} props.stars
 * @param {string} props.textFeedback
 * @param {function} props.t
 * @returns {JSX.Element} form
 */
function QualityToolsForm({
  currentLanguage,
  formData,
  handleHoverEnter,
  handleHoverLeave,
  handleSetStars,
  handleSubmit,
  handleTextChange,
  hoverTargetStar,
  stars,
  textFeedback,
  t,
}) {
  return (
    <form className="quality-tools-form" onSubmit={handleSubmit}>
      <p id="quality-tools-form-title">
        {getFormTitleText(formData, currentLanguage)}
      </p>
      <fieldset onMouseLeave={handleHoverLeave}>
        <legend>
          {`${
            getFormFieldText(formData, currentLanguage, 'starRating', 'label')} (${
            getFormFieldText(formData, currentLanguage, 'starRating', 'hint')})`}
        </legend>
        {[1, 2, 3, 4, 5].map(value => (
          <StarInput
            currentStars={stars}
            handleHoverEnter={handleHoverEnter}
            handleSetStars={handleSetStars}
            hoverTargetStar={hoverTargetStar}
            key={`starkey${value}`}
            value={value}
          />
        ))}
      </fieldset>
      <label htmlFor="quality-tools-feedback-text" id="quality-tools-feedback-text-label">
        <span id="quality-tools-feedback-text-label-main">
          {getFormFieldText(formData, currentLanguage, 'textArea', 'label')}
        </span>
        <span id="quality-tools-feedback-text-hint">
          {getFormFieldText(formData, currentLanguage, 'textArea', 'hint')}
        </span>
        <textarea
          id="quality-tools-feedback-text"
          onChange={handleTextChange}
          placeholder={getFormFieldText(formData, currentLanguage, 'textArea', 'placeholder')}
          rows={5}
          value={textFeedback}
        />
      </label>

      <div>
        <Button
          id="quality-tools-feedback-submit-btn"
          onClick={handleSubmit}
          type="submit"
        >
          {t('qualityTools.sendFeedback')}
        </Button>
      </div>
    </form>
  );
}

QualityToolsForm.propTypes = {
  currentLanguage: PropTypes.string.isRequired,
  formData: PropTypes.object.isRequired,
  handleHoverEnter: PropTypes.func.isRequired,
  handleHoverLeave: PropTypes.func.isRequired,
  handleSetStars: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleTextChange: PropTypes.func.isRequired,
  hoverTargetStar: PropTypes.number.isRequired,
  stars: PropTypes.number.isRequired,
  textFeedback: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(QualityToolsForm);
