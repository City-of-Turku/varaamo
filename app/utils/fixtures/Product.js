import { Factory } from 'rosie';

const Product = new Factory()
  .sequence('id', index => `p-${index}`)
  .attr('type', 'extra')
  .sequence('name', index => ({ fi: `Product-fi-${index}`, en: `Product-en-${index}`, sv: `Product-sv-${index}` }))
  .sequence('description', index => ({ fi: `desc-fi-${index}`, en: `desc-en-${index}`, sv: `desc-sv-${index}` }))
  .attr('price', { type: 'fixed', tax_percentage: '24.00', amount: '8.00' })
  .attr('max_quantity', 5);

export default Product;
