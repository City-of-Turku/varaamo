import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { injectT } from 'i18n';

class ContrastChanger extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    changeContrast: PropTypes.func,
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
    const { t } = this.props;
    return (
      <li className="navbar__contrast" role="presentation">
        <div aria-label={t('Nav.Contrast.title')} className="accessibility__contrast">
          {t('Nav.Contrast.title')}
          <button
            aria-label={t('Nav.Contrast.title')}
            aria-pressed={this.state.ariaState}
            className="contrast_button"
            id="contrastButton"
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
