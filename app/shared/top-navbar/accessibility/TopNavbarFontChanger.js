import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { injectT } from 'i18n';
import ACC from '../../../constants/AppConstants';

class FontSizeChanger extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    fontSize: PropTypes.string,
    changeFontSize: PropTypes.func,
  };

  first = 'first';

  second = 'second';

  third = 'third';

  constructor(props) {
    super(props);
    this.handleFontSizeClick = this.handleFontSizeClick.bind(this);
  }

  getActiveFontButton(size) {
    switch (size) {
      case ACC.FONT_SIZES.SMALL:
        return this.first;
      case ACC.FONT_SIZES.MEDIUM:
        return this.second;
      case ACC.FONT_SIZES.LARGE:
        return this.third;
      default:
        return this.first;
    }
  }


  /**
   * Checks if spanID is the active fontsize
   * @param {string} spanID
   */
  setActiveClass(spanID) {
    const span = this.getActiveFontButton(this.props.fontSize);
    return ((span === spanID) ? 'active' : '');
  }

  /**
   * Returns correct text for the aria-label
   * @param {*} size
   */
  setAriaLabel(size) {
    const { t } = this.props;
    switch (size) {
      case ACC.FONT_SIZES.SMALL:
        return t('Nav.FontSize.small');

      case ACC.FONT_SIZES.MEDIUM:
        return t('Nav.FontSize.medium');

      case ACC.FONT_SIZES.LARGE:
        return t('Nav.FontSize.large');

      default:
        return '';
    }
  }

  /**
   * Checks if spanID is the active fontsize
   * @param {string} spanID
   * @returns {Boolean} true/false
   */
  setAriaPressed(spanID) {
    const span = this.getActiveFontButton(this.props.fontSize);
    return ((span === spanID));
  }

  handleFontSizeClick(size) {
    this.props.changeFontSize(size);
  }

  /**
   *
   * @param {string} spanID
   * @param {string} fontSize
   *
   * @returns {html} <button> element
   */
  renderFontButton(spanID, fontSize) {
    return (
      <button
        aria-label={this.setAriaLabel(fontSize)}
        aria-pressed={this.setAriaPressed(spanID)}
        className={this.setActiveClass(spanID)}
        onClick={() => this.handleFontSizeClick(fontSize)}
        type="button"
      >
        A

      </button>
    );
  }

  render() {
    const {
      t
    } = this.props;

    return (
      <li className="navbar__font" role="presentation">
        <div aria-label={t('Nav.FontSize.title')} className="accessibility__buttonGroup">
          {t('Nav.FontSize.title')}
          {this.renderFontButton(this.first, ACC.FONT_SIZES.SMALL)}
          {this.renderFontButton(this.second, ACC.FONT_SIZES.MEDIUM)}
          {this.renderFontButton(this.third, ACC.FONT_SIZES.LARGE)}
        </div>
      </li>
    );
  }
}

export default injectT(FontSizeChanger);
