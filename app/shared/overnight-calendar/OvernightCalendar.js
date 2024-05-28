import React, { useEffect } from 'react';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { injectT } from 'i18n';
import {
  areDatesSameAsInitialDates,
  closedDaysModifier,
  filterSelectedReservation,
  getNotSelectableNotificationText,
  getNotificationText,
  getOvernightDatetime,
  getReservationUrl,
  getSelectedDuration,
  handleDateSelect,
  handleDisableDays,
  handleFormattingSelected,
  isDurationBelowMin,
  isDurationOverMax,
  isReservingAllowed,
  isSelectionContinous,
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
import OvernightEditSummary from './OvernightEditSummary';
import { getPrettifiedPeriodUnits } from '../../utils/timeUtils';
import { hasMaxReservations } from '../../utils/resourceUtils';
import OvernightHiddenHeading from './OvernightHiddenHeading';

function OvernightCalendar({
  currentLanguage, resource, t, selected, actions,
  history, isLoggedIn, isStrongAuthSatisfied, isMaintenanceModeOn,
  reservationId, onEditCancel, onEditConfirm, handleDateChange, selectedDate,
  isSuperuser, isResourceAdmin, isResourceManager,
}) {
  if (!resource || !resource.reservations) {
    return null;
  }

  let initialStart = null;
  let initialEnd = null;

  if (selected && selected.length > 1) {
    initialStart = moment(selected[0].begin).toDate();
    initialEnd = moment(selected[1].end).toDate();
  }

  // for init month use redux's selected > url date > current date
  const initialMonth = initialStart || moment(selectedDate).toDate() || new Date();

  const [startDate, setStartDate] = React.useState(initialStart);
  const [endDate, setEndDate] = React.useState(initialEnd);
  const [currentMonth, setCurrentMonth] = React.useState(initialMonth);

  const datesSameAsInitial = areDatesSameAsInitialDates(
    startDate, endDate, initialStart, initialEnd);

  const {
    reservable, reservableAfter, reservableBefore, openingHours, reservations,
    overnightStartTime, overnightEndTime, maxPeriod, minPeriod
  } = resource;

  const isUnitAdminOrHigher = isSuperuser || isResourceAdmin;
  const isUnitManagerOrHigher = isSuperuser || isResourceAdmin || isResourceManager;

  useEffect(() => {
    if (!isUnitAdminOrHigher && startDate && endDate && !datesSameAsInitial) {
      const selectedDuration = getSelectedDuration(
        startDate, endDate, overnightStartTime, overnightEndTime);
      const isDurBelowMin = isDurationBelowMin(selectedDuration, minPeriod);
      if (isDurBelowMin) {
        const minDurationText = getPrettifiedPeriodUnits(minPeriod, t('common.unit.time.day.short'));
        actions.addNotification({
          message: `${t('Overnight.belowMinAlert')} (${minDurationText})`,
          type: 'info',
          timeOut: 10000,
        });
      }
      const isDurOverMax = isDurationOverMax(selectedDuration, maxPeriod);
      if (isDurOverMax) {
        const maxDurationText = getPrettifiedPeriodUnits(maxPeriod, t('common.unit.time.day.short'));
        actions.addNotification({
          message: `${t('Overnight.overMaxAlert')} (${maxDurationText})`,
          type: 'info',
          timeOut: 10000,
        });
      }
    }
  }, [startDate, endDate]);

  const filteredReservations = reservationId
    ? filterSelectedReservation(reservationId, reservations) : reservations;

  const highlighted = { from: startDate, to: endDate };
  const available = { from: new Date(2024, 2, 4), to: new Date(2024, 2, 8) };
  const start = startDate;
  const end = endDate;

  const now = moment();
  const reservingIsAllowed = isReservingAllowed({
    isLoggedIn,
    isStrongAuthSatisfied,
    isMaintenanceModeOn,
    resource,
    hasAdminBypass: isUnitManagerOrHigher
  });

  const validateAndSelect = (day, { booked, nextBooked, nextClosed }) => {
    const isNextBlocked = (!startDate || (startDate && endDate)) && (nextBooked || nextClosed);
    const isDateDisabled = handleDisableDays({
      day,
      now,
      reservable,
      reservableAfter,
      reservableBefore,
      openingHours,
      reservations: filteredReservations,
      minPeriod,
      hasAdminBypass: isUnitManagerOrHigher,
      overnightStartTime,
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

    if ((startDate && !endDate)
       && !isSelectionContinous({
         startDate,
         endDate: day,
         reservations: filteredReservations,
         openingHours,
         overnightStartTime,
         overnightEndTime
       })) {
      actions.addNotification({
        message: t('Notifications.continousFreeDaysError'),
        type: 'info',
        timeOut: 10000,
      });
      return;
    }

    if (!isDateDisabled && !booked && !isNextBlocked) {
      handleDateSelect({
        value: day,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        overnightStartTime,
        overnightEndTime
      });
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

  const isEditing = !!initialStart;

  const handleSelectDatetimes = () => {
    if (!isUnitManagerOrHigher && hasMaxReservations(resource) && !isEditing) {
      actions.addNotification({
        message: t('TimeSlots.maxReservationsPerUser'),
        type: 'error',
        timeOut: 10000,
      });
      return;
    }
    const formattedSelected = handleFormattingSelected(
      startDate, endDate, overnightStartTime, overnightEndTime, resource.id);
    actions.setSelectedDatetimes([formattedSelected, formattedSelected]);
    if (isEditing) {
      onEditConfirm();
    } else {
      const nextUrl = getReservationUrl(undefined, resource.id);
      history.push(nextUrl);
    }
  };

  const selectedDuration = getSelectedDuration(
    startDate, endDate, overnightStartTime, overnightEndTime);
  const isDurBelowMin = isUnitAdminOrHigher ? false
    : isDurationBelowMin(selectedDuration, minPeriod);

  const isDurOverMax = isUnitAdminOrHigher ? false
    : isDurationOverMax(selectedDuration, maxPeriod);

  return (
    <div className="overnight-calendar">
      <OvernightHiddenHeading
        date={currentMonth}
        locale={currentLanguage}
        localeUtils={MomentLocaleUtils}
      />
      <DayPicker
        disabledDays={(day) => handleDisableDays({
          day,
          now,
          reservable,
          reservableAfter,
          reservableBefore,
          openingHours,
          reservations: filteredReservations,
          minPeriod,
          hasAdminBypass: isUnitManagerOrHigher,
          overnightStartTime,
        })}
        enableOutsideDays
        firstDayOfWeek={1}
        initialMonth={initialMonth}
        labels={{ previousMonth: t('Overnight.prevMonth'), nextMonth: t('Overnight.nextMonth') }}
        locale={currentLanguage}
        localeUtils={MomentLocaleUtils}
        modifiers={{
          start,
          end,
          highlighted,
          available,
          closed: (day) => closedDaysModifier(day, openingHours),
          booked: (day) => reservationsModifier(day, filteredReservations),
          nextBooked: (day) => nextDayBookedModifier(day, filteredReservations),
          nextClosed: (day) => nextDayClosedModifier(day, openingHours),
          prevBooked: (day) => prevDayBookedModifier(day, filteredReservations),
          prevClosed: (day) => prevDayClosedModifier(day, openingHours),
        }}
        onDayClick={validateAndSelect}
        onMonthChange={(date) => { handleDateChange(date); setCurrentMonth(date); }}
        selectedDays={[startDate, endDate]}
        showOutsideDays
        todayButton={t('Overnight.currentMonth')}
      />
      <OvernightLegends />
      {!isEditing && (
        <OvernightSummary
          duration={selectedDuration}
          endDatetime={getOvernightDatetime(endDate, overnightEndTime, t)}
          handleSelectDatetimes={handleSelectDatetimes}
          isDurationBelowMin={isDurBelowMin}
          isDurationOverMax={isDurOverMax}
          maxDuration={maxPeriod || ''}
          minDuration={minPeriod}
          selected={selected}
          startDatetime={getOvernightDatetime(startDate, overnightStartTime, t)}
        />
      )}
      {isEditing && (
        <OvernightEditSummary
          datesSameAsInitial={datesSameAsInitial}
          duration={selectedDuration}
          endDatetime={getOvernightDatetime(endDate, overnightEndTime, t)}
          isDurationBelowMin={isDurBelowMin}
          isDurationOverMax={isDurOverMax}
          maxDuration={maxPeriod || ''}
          minDuration={minPeriod}
          onCancel={onEditCancel}
          onConfirm={handleSelectDatetimes}
          selected={selected}
          startDatetime={getOvernightDatetime(startDate, overnightStartTime, t)}
        />
      )}
    </div>
  );
}

OvernightCalendar.defaultProps = {
  reservationId: 0,
  selectedDate: '',
};

OvernightCalendar.propTypes = {
  currentLanguage: PropTypes.string.isRequired,
  resource: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  selected: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  isResourceAdmin: PropTypes.bool.isRequired,
  isResourceManager: PropTypes.bool.isRequired,
  isSuperuser: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isStrongAuthSatisfied: PropTypes.bool.isRequired,
  isMaintenanceModeOn: PropTypes.bool.isRequired,
  reservationId: PropTypes.number,
  onEditCancel: PropTypes.func,
  onEditConfirm: PropTypes.func,
  handleDateChange: PropTypes.func.isRequired,
  selectedDate: PropTypes.string,
  params: PropTypes.object.isRequired, // eslint-disable-line
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

