import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

import SelectField from '../../../pages/manage-reservations/inputs/SelectField';
import injectT from '../../../i18n/injectT';
import { mapResourceOptions } from './massCancelUtils';
import RequiredSpan from './RequiredSpan';


function MassCancelForm({
  t, resources, selectedResource, setSelectedResource, errors, handleOnBlur,
  startDate, setStartDate, endDate, setEndDate, confirmCancel, setConfirmCancel
}) {
  return (
    <React.Fragment>
      <p>{t('MassCancel.instructions')}</p>
      <SelectField
        error={errors.selectedResource}
        id="mass-cancel-resource"
        isRequired
        label={t('MassCancel.resourceLabel')}
        onChange={(event) => { setSelectedResource(event.value); handleOnBlur('selectedResource'); }}
        options={mapResourceOptions(resources)}
        value={selectedResource}
      />
      <FormGroup controlId="mass-cancel-start-date">
        <ControlLabel>
          {t('MassCancel.datetime.startLabel')}
          <RequiredSpan />
        </ControlLabel>
        <FormControl
          aria-describedby={errors.startDate ? 'mass-cancel-start-date-error' : null}
          aria-required="true"
          id="mass-cancel-start-date"
          onBlur={() => handleOnBlur('startDate')}
          onChange={(event) => setStartDate(event.target.value)}
          type="datetime-local"
          value={startDate}
        />
        {errors.startDate && (
          <HelpBlock
            className="has-error"
            id="mass-cancel-start-date-error"
            role="alert"
          >
            {t(errors.startDate)}
          </HelpBlock>
        )}
      </FormGroup>
      <FormGroup controlId="mass-cancel-end-date">
        <ControlLabel>
          {t('MassCancel.datetime.endLabel')}
          <RequiredSpan />
        </ControlLabel>
        <FormControl
          aria-describedby={errors.endDate ? 'mass-cancel-end-date-error' : null}
          aria-required="true"
          id="mass-cancel-end-date"
          onBlur={() => handleOnBlur('endDate')}
          onChange={(event) => setEndDate(event.target.value)}
          type="datetime-local"
          value={endDate}
        />
        {errors.endDate && (
          <HelpBlock
            className="has-error"
            id="mass-cancel-end-date-error"
            role="alert"
          >
            {t(errors.endDate)}
          </HelpBlock>
        )}
      </FormGroup>
      <Checkbox
        aria-required="true"
        checked={confirmCancel}
        onBlur={() => handleOnBlur('confirmCancel')}
        onChange={(event) => setConfirmCancel(event.target.checked)}
      >
        {t('MassCancel.confirmCancel')}
      </Checkbox>
    </React.Fragment>
  );
}

MassCancelForm.propTypes = {
  t: PropTypes.func.isRequired,
  resources: PropTypes.arrayOf(PropTypes.object),
  selectedResource: PropTypes.string.isRequired,
  setSelectedResource: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  startDate: PropTypes.string.isRequired,
  setStartDate: PropTypes.func.isRequired,
  endDate: PropTypes.string.isRequired,
  setEndDate: PropTypes.func.isRequired,
  confirmCancel: PropTypes.bool.isRequired,
  setConfirmCancel: PropTypes.func.isRequired,
  handleOnBlur: PropTypes.func.isRequired,
};

export default injectT(MassCancelForm);
