import React from 'react';
import PropTypes from 'prop-types';

import injectT from '../../../i18n/injectT';

function CustomerGroupSelect({
  currentlySelectedGroup, onChange, customerGroups, hasError, isRequired, t
}) {
  const groupOptions = customerGroups.map(group => (
    <option key={group.id} value={group.id}>
      {group.name}
    </option>
  ));

  const inputId = 'customer-group-select';
  return (
    <div id="customer-group-select-wrapper">
      <label htmlFor={inputId}>
        <span className={hasError ? 'has-error' : ''} id="customer-group-select-label">
          {t('ReservationProducts.select.clientGroup.label')}
          {isRequired && (
            <span aria-hidden="true">*</span>
          )}
        </span>
        <select
          aria-invalid={hasError}
          aria-required={isRequired}
          id={inputId}
          name="customer-groups"
          onChange={onChange}
          value={currentlySelectedGroup}
        >
          <option disabled hidden value="">{t('common.select')}</option>
          {groupOptions}
        </select>
      </label>
      {hasError && (
        <p aria-hidden="true" className="has-error">{t('ReservationForm.requiredError')}</p>
      )}
    </div>
  );
}

CustomerGroupSelect.defaultProps = {
  hasError: false,
  isRequired: false,
};

CustomerGroupSelect.propTypes = {
  currentlySelectedGroup: PropTypes.string.isRequired,
  customerGroups: PropTypes.array.isRequired,
  hasError: PropTypes.bool,
  isRequired: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(CustomerGroupSelect);
