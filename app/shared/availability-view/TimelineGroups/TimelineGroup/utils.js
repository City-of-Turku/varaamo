
import some from 'lodash/some';
import moment from 'moment';

import { slotSize, slotWidth, slotMargin } from 'constants/SlotConstants';

function getTimeSlotWidth({ startTime, endTime } = {}) {
  const diff = endTime ? endTime.diff(startTime, 'minutes') : slotSize;
  const slots = Math.floor(diff / slotSize);
  if (endTime && endTime.diff(startTime, 'minutes')) {
    console.log('endtimeä');
    console.log(startTime);
    console.log(endTime);
    console.log(endTime.diff(startTime, 'minutes'));
  } else {
    console.log('defaulttia');
  }
  return (slotWidth * slots) - slotMargin;
}

function getTimelineItems(date, reservations, resourceId) {
  const items = [];
  console.log(`getTimeLineItems - resource: ${resourceId}`);
  console.log(reservations);
  let reservationPointer = 0;
  let timePointer = date.clone().startOf('day');
  const end = date.clone().endOf('day');
  while (timePointer.isBefore(end)) {
    const reservation = reservations && reservations[reservationPointer];
    const isSlotReservation = reservation && timePointer.isSame(reservation.begin);
    // eslint-disable-next-line max-len
    const isDuringReservation = reservation && timePointer.isBetween(reservation.begin, reservation.end);
    if (isSlotReservation) {
      // reservation starts
      items.push({
        key: String(items.length),
        type: 'reservation',
        data: reservation,
      });
      timePointer = moment(reservation.end);
      reservationPointer += 1;
    } else {
      if (isDuringReservation) {
        // the remainder of a reservation that started the previous day?
        // console.log(`is during: ${timePointer.toISOString()}`);
        items.push({
          key: String(items.length),
          type: 'reservation',
          data: reservation,
        });
        timePointer = moment(reservation.end);
        reservationPointer += 1;
      }
      items.push({
        key: String(items.length),
        type: 'reservation-slot',
        data: {
          begin: timePointer.format(),
          end: timePointer.clone().add(slotSize, 'minutes').format(),
          resourceId,
          // isSelectable: false by default to improve selector performance by allowing
          // addSelectionData to make some assumptions.
          isSelectable: false,
        },
      });
      timePointer.add(slotSize, 'minutes');
    }
  }
  console.log('itemit');
  console.log(items);
  return items;
}

function isInsideOpeningHours(item, openingHours) {
  return some(openingHours, opening => (
    opening.opens <= item.data.begin && item.data.end <= opening.closes
  ));
}

function markItemSelectable(item, isSelectable, openingHours, ext, after) {
  let selectable = (
    isSelectable
    && moment().isSameOrBefore(item.data.end)
    && (!openingHours || isInsideOpeningHours(item, openingHours))
  );
  const isExternalAndBeforeAfter = !ext && moment(item.data.begin).isSameOrBefore(after);
  if (isExternalAndBeforeAfter) {
    selectable = false;
  }
  return { ...item, data: { ...item.data, isSelectable: selectable } };
}

function markItemsSelectable(items, isSelectable, openingHours, external, after) {
  return items.map((item) => {
    if (item.type === 'reservation') return { ...item, openingHours };
    return markItemSelectable(item, isSelectable, openingHours, external, after);
  });
}

function addSelectionData(selection, resource, items) {
  const canIgnoreOpeningHours = resource.userPermissions.canIgnoreOpeningHours;
  const reservableAfter = resource.reservableAfter;
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
      if (item.type === 'reservation') return { ...item, open: resource.open, close: resource.close };
      // isSelectable is false by default.
      return item;
    }
    if (item.type === 'reservation') {
      lastSelectableFound = true;
      return { ...item, open: resource.open, close: resource.close };
    }
    return markItemSelectable(
      item, true, resource.openingHours);
  });
}

export default {
  addSelectionData,
  getTimelineItems,
  getTimeSlotWidth,
};
