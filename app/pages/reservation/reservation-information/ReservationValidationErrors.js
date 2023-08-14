import React from 'react';
import PropTypes from 'prop-types';

import injectT from '../../../i18n/injectT';
import { capitalizeFirst } from '../../../utils/textUtils';
import { mapReservationErrors } from '../../../utils/reservationUtils';


function ReservationValidationErrors({
  formErrors, universalFields, showFormErrorList, t
}) {
  if (!showFormErrorList) {
    return <div id="information-page-validation-and-errors" role="alert" />;
  }

  const mappedErrors = mapReservationErrors(formErrors, universalFields);
  const errorMessages = mappedErrors.map(error => {
    if (error.forBilling) {
      return (
        <li key={error.id}>
          {`${t('ReservationForm.validation.payer.label')} `}
          <span className="text-lowercase">{t(error.label)}</span>
        </li>
      );
    }
    // universal field has its own translations
    if (error.id === 'universalData') {
      return <li key={error.id}>{capitalizeFirst(error.label)}</li>;
    }
    return <li key={error.id}>{capitalizeFirst(t(error.label))}</li>;
  });

  return (
    <div id="information-page-validation-and-errors" role="alert">
      <div>
        <p className="validation-error-label">
          {t('ReservationProducts.validation.label')}
        </p>
        <ul>
          {errorMessages}
        </ul>
      </div>
    </div>
  );
}

ReservationValidationErrors.propTypes = {
  universalFields: PropTypes.arrayOf(PropTypes.object),
  t: PropTypes.func.isRequired,
  formErrors: PropTypes.arrayOf(PropTypes.string),
  showFormErrorList: PropTypes.bool.isRequired,
};

export default injectT(ReservationValidationErrors);
