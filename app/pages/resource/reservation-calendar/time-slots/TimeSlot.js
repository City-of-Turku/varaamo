import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import moment from 'moment';

import { injectT } from 'i18n';
import { scrollTo } from 'utils/domUtils';
import { padLeft } from 'utils/timeUtils';
import { isSlotReservable } from '../utils';
import { getNaiveDate } from '../../../../utils/resourceUtils';

class TimeSlot extends PureComponent {
  static propTypes = {
    addNotification: PropTypes.func.isRequired,
    headerId: PropTypes.string.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    isDisabled: PropTypes.bool,
    isAdmin: PropTypes.bool.isRequired,
    showClear: PropTypes.bool.isRequired,
    isHighlighted: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isStrongAuthSatisfied: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    isSelectable: PropTypes.bool.isRequired,
    isUnderMinPeriod: PropTypes.bool.isRequired,
    onClear: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    resource: PropTypes.object.isRequired,
    scrollTo: PropTypes.bool,
    selected: PropTypes.bool.isRequired,
    slot: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    isMaintenanceModeOn: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    isDisabled: false,
  }

  static getDerivedStateFromProps(prop) {
    const {
      slot, resource, isAdmin, isDisabled, isSelectable, selected, isLoggedIn, isStrongAuthSatisfied
    } = prop;
    const isPast = new Date(slot.end) < new Date();
    const isReservable = isSlotReservable(resource, slot);

    // if user is not logged in via strong method to resource requiring strong auth
    // slot should always be disabled. Otherwise proceed to make other disable checks.
    let disabled = true;
    if (isStrongAuthSatisfied) {
      disabled = isDisabled
      || !isLoggedIn
      || (!isSelectable && !selected)
      || !resource.userPermissions.canMakeReservations
      || !isReservable
      || (!slot.editing && (slot.reserved || isPast))
      || (slot.onCooldown && !isAdmin);
    }

    return {
      disabled,
      isPast
    };
  }

  constructor(props) {
    super(props);
    this.timeSlotRef = React.createRef();

    this.state = {
      disabled: false,
      isPast: false,
      showSkip: false,
    };

    this.handleSkipFocus = this.handleSkipFocus.bind(this);
    this.handleSkipBlur = this.handleSkipBlur.bind(this);
  }

  componentDidMount() {
    if (this.props.scrollTo) {
      scrollTo(this.timeSlotRef.current);
    }
  }

  componentDidUpdate() {
    const { selected } = this.props;

    if (selected && selected === this.state.disabled) {
      this.renderMinPeriodWarning();
      this.props.onClear();
    }
  }

  getSelectButtonStatusLabel(
    isDisabled, isLoggedIn, isStrongAuthSatisfied, isOwnReservation, isReserved, isSelected
  ) {
    const { t, resource } = this.props;

    if (isOwnReservation) {
      return `${t('TimeSlot.notSelectable')} - ${t('TimeSlot.ownReservation')}`;
    }

    if (isReserved) {
      return `${t('TimeSlot.notSelectable')} - ${t('TimeSlot.reserved')}`;
    }

    if (isSelected) {
      return t('TimeSlot.selected');
    }

    if (!resource.reservable && !resource.userPermissions.canMakeReservations) {
      return t('TimeSlot.notSelectable');
    }

    // if timeslot is otherwise disabled
    if (isDisabled && !isOwnReservation && !isReserved && !isSelected) {
      if (!isStrongAuthSatisfied) {
        return `${t('TimeSlot.notSelectable')} - ${t('TimeSlot.logInFirstStrongAuth')}`;
      }
      if (!isLoggedIn) {
        return `${t('TimeSlot.notSelectable')} - ${t('TimeSlot.logInFirst')}`;
      }

      return t('TimeSlot.notSelectable');
    }

    // if timeslot is none of the above, it is free
    if (!isDisabled && isLoggedIn && !isOwnReservation && !isReserved && !isSelected) {
      return t('TimeSlot.available');
    }

    return undefined;
  }

  getReservationInfoNotification(isLoggedIn, isStrongAuthSatisfied, resource, slot, t) {
    const { isMaintenanceModeOn } = this.props;
    if (new Date(slot.end) < new Date() || slot.reserved) {
      return null;
    }

    if (isMaintenanceModeOn) {
      return {
        message: t('Notifications.cannotReserveDuringMaintenance'),
        type: 'info',
        timeOut: 10000,
      };
    }
    if (resource.reservable && !isStrongAuthSatisfied) {
      return {
        message: t('Notifications.loginToReserveStrongAuth'),
        type: 'info',
        timeOut: 10000,
      };
    }
    if (!isLoggedIn && resource.reservable) {
      return {
        message: t('Notifications.loginToReserve'),
        type: 'info',
        timeOut: 10000,
      };
    }
    if (resource.reservableBefore && moment(slot.start).isAfter(resource.reservableBefore)) {
      const dateFormat = 'D.M.YYYY';
      const lastDate = moment(getNaiveDate(resource.reservableBefore), 'YYYY-MM-DD').subtract(1, 'day').format(dateFormat);
      const msg = `${t('ReservingRestrictedText.reservationRestricted', { days: resource.reservableDaysInAdvance })} ${t('Notifications.reservableLastDay', { date: lastDate })}`;
      return {
        message: msg,
        type: 'info',
        timeOut: 10000,
      };
    }
    return {
      message: t('Notifications.noRightToReserve'),
      type: 'info',
      timeOut: 10000,
    };
  }

  /**
   * Render notification warning message when user
   * trying to select a timeslot that are able to shorter than reservation minPeriod.
   *
   * For example: last reservation close at 3pm, minPeriod = 3h, warn user when
   * select time slot later on 12am
   *
   * @memberof TimeSlot
   */
  renderMinPeriodWarning = () => {
    const { t, addNotification } = this.props;

    addNotification({
      message: t('Notifications.selectTimeToReserve.warning'),
      type: 'info',
      timeOut: 10000,
    });
  }

  handleClick = (disabled) => {
    const {
      addNotification, isLoggedIn, isStrongAuthSatisfied, onClick,
      resource, slot, t, isUnderMinPeriod
    } = this.props;

    if (disabled) {
      const notification = this.getReservationInfoNotification(
        isLoggedIn, isStrongAuthSatisfied, resource, slot, t
      );
      if (notification && notification.message) {
        addNotification(notification);
      }
    } else if (isUnderMinPeriod) {
      this.renderMinPeriodWarning();
    } else {
      onClick({
        begin: slot.start,
        end: slot.end,
        resource,
      });
    }
  };

  handleSkipFocus() {
    this.setState({ showSkip: true });
  }

  handleSkipBlur() {
    this.setState({ showSkip: false });
  }

  render() {
    const {
      headerId,
      isAdmin,
      showClear,
      isHighlighted,
      onClear,
      onMouseEnter,
      onMouseLeave,
      selected,
      slot,
      t,
      isLoggedIn,
      isStrongAuthSatisfied,
    } = this.props;

    const { disabled, isPast } = this.state;

    const reservation = slot.reservation;
    const isOwnReservation = reservation && reservation.isOwn && slot.reserved;
    const isCooldown = slot.onCooldown;
    const start = moment(slot.start);
    const startTime = `${padLeft(start.hours())}:${padLeft(start.minutes())}`;
    const showCooldown = isAdmin
      && isCooldown
      && !isPast
      && !selected
      && !isHighlighted
      && !disabled;

    return (
      <div
        className={classNames('app-TimeSlot', {
          'app-TimeSlot--disabled': disabled,
          'app-TimeSlot--is-admin': isAdmin,
          'app-TimeSlot--editing': slot.editing,
          'app-TimeSlot--past': isPast,
          'app-TimeSlot--own-reservation': isOwnReservation,
          'app-TimeSlot--reservation-starting': slot.reservationStarting,
          'app-TimeSlot--reservation-ending': slot.reservationEnding,
          'app-TimeSlot--reserved': slot.reserved,
          'app-TimeSlot--selected': selected,
          'app-TimeSlot--highlight': isHighlighted,
          'app-TimeSlot--cooldown': isCooldown,
        })}
        ref={this.timeSlotRef}
      >
        <button
          aria-describedby={headerId}
          className="app-TimeSlot__action"
          onClick={() => this.handleClick(disabled)}
          onMouseEnter={() => !disabled && onMouseEnter(slot)}
          onMouseLeave={() => !disabled && onMouseLeave()}
          type="button"
        >
          <span aria-hidden="true" className={`app-TimeSlot__icon${showCooldown ? ' cooldown' : ''}`} />
          <time aria-hidden="true" className="app-TimeSlot__time" dateTime={slot.asISOString}>{startTime}</time>
          <span
            aria-label={`${startTime} ${this.getSelectButtonStatusLabel(
              disabled, isLoggedIn, isStrongAuthSatisfied, isOwnReservation, slot.reserved, selected
            )}`}
            className="app-TimeSlot__status"
          />
        </button>
        {showClear && (
          <React.Fragment>
            <button
              aria-label={t('TimeSlot.label.removeSelection')}
              className="app-TimeSlot__clear"
              onClick={onClear}
              type="button"
            >
              <span className="app-TimeSlot__clear-icon" />
            </button>
            <a
              aria-label={t('TimeSlot.label.skipToSummary')}
              className={classNames('app-TimeSlot__skip', !this.state.showSkip && 'visually-hidden')}
              href="#timetable-summary"
              onBlur={this.handleSkipBlur}
              onFocus={this.handleSkipFocus}
            >
              <span className="app-TimeSlot__skip-icon" />
            </a>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default injectT(TimeSlot);
