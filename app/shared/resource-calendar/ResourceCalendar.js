import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Button from 'react-bootstrap/lib/Button';
import Overlay from 'react-bootstrap/lib/Overlay';
import moment from 'moment';

import { isValidDateString } from 'utils/timeUtils';
import { injectT } from 'i18n';
import iconCalendar from 'assets/icons/calendar.svg';
import ResourceCalendarOverlay from './ResourceCalendarOverlay';
import resourceCalendarSelector from './resourceCalendarSelector';

export class UnconnectedResourceCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textInputDate: '',
      textInputErrorVisible: false,
      visible: false,
    };

    this.calendarWrapper = null;
    this.now = moment();

    this.handleDateTextChange = this.handleDateTextChange.bind(this);
    this.handleDateButtonClick = this.handleDateButtonClick.bind(this);
    this.handleDateTextSubmit = this.handleDateTextSubmit.bind(this);
    this.handleDateTextOnBlur = this.handleDateTextOnBlur.bind(this);
  }

  componentDidMount() {
    const formattedDate = moment(this.props.selectedDate).format('L');
    this.setState({ textInputDate: formattedDate });
  }

  setCalendarWrapper = (element) => {
    this.calendarWrapper = element;
  }

  disableDays = (day) => {
    if (this.props.disableDays) {
      return this.props.disableDays(day);
    }
    return this.now.isAfter(day, 'day');
  }

  handleDateChange = (newDate) => {
    this.hideOverlay();
    const formattedDate = moment(newDate).format('L');
    this.setState({
      textInputDate: formattedDate,
      textInputErrorVisible: false,
    });
    this.props.onDateChange(newDate);
  }

  hideOverlay = () => {
    this.setState({ visible: false });
  }

  showOverlay = () => {
    this.setState({ visible: true });
  }

  handleDateTextOnBlur() {
    const date = this.state.textInputDate;
    const isValidDate = isValidDateString(date);
    this.setState({ textInputErrorVisible: !isValidDate });
  }

  handleDateTextChange(event) {
    this.setState({ textInputDate: event.target.value });
  }

  handleDateButtonClick() {
    if (this.state.visible === true) {
      this.hideOverlay();
    } else {
      this.showOverlay();
    }
  }

  handleDateTextSubmit(event) {
    event.preventDefault();

    const date = this.state.textInputDate;
    if (isValidDateString(date) === false) {
      this.setState({ textInputErrorVisible: true });
    } else {
      this.setState({ textInputErrorVisible: false });
      const selectedMoment = moment(date, 'L');
      const formattedDate = new Date();
      formattedDate.setFullYear(selectedMoment.year(),
        selectedMoment.month(),
        selectedMoment.date());
      this.handleDateChange(formattedDate);
    }
  }

  render() {
    const {
      availability,
      currentLanguage,
      selectedDate,
      t,
    } = this.props;

    const [year, month, dayNumber] = selectedDate.split('-');
    const selectedDay = new Date();
    selectedDay.setFullYear(year, month - 1, dayNumber);
    const modifiers = {
      available: (day) => {
        const dayDate = day.toISOString().substring(0, 10);
        return availability[dayDate] && availability[dayDate].percentage >= 80;
      },
      busy: (day) => {
        const dayDate = day.toISOString().substring(0, 10);
        return (
          availability[dayDate]
          && availability[dayDate].percentage < 80
          && availability[dayDate].percentage > 0
        );
      },
      booked: (day) => {
        const dayDate = day.toISOString().substring(0, 10);
        return availability[dayDate] && availability[dayDate].percentage === 0;
      },
    };

    return (
      <div className="app-ResourceCalendar">
        <button
          aria-label={t('ResourceCalendar.previousWeek')}
          className="app-ResourceCalendar__week-button app-ResourceCalendar__week-button--prev"
          onClick={() => this.handleDateChange(
            moment(selectedDay).subtract(1, 'w').toDate()
          )}
          type="button"
        />
        <div className="app-ResourceCalendar__wrapper" ref={this.setCalendarWrapper}>
          <form onSubmit={this.handleDateTextSubmit}>
            <FormGroup controlId="dateField">
              <ControlLabel>{t('ResourceCalendar.form.label')}</ControlLabel>
              {this.state.textInputErrorVisible
              && <p id="date-input-error" role="alert">{t('ResourceCalendar.form.error.feedback')}</p>}
              <InputGroup>
                <FormControl
                  aria-describedby={this.state.textInputErrorVisible ? 'date-input-error' : null}
                  onBlur={this.handleDateTextOnBlur}
                  onChange={this.handleDateTextChange}
                  type="text"
                  value={this.state.textInputDate}
                />
                <InputGroup.Button>
                  <Button aria-hidden="true" className="app-ResourceCalendar__wrapper__button" onClick={this.handleDateButtonClick} tabIndex="-1">
                    <img alt={t('ResourceCalendar.button.imageAlt')} className="app-ResourceCalendar__icon" src={iconCalendar} />
                  </Button>
                </InputGroup.Button>
              </InputGroup>
            </FormGroup>
          </form>

          <Overlay
            container={this.calendarWrapper}
            onHide={this.hideOverlay}
            placement="bottom"
            rootClose
            show={this.state.visible}
          >
            <ResourceCalendarOverlay onHide={this.hideOverlay}>
              <DayPicker
                disabledDays={this.disableDays}
                enableOutsideDays
                initialMonth={new Date(selectedDate)}
                locale={currentLanguage}
                localeUtils={MomentLocaleUtils}
                modifiers={modifiers}
                onDayClick={this.handleDateChange}
                selectedDays={selectedDay}
                showOutsideDays
              />
              <div className="calendar-legend">
                <span className="free">{t('ReservationCalendarPickerLegend.free')}</span>
                <span className="busy">{t('ReservationCalendarPickerLegend.busy')}</span>
                <span className="booked">{t('ReservationCalendarPickerLegend.booked')}</span>
              </div>
            </ResourceCalendarOverlay>
          </Overlay>
        </div>
        <button
          aria-label={t('ResourceCalendar.nextWeek')}
          className="app-ResourceCalendar__week-button app-ResourceCalendar__week-button--next"
          onClick={() => this.handleDateChange(
            moment(selectedDay).add(1, 'w').toDate()
          )}
          type="button"
        />
      </div>
    );
  }
}

UnconnectedResourceCalendar.propTypes = {
  availability: PropTypes.object.isRequired,
  disableDays: PropTypes.func,
  currentLanguage: PropTypes.string.isRequired,
  selectedDate: PropTypes.string.isRequired,
  onDateChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};
UnconnectedResourceCalendar = injectT(UnconnectedResourceCalendar); // eslint-disable-line

export default connect(resourceCalendarSelector)(UnconnectedResourceCalendar);
