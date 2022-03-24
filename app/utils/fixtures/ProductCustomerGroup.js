import { Factory } from 'rosie';

const ProductCustomerGroup = new Factory()
  .sequence('id', index => `product-cg-${index}`)
  .attr('customerGroup', {})
  .attr('price', '3.50');

export default ProductCustomerGroup;
