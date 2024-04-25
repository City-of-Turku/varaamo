
import some from 'lodash/some';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

import { slotSize, slotWidth, slotMargin } from 'constants/SlotConstants';

const moment = extendMoment(Moment);

function getTimeSlotWidth({ startTime, endTime } = {}) {
  const diff = endTime ? endTime.diff(startTime, 'minutes') : slotSize;
  const slots = Math.floor(diff / slotSize);

  return (slotWidth * slots) - slotMargin;
}

function getTimelineItems(date, reservations, resourceId, timeRestrictions, hasStaffRights) {
  const {
    cooldown, minPeriod, maxPeriod, overnightReservations
  } = timeRestrictions;
  // skip getting cooldowns if user has perms
  const cooldownRanges = hasStaffRights ? [] : getCooldownRanges(reservations, cooldown);
  const items = [];
  let reservationPointer = 0;
  let timePointer = date.clone().startOf('day');
  const end = date.clone().endOf('day');
  while (timePointer.isBefore(end)) {
    const reservation = reservations && reservations[reservationPointer];
    const isSlotReservation = reservation && timePointer.isSame(reservation.begin);
    if (isSlotReservation && !overnightReservations) {
      items.push({
        key: String(items.length),
        type: 'reservation',
        data: reservation,
      });
      timePointer = moment(reservation.end);
      reservationPointer += 1;
    } else {
      const beginMoment = timePointer.format();
      const endMoment = timePointer.clone().add(slotSize, 'minutes').format();
      // skip cooldown check if user has perms
      const isWithinCooldown = hasStaffRights ? false
        : isSlotWithinCooldown(beginMoment, endMoment, cooldownRanges);

      items.push({
        key: String(items.length),
        type: 'reservation-slot',
        data: {
          begin: beginMoment,
          end: endMoment,
          resourceId,
          // isSelectable: false by default to improve selector performance by allowing
          // addSelectionData to make some assumptions.
          isSelectable: false,
          isWithinCooldown,
          hasStaffRights,
          minPeriod,
          maxPeriod
        },
      });
      timePointer.add(slotSize, 'minutes');
    }
  }
  return items;
}

function isInsideOpeningHours(item, openingHours) {
  return some(openingHours, opening => (
    moment(opening.opens) <= moment(item.data.begin)
      && moment(item.data.end) <= moment(opening.closes)
  ));
}

function markItemSelectable(item, isSelectable, openingHours, ext, after) {
  let selectable = (
    isSelectable
    && moment().isSameOrBefore(item.data.end)
    && (!openingHours || isInsideOpeningHours(item, openingHours))
    && !(item.data.isWithinCooldown && !item.data.hasStaffRights)
  );
  const isExternalAndBeforeAfter = !ext && moment(item.data.begin).isSameOrBefore(after);
  if (isExternalAndBeforeAfter) {
    selectable = false;
  }
  return { ...item, data: { ...item.data, isSelectable: selectable } };
}

function markItemsSelectable(items, isSelectable, openingHours, external, after) {
  return items.map((item) => {
    if (item.type === 'reservation') return item;
    return markItemSelectable(item, isSelectable, openingHours, external, after);
  });
}

function addSelectionData(selection, resource, items) {
  const canIgnoreOpeningHours = resource.userPermissions.canIgnoreOpeningHours;
  const reservableAfter = resource.reservableAfter;

  if (resource.overnightReservations) {
    return items;
  }

  if (!selection) {
    return markItemsSelectable(
      items, true, resource.openingHours, canIgnoreOpeningHours, reservableAfter);
  } if (selection.resourceId !== resource.id) {
    // isSelectable is false by default, so nothing needs to be done.
    // This is a pretty important performance optimization when there are tons of
    // resources in the AvailabilityView and the selection is in a state where the
    // first click has been done but the second (end time) hasn't. Without this
    // optimization we'd be calling markItemSelectable for every slot in every
    // resource when the user hovers to another slot.
    return items;
  }
  let lastSelectableFound = false;
  return items.map((item) => {
    if (lastSelectableFound || item.data.begin < selection.begin) {
      if (item.type === 'reservation') return item;
      // isSelectable is false by default.
      return item;
    }
    if (item.type === 'reservation') {
      lastSelectableFound = true;
      return item;
    }
    return markItemSelectable(
      item, true, resource.openingHours);
  });
}

function getCooldownRanges(reservations, cooldown) {
  if (reservations && cooldown && cooldown !== '00:00:00') {
    return reservations.map(reservation => moment.range(
      moment(reservation.begin).subtract(moment.duration(cooldown)),
      moment(reservation.end).add(moment.duration(cooldown))
    ));
  }
  return [];
}

function isSlotWithinCooldown(begin, end, cooldownRanges) {
  const slotRange = moment.range(begin, end);
  for (let index = 0; index < cooldownRanges.length; index += 1) {
    const cooldownRange = cooldownRanges[index];
    if (cooldownRange.overlaps(slotRange)) {
      return true;
    }
  }
  return false;
}

export default {
  addSelectionData,
  getTimelineItems,
  getTimeSlotWidth,
};
