import { DEFAULT_SLOT_SIZE } from 'constants/SlotConstants';

import { Factory } from 'rosie';

const Resource = new Factory()
  .sequence('id', index => `r-${index}`)
  .sequence('name', index => `Resource-${index}`)
  .sequence('description', index => `desc-${index}`)
  .attr('public', true)
  .sequence('unit', index => `u-${index}`)
  .attr('availableHours', [])
  .attr('equipment', [])
  .attr('images', [])
  .attr('maxPeriod', max => `${max}`)
  .attr('minPeriod', min => `${min}`)
  .attr('needManualConfirmation', false)
  .attr('equipment', [])
  .attr('openingHours', [])
  .attr('products', [])
  .attr('requiredReservationExtraFields', [])
  .attr('reservable', true)
  .attr('reservableAfter', null)
  .attr('supportedReservationExtraFields', [])
  .attr('userPermissions', { isAdmin: false, canMakeReservations: true })
  .attr('isFavorite', false)
  .attr('slotSize', DEFAULT_SLOT_SIZE);
export default Resource;
