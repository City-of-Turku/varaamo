import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import Overlay from 'react-bootstrap/lib/Overlay';

import iconCalendar from 'assets/icons/calendar.svg';

const DatePickerWrapper = ({ children }) => (
  <div className="app-DateField__datePicker">
    {children}
  </div>
);

DatePickerWrapper.propTypes = {
  children: PropTypes.any,
};

class DateField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.onChange = this.onChange.bind(this);
    this.setIsOpen = this.setIsOpen.bind(this);
  }

  onChange(newDate) {
    const { onChange } = this.props;

    this.setState({
      isOpen: false,
    });

    onChange(newDate);
  }

  setIsOpen(isOpen) {
    this.setState({ isOpen });
  }

  render() {
    const {
      locale,
      label,
      placeholder,
      value,
    } = this.props;
    const { isOpen } = this.state;
    const date = value || moment().toDate();

    return (
      <div className="app-DateField">
        <FormGroup onClick={() => this.setIsOpen(!isOpen)}>
          {label && <ControlLabel className="app-DateField__label">{label}</ControlLabel>}
          <InputGroup>
            <InputGroup.Addon className="app-DateField__input">
              <img alt="" className="app-DateField__icon" src={iconCalendar} />
              {value && <span className="value">{moment(value).format('L')}</span>}
              {(!value && placeholder) && (
                <span className="placeholder">{placeholder}</span>
              )}
            </InputGroup.Addon>
            <InputGroup.Addon className="app-DateField__triangle">
              <Glyphicon glyph="triangle-bottom" />
            </InputGroup.Addon>
          </InputGroup>
        </FormGroup>
        <Overlay
          animation={false}
          container={this}
          onHide={() => this.setIsOpen(false)}
          placement="bottom"
          rootClose
          show={isOpen}
        >
          <DatePickerWrapper>
            <DayPicker
              initialMonth={date}
              locale={locale}
              localeUtils={MomentLocaleUtils}
              onDayClick={newDate => this.onChange(newDate)}
              selectedDays={date}
              showOutsideDays
              showWeekNumbers
            />
          </DatePickerWrapper>
        </Overlay>
      </div>
    );
  }
}

DateField.propTypes = {
  value: PropTypes.instanceOf(Date),
  locale: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
};

export default DateField;
