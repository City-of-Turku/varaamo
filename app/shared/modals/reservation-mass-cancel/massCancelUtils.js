import { buildAPIUrl, getHeadersCreator } from '../../../utils/apiUtils';

export const FORM_INITIAL_VALUES = {
  selectedResource: '',
  startDate: '',
  endDate: '',
  confirmCancel: false,
  cancelling: false,
  errors: {},
};

export const FORM_ERRORS = {
  requiredResource: 'MassCancel.error.required.resource',
  requiredStart: 'MassCancel.error.required.start',
  requiredEnd: 'MassCancel.error.required.end',
  startAfterEnd: 'MassCancel.error.startAfterEnd',
  endBeforeStart: 'MassCancel.error.endBeforeStart',
  confirmCancel: 'MassCancel.error.confirmCancel',
};

/**
 * Maps resources for select component
 * @param {Object[]} resources list of resource objects
 * @returns {Object[]} list of options for select component
 */
export function mapResourceOptions(resources) {
  if (resources) {
    return resources.map(resource => ({
      value: resource.id,
      label: resource.name
    }));
  }
  return [];
}

/**
 * Validates form
 * @param {Object} values form values
 * @returns {Object} errors
 */
export function validateForm(values) {
  const errors = {};
  if (!values.selectedResource) {
    errors.selectedResource = FORM_ERRORS.requiredResource;
  }
  if (!values.startDate) {
    errors.startDate = FORM_ERRORS.requiredStart;
  }
  if (!values.endDate) {
    errors.endDate = FORM_ERRORS.requiredEnd;
  }
  if (values.startDate && values.endDate) {
    const startDate = new Date(values.startDate);
    const endDate = new Date(values.endDate);
    if (startDate > endDate || startDate.getTime() === endDate.getTime()) {
      errors.startDate = FORM_ERRORS.startAfterEnd;
      errors.endDate = FORM_ERRORS.endBeforeStart;
    }
  }
  if (!values.confirmCancel) {
    errors.confirmCancel = FORM_ERRORS.confirmCancel;
  }

  return errors;
}

/**
 * Sends mass cancel request to API
 * @param {string} resourceId resource id
 * @param {string} begin start datetime
 * @param {string} end end datetime
 * @param {Object} state redux state
 * @returns {Object} object containing errorOccurred bool and code int
 */
export async function sendMassCancel(resourceId, begin, end, state) {
  const apiUrl = buildAPIUrl(`resource/${resourceId}/cancel_reservations`);
  const payload = { begin, end };
  const response = await fetch(apiUrl, {
    method: 'DELETE',
    headers: getHeadersCreator()(state),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    return { errorOccurred: true, code: response.status };
  }
  return { errorOccurred: false, code: response.status };
}
