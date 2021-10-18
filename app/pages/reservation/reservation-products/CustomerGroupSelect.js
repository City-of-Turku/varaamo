import React from 'react';
import PropTypes from 'prop-types';

import injectT from '../../../i18n/injectT';

function CustomerGroupSelect({
  currentlySelectedGroup, onChange, customerGroups, t
}) {
  const groupOptions = customerGroups.map(group => (
    <option key={group.id} value={group.id}>
      {group.name}
    </option>
  ));

  const inputId = 'customer-group-select';
  return (
    <div>
      <label htmlFor={inputId}>
        {t('ReservationProducts.select.clientGroup.label')}
        <select
          id={inputId}
          name="customer-groups"
          onChange={onChange}
          value={currentlySelectedGroup}
        >
          <option disabled hidden value="">{t('common.select')}</option>
          {groupOptions}
        </select>
      </label>
    </div>
  );
}

CustomerGroupSelect.propTypes = {
  currentlySelectedGroup: PropTypes.string.isRequired,
  customerGroups: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(CustomerGroupSelect);
