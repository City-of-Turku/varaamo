import { Factory } from 'rosie';

import { DEFAULT_SLOT_SIZE } from 'constants/SlotConstants';


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
  .attr('slotSize', DEFAULT_SLOT_SIZE)
  .attr('universalField', []);

const UniversalField = new Factory()
  .sequence('id')
  .attr('fieldType', 'Select')
  .attr('data', null)
  .attr('description', 'universal field description text')
  .attr('label', 'universal field label text')
  .attr('resource', '')
  .attr('options', ['id'], (id) => {
    const opts = [];
    for (let i = 1; i < 5; i += 1) {
      opts.push({
        id: i,
        text: `option-${i}`
      });
    }
    return opts;
  });

export { UniversalField };
export default Resource;
