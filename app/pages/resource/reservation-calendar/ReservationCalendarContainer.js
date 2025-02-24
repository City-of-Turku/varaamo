
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import moment from 'moment';
import first from 'lodash/first';
import last from 'lodash/last';
import orderBy from 'lodash/orderBy';
import debounce from 'lodash/debounce';

import constants from 'constants/AppConstants';
import { addNotification } from 'actions/notificationsActions';
import {
  cancelReservationEdit,
  clearTimeSlots,
  openConfirmReservationModal,
  selectReservationSlot,
  toggleTimeSlot,
} from 'actions/uiActions';
import ReservationCancelModal from 'shared/modals/reservation-cancel';
import ReservationInfoModal from 'shared/modals/reservation-info';
import ReservationSuccessModal from 'shared/modals/reservation-success';
import ReservationConfirmation from 'shared/reservation-confirmation';
import recurringReservations from 'state/recurringReservations';
import { injectT } from 'i18n';
import { getEditReservationUrl } from 'utils/reservationUtils';
import { hasMaxReservations, reservingIsRestricted, isStaffForResource } from 'utils/resourceUtils';
import reservationCalendarSelector from './reservationCalendarSelector';
import ReservingRestrictedText from './ReservingRestrictedText';
import TimeSlots from './time-slots';

export class UnconnectedReservationCalendarContainer extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    date: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    isFetchingResource: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isStrongAuthSatisfied: PropTypes.bool.isRequired,
    isStaff: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
    params: PropTypes.shape({
      // eslint-disable-line react/no-unused-prop-types
      id: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.object.isRequired,
    resource: PropTypes.object.isRequired,
    selected: PropTypes.array.isRequired,
    t: PropTypes.func.isRequired,
    time: PropTypes.string,
    timeSlots: PropTypes.array.isRequired,
    isMaintenanceModeOn: PropTypes.bool.isRequired,
  };

  getSelectedDateSlots = (timeSlots, selected) => {
    if (timeSlots && selected.length) {
      const firstSelected = first(selected);
      const selectedDate = moment(firstSelected.begin).format(constants.DATE_FORMAT);
      const dateSlot = timeSlots.find((slot) => {
        if (slot && slot.length) {
          const slotDate = moment(slot[0].start).format(constants.DATE_FORMAT);
          return selectedDate === slotDate;
        }
        return false;
      });
      return dateSlot || [];
    }
    return [];
  };

  getSelectedTimeText = (selected) => {
    if (!selected.length) {
      return '';
    }
    const orderedSelected = orderBy(selected, 'begin');
    const beginSlot = first(orderedSelected);
    const endSlot = last(orderedSelected);
    const beginText = this.getDateTimeText(beginSlot.begin, true);
    const endText = this.getDateTimeText(endSlot.end, false);
    const duration = moment.duration(moment(endSlot.end).diff(moment(beginSlot.begin)));
    const durationText = this.getDurationText(duration);
    return `${beginText} - ${endText} (${durationText})`;
  };

  getDurationText = (duration) => {
    const hours = duration.hours();
    const mins = duration.minutes();
    return `${hours > 0 ? `${hours}h ` : ''}${mins}min`;
  }

  getDateTimeText = (slot, returnDate) => {
    const { t } = this.props;
    const time = moment(slot).format('HH:mm');
    const timeText = t('TimeSlots.selectedTime', { time });

    if (returnDate) {
      const dateText = moment(slot).format('dd D.M.Y');
      return `${dateText} ${timeText}`;
    }

    return `${timeText}`;
  };

  handleEditCancel = () => {
    this.props.actions.cancelReservationEdit();
  };

  handleReserveClick = () => {
    const {
      actions, isAdmin, resource, selected, t, history
    } = this.props;
    if (!isAdmin && hasMaxReservations(resource)) {
      actions.addNotification({
        message: t('TimeSlots.maxReservationsPerUser'),
        type: 'error',
        timeOut: 10000,
      });
    } else {
      const orderedSelected = orderBy(selected, 'begin');
      const { end } = last(orderedSelected);
      const reservation = Object.assign({}, first(orderedSelected), { end });
      const nextUrl = getEditReservationUrl(reservation);

      history.push(nextUrl);
    }
  };

  render() {
    const {
      actions,
      date,
      isAdmin,
      isEditing,
      isFetchingResource,
      isLoggedIn,
      isStrongAuthSatisfied,
      isStaff,
      params,
      resource,
      selected,
      t,
      time,
      timeSlots,
      isMaintenanceModeOn,
    } = this.props;

    const isOpen = Boolean(timeSlots.length);
    const showTimeSlots = isOpen && !reservingIsRestricted(resource, date);
    const selectedDateSlots = this.getSelectedDateSlots(timeSlots, selected);
    const isResourceStaff = (isAdmin && resource) ? isStaffForResource(resource) : false;

    return (
      <div className="reservation-calendar">
        <h3 className="visually-hidden reservation-calendar__header">{t('ReservationCalendar.header')}</h3>
        {showTimeSlots && (
          <TimeSlots
            addNotification={debounce(actions.addNotification, 100)}
            // TODO: Im a h@ck, remove me
            isAdmin={isResourceStaff}
            isEditing={isEditing}
            isFetching={isFetchingResource}
            isLoggedIn={isLoggedIn || resource.authentication === 'unauthenticated'} // count as logged in if no auth needed
            isMaintenanceModeOn={isMaintenanceModeOn}
            isStaff={isStaff}
            isStrongAuthSatisfied={isStrongAuthSatisfied}
            onClear={actions.clearTimeSlots}
            onClick={actions.toggleTimeSlot}
            resource={resource}
            selected={selected}
            selectedDate={date}
            slots={timeSlots}
            time={time}
          />
        )}
        {showTimeSlots && selected.length > 0 && (
          <Row className="reservation-calendar-reserve-info">
            <h3 className="visually-hidden" id="timetable-summary">{t('ReservationCalendar.Confirmation.header')}</h3>
            <Col xs={12}>
              <strong>
                {t('TimeSlots.selectedDate')}
                {' '}
              </strong>
              {this.getSelectedTimeText(selected)}
            </Col>
            <Col xs={12}>
              <Button
                bsStyle="primary"
                className="reservation-calendar__reserve-button"
                onClick={this.handleReserveClick}
              >
                {t('TimeSlots.reserveButton')}
              </Button>
            </Col>
          </Row>
        )}
        {!isOpen && <p className="info-text closed-text">{t('TimeSlots.closedMessage')}</p>}
        {isOpen && reservingIsRestricted(resource, date) && (
          <ReservingRestrictedText
            reservableAfter={resource.reservableAfter}
            reservableBefore={resource.reservableBefore}
            reservableDaysInAdvance={resource.reservableDaysInAdvance}
          />
        )}
        <ReservationCancelModal />
        <ReservationInfoModal />
        <ReservationSuccessModal />
        <ReservationConfirmation
          params={params}
          selectedReservations={selected}
          showTimeControls
          timeSlots={selectedDateSlots}
        />
      </div>
    );
  }
}

UnconnectedReservationCalendarContainer = injectT(UnconnectedReservationCalendarContainer); // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    addNotification,
    cancelReservationEdit,
    clearTimeSlots,
    changeRecurringBaseTime: recurringReservations.changeBaseTime,
    openConfirmReservationModal,
    selectReservationSlot,
    toggleTimeSlot,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(
  reservationCalendarSelector,
  mapDispatchToProps
)(UnconnectedReservationCalendarContainer);
