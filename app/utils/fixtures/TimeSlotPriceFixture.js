import { Factory } from 'rosie';

const TimeSlotPriceFixture = new Factory()
  .sequence('id', index => index)
  .sequence('begin', index => (`${index + 8 < 10 ? '0' : ''}${index + 8}:00:00`))
  .sequence('end', index => (`${index + 9 < 10 ? '0' : ''}${index + 9}:00:00`))
  .attr('price', '3.50')
  .attr('customer_group_time_slot_prices', []);

export default TimeSlotPriceFixture;
