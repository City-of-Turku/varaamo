import PropTypes from 'prop-types';
import React from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';
import Overlay from 'react-bootstrap/lib/Overlay';
import DayPicker from 'react-day-picker';
import moment from 'moment';
import MomentLocaleUtils from 'react-day-picker/moment';

import { injectT } from 'i18n';
import SearchControlOverlay from './SearchControlOverlay';
import iconCalendar from './images/calendar.svg';
import { isValidDateString } from '../../../utils/timeUtils';

class DatePickerControl extends React.Component {
  static propTypes = {
    currentLanguage: PropTypes.string.isRequired,
    date: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { date } = this.props;
    this.state = {
      date,
      visible: false,
      textInputErrorVisible: false
    };

    this.handleDateInputChange = this.handleDateInputChange.bind(this);
    this.handleDateInputSubmit = this.handleDateInputSubmit.bind(this);
    this.handleDateButtonClick = this.handleDateButtonClick.bind(this);
  }

  componentWillUpdate(nextProps) {
    const { date } = nextProps;
    if (date !== this.props.date) {
      // TODO: fix this lint
      // eslint-disable-next-line react/no-will-update-set-state
      this.setState({ date });
    }
  }

  hideOverlay = () => {
    this.setState({ visible: false });
  };

  showOverlay = () => {
    this.setState({ visible: true });
  };

  handleConfirm = (value, isValid = true) => {
    const date = value;
    this.setState({ textInputErrorVisible: !isValid });
    this.props.onConfirm({ date }, isValid);
    this.hideOverlay();
  };

  handleDateInputChange(event) {
    const date = event.target.value;
    this.setState({ date });
  }

  handleDateInputSubmit(event) {
    event.preventDefault();

    const date = this.state.date;
    this.handleConfirm(date, isValidDateString(date));
  }

  handleDateButtonClick() {
    if (this.state.visible === true) {
      this.hideOverlay();
    } else {
      this.showOverlay();
    }
  }

  render() {
    const { currentLanguage, t } = this.props;
    const localDate = this.state.date;
    const { date } = this.props;
    const selectedDay = moment(date, 'L')
      .startOf('day')
      .toDate();

    return (
      <section className="app-DatePickerControl">
        <form onSubmit={this.handleDateInputSubmit}>
          <FormGroup controlId="datePickerField">
            <ControlLabel>{t('DatePickerControl.label')}</ControlLabel>
            {this.state.textInputErrorVisible
            && <p id="date-input-error" role="alert">{t('DatePickerControl.form.error.feedback')}</p>}
            <InputGroup>
              <FormControl
                aria-describedby={this.state.textInputErrorVisible ? 'date-input-error' : null}
                onBlur={this.handleDateInputSubmit}
                onChange={this.handleDateInputChange}
                type="text"
                value={localDate}
              />
              <InputGroup.Button>
                <Button aria-hidden="true" className="app-DatePickerControl__button" onClick={this.handleDateButtonClick} tabIndex="-1">
                  <img alt={t('DatePickerControl.button.imageAlt')} className="app-DatePickerControl__icon" src={iconCalendar} />
                </Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </form>
        <Overlay
          container={this}
          onHide={this.hideOverlay}
          placement="bottom"
          rootClose
          show={this.state.visible}
        >
          <SearchControlOverlay onHide={this.hideOverlay} title={t('DatePickerControl.header')}>
            <DayPicker
              disabledDays={day => new Date(day).setHours(23, 59, 59, 59) < new Date()}
              initialMonth={selectedDay}
              locale={currentLanguage}
              localeUtils={MomentLocaleUtils}
              onDayClick={this.handleConfirm}
              selectedDays={selectedDay}
              showOutsideDays
              showWeekNumbers
            />
          </SearchControlOverlay>
        </Overlay>
      </section>
    );
  }
}

export default injectT(DatePickerControl);
