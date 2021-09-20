import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { injectT } from 'i18n';

class ContrastChanger extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    changeContrast: PropTypes.func,
    idPrefix: PropTypes.string,
  };


  constructor(props) {
    super(props);
    this.state = {
      ariaState: false,
    };
  }

  /**
   * Toggles page contrast and button aria-pressed value(false/true)
   */
  handleOnClick = () => {
    this.props.changeContrast();
    this.toggleAriaState();
  }

  /**
   * Toggles state.ariaState
   */
  toggleAriaState() {
    this.setState(prevState => ({ ariaState: !prevState.ariaState }));
  }

  render() {
    const { t, idPrefix } = this.props;
    let buttonId = 'contrastButton';
    if (idPrefix) { buttonId = `${idPrefix}-${buttonId}`; }
    return (
      <li className="navbar__contrast">
        <div className="accessibility__contrast" role="presentation">
          {t('Nav.Contrast.title')}
          <button
            aria-label={t('Nav.Contrast.button')}
            aria-pressed={this.state.ariaState}
            className="contrast_button"
            id={buttonId}
            onClick={this.handleOnClick}
            tabIndex="0"
            type="button"
          />
        </div>
      </li>
    );
  }
}

export default injectT(ContrastChanger);
