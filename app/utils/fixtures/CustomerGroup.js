import { Factory } from 'rosie';

const CustomerGroup = new Factory()
  .sequence('id', index => `cg-${index}`)
  .sequence('name', index => `Customer Group ${index}`);

export default CustomerGroup;
