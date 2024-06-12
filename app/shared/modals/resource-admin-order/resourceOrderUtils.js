import sortBy from 'lodash/sortBy';

import { buildAPIUrl, getHeadersCreator } from '../../../utils/apiUtils';


/**
 * Sends resource order to API
 * @param {string[]} resourceIDs resource order list
 * @param {Object} state redux state
 * @returns {Object} object containing errorOccurred bool and code int
 */
export async function sendResourceOrder(resourceIDs, state) {
  const apiUrl = buildAPIUrl('user/set_admin_resource_order');
  const payload = { admin_resource_order: resourceIDs };
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: getHeadersCreator()(state),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    return { errorOccurred: true, code: response.status };
  }
  return { errorOccurred: false, code: response.status };
}

/**
 * Returns array of resource IDs
 * @param {Object[]} resources
 * @returns array or resource IDs
 */
export function getResourceIDs(resources) {
  return resources.map(resource => resource.id);
}

/**
 * Sorts resources by idOrder
 * @param {Object[]} resources
 * @param {string[]} idOrder
 * @returns {Object[]} sorted resources
 */
export function sortResources(resources, idOrder) {
  const sortedByName = sortBy(resources, 'name');

  return sortedByName.sort((a, b) => {
    const aIndex = idOrder.indexOf(a.id);
    const bIndex = idOrder.indexOf(b.id);

    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }

    if (aIndex !== -1) {
      return -1;
    }

    if (bIndex !== -1) {
      return 1;
    }

    return 0;
  });
}

const grid = 8;

/**
 * returns items style for draggable element
 * @param {boolean} isDragging
 * @param {object} draggableStyle
 * @returns {object} style object
 */
export function getItemStyle(isDragging, draggableStyle) {
  return {
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? 'lightgreen' : 'white',

    ...draggableStyle,
    left: 'auto !important',
    top: 'auto !important',
  };
}

/**
 * Returns style for drag and drop list container
 * @returns {object} style object
 */
export function getListStyle() {
  return {
    background: 'lightgrey',
    padding: grid,
    width: 'auto'
  };
}
