import { Factory } from 'rosie';

const OrderLine = new Factory()
  .attr('product', {})
  .attr('quantity', 0)
  .attr('unit_price', '8.00')
  .attr('price', '0.00');

export default OrderLine;
