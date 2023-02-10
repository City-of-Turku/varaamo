import moment from 'moment';
import { Factory } from 'rosie';

const BASE_DATE = moment().add(2, 'days');

const Reservation = new Factory()
  .option('startTime', null)
  .sequence('index')
  .attr('begin', ['index', 'startTime'], (index, startTime) => (
    startTime
      ? startTime.toISOString()
      : moment(BASE_DATE).set('hour', (index + 2) % 24).toISOString()
  ))
  .attr('comments', null)
  .attr('end', ['index', 'startTime'], (index, startTime) => (
    startTime
      ? startTime.add(1, 'hours').toISOString()
      : moment(BASE_DATE).set('hour', (index + 3) % 24).toISOString()
  ))
  .attr('needManualConfirmation', false)
  .attr('resource', 'r-1')
  .attr('state', 'confirmed')
  .attr('url', ['index'], index => (
    `http://api.hel.fi/respa/v1/reservation/${index}/`
  ));

const UniversalData = new Factory()
  .option('generateOptions', false)
  .attr('type', 'select')
  .attr('selectedOption', '1')
  .attr('field', ['selectedOption'], () => ({
    id: 1,
    label: 'universal field label text',
    description: 'universal field description text',
    options: [
      { id: 1, text: 'option-1' },
      { id: 2, text: 'option-2' },
      { id: 3, text: 'option-3' },
      { id: 4, text: 'option-4' },
    ]
  }));

export { UniversalData };
export default Reservation;
