import PropTypes from 'prop-types';
import React from 'react';
import indexOf from 'lodash/indexOf';

import { injectT } from 'i18n';
import ReservationPhase from './ReservationPhase';

ReservationPhases.propTypes = {
  currentPhase: PropTypes.string.isRequired,
  hasProducts: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool,
  isStaff: PropTypes.bool,
  needManualConfirmation: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

function ReservationPhases({
  currentPhase, hasProducts, isEditing, isStaff, needManualConfirmation, t
}) {
  const includePayments = hasProducts && !isEditing;
  const manuallyConfirmedForStaff = isStaff && needManualConfirmation;
  const phases = [];
  if (isEditing) {
    phases.push('time');
  }
  if (includePayments) {
    phases.push('products');
  }
  phases.push('information');
  if (includePayments && (manuallyConfirmedForStaff || !needManualConfirmation)) {
    phases.push('payment');
  }
  phases.push('confirmation');

  const activeIndex = indexOf(phases, currentPhase);

  return (
    <div aria-hidden="true" className="app-ReservationPage__phases row">
      {phases.map((phase, index) => (
        <ReservationPhase
          cols={12 / phases.length}
          index={index + 1}
          isActive={phase === currentPhase}
          isCompleted={index < activeIndex}
          key={phase}
          title={t(`ReservationPhase.${phase}Title`)}
        />
      ))}
    </div>
  );
}

export default injectT(ReservationPhases);
