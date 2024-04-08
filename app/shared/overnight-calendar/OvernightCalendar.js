import React from 'react';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { injectT } from 'i18n';
import {
  getNotSelectableNotificationText,
  getNotificationText,
  getOvernightDatetime,
  getReservationUrl,
  handleDateSelect,
  handleDisableDays,
  handleFormattingSelected,
  isReservingAllowed,
  nextDayBookedModifier,
  nextDayClosedModifier,
  prevDayBookedModifier,
  prevDayClosedModifier,
  reservationsModifier
} from './overnightUtils';
import OvernightCalendarSelector from './OvernightCalendarSelector';
import OvernightSummary from './OvernightSummary';
import { setSelectedDatetimes } from '../../actions/uiActions';
import OvernightLegends from './OvernightLegends';
import { addNotification } from 'actions/notificationsActions';

function OvernightCalendar({
  currentLanguage, resource, t, selected, actions,
  history, isLoggedIn, isStrongAuthSatisfied, isMaintenanceModeOn
}) {
  // TODO: how to handle fetching reservations far in the future?
  // fetch on every month change?

  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);

  const {
    reservable, reservableAfter, reservableBefore, openingHours, reservations,
    overnightStartTime, overnightEndTime
  } = resource;

  const highlighted = { from: startDate, to: endDate };
  const available = { from: new Date(2024, 2, 4), to: new Date(2024, 2, 8) };
  const start = startDate;
  const end = endDate;

  const now = moment();
  const reservingIsAllowed = isReservingAllowed({
    isLoggedIn, isStrongAuthSatisfied, isMaintenanceModeOn, resource
  });

  const validateAndSelect = (day, { booked, nextBooked, nextClosed }) => {
    const isNextBlocked = !startDate && (nextBooked || nextClosed);
    const isDateDisabled = handleDisableDays({
      day,
      now,
      reservable,
      reservableAfter,
      reservableBefore,
      startDate,
      openingHours,
      reservations,
    });

    if (!reservingIsAllowed) {
      actions.addNotification({
        message: getNotificationText({
          isLoggedIn, isStrongAuthSatisfied, isMaintenanceModeOn, resource, t
        }),
        type: 'info',
        timeOut: 10000,
      });
      return;
    }

    if (!isDateDisabled && !booked && !isNextBlocked) {
      handleDateSelect(day, startDate, setStartDate, endDate, setEndDate);
      return;
    }

    actions.addNotification({
      message: getNotSelectableNotificationText({
        isDateDisabled, booked, isNextBlocked, t
      }),
      type: 'info',
      timeOut: 10000,
    });
  };

  const handleSelectDatetimes = () => {
    const formattedSelected = handleFormattingSelected(
      startDate, endDate, overnightStartTime, overnightEndTime, resource.id);
    actions.setSelectedDatetimes([formattedSelected, formattedSelected]);
    const nextUrl = getReservationUrl(undefined, resource.id);
    history.push(nextUrl);
  };

  return (
    <div className="overnight-calendar">
      <DayPicker
        disabledDays={(day) => handleDisableDays({
          day,
          now,
          reservable,
          reservableAfter,
          reservableBefore,
          startDate,
          openingHours,
          reservations,
        })}
        enableOutsideDays
        firstDayOfWeek={1}
        initialMonth={new Date()}
        labels={{ previousMonth: t('Overnight.prevMonth'), nextMonth: t('Overnight.nextMonth') }}
        locale={currentLanguage}
        localeUtils={MomentLocaleUtils}
        // TODO: accessibility for different modifiers
        modifiers={{
          start,
          end,
          highlighted,
          available,
          booked: (day) => reservationsModifier(day, reservations),
          nextBooked: (day) => nextDayBookedModifier(day, reservations),
          nextBookedStartSelected: (day) => (
            startDate ? nextDayBookedModifier(day, reservations) : null),
          nextClosed: (day) => nextDayClosedModifier(day, openingHours),
          prevBooked: (day) => prevDayBookedModifier(day, reservations),
          prevClosed: (day) => prevDayClosedModifier(day, openingHours),
        }}
        onDayClick={validateAndSelect}
        selectedDays={[startDate, endDate]}
        showOutsideDays
        todayButton={t('Overnight.currentMonth')}
      />
      <OvernightLegends />
      {((selected && selected.length > 0) || (startDate && endDate)) && (
        <OvernightSummary
          endDatetime={getOvernightDatetime(endDate, overnightEndTime)}
          handleSelectDatetimes={handleSelectDatetimes}
          selected={selected}
          startDatetime={getOvernightDatetime(startDate, overnightStartTime)}
        />
      )}
    </div>
  );
}

OvernightCalendar.propTypes = {
  currentLanguage: PropTypes.string.isRequired,
  resource: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  selected: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isStrongAuthSatisfied: PropTypes.bool.isRequired,
  isMaintenanceModeOn: PropTypes.bool.isRequired,
};

OvernightCalendar = injectT(OvernightCalendar); // eslint-disable-line
export { OvernightCalendar as UnconnectedOvernightCalendar };


function mapDispatchToProps(dispatch) {
  const actionCreators = {
    setSelectedDatetimes,
    addNotification,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(
  OvernightCalendarSelector,
  mapDispatchToProps,
)(OvernightCalendar);

