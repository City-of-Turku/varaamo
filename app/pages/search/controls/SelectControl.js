import PropTypes from 'prop-types';
import React from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import classNames from 'classnames';

import iconTimes from './images/times.svg';
import { injectT } from 'i18n';

class SelectControl extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  getValue = (value, options) => {
    // make sure value is found in select options and return it, else return empty string
    const foundOption = options.find(option => option.value === value);
    if (foundOption === undefined) {
      return '';
    }

    return foundOption.value;
  };

  /**
   * Handles select element change events
   * @param {Object} event onChange event triggered by select element
   */
  handleChange(event) {
    const { value } = event.target;
    const { onChange } = this.props;
    onChange({ value });
  }

  /**
   * handles clearing select element
   */
  handleClear() {
    const { onChange } = this.props;
    onChange({ value: '' });
  }

  /**
   * Renders options for select element.
   * @param {Object[]} options, contains objects which have properties label and value
   * @returns an array of option elements.
   */
  renderOptions(options) {
    const { t } = this.props;

    const firstOptionLabel = options.length > 0
      ? t('common.select') : t('SelectControl.noOptions');

    // first (unselectable) option acts as a hint/placeholder
    const firstOption = <option hidden key="-1" value="">{firstOptionLabel}</option>;
    const selectOptions = options.map((option, index) => (
      <option
        key={index}
        value={option.value}
      >
        {option.label}
      </option>
    ));
    selectOptions.unshift(firstOption);
    return selectOptions;
  }

  render() {
    const {
      id,
      className,
      isLoading = false,
      isClearable = true,
      name,
      label,
      t,
      options,
      value,
      isDisabled
    } = this.props;
    return (
      <section className="app-SelectControl">
        <FormGroup controlId={id}>
          {label && <ControlLabel>{label}</ControlLabel>}
          {!isLoading
            && (
              <React.Fragment>
                <select
                  className={classNames('app-Select', className, isDisabled && 'app-Select--is-disabled')}
                  disabled={isDisabled}
                  id={id}
                  name={name}
                  onChange={this.handleChange}
                  value={this.getValue(value, options)}
                >
                  {this.renderOptions(options)}
                </select>
                {isClearable
                && (
                <button
                  aria-describedby={id}
                  className={classNames('app-SelectControl__clear-button', value && 'is-visible')}
                  onClick={this.handleClear}
                  type="button"
                >
                  <img alt={t('SelectControl.clearLabel')} src={iconTimes} />
                </button>
                )}
              </React.Fragment>
            )}
        </FormGroup>
      </section>
    );
  }
}
SelectControl.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  isClearable: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.number]),
};

export default injectT(SelectControl);
