import PropTypes from 'prop-types';
import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

import { injectT } from 'i18n';
import InfoPopover from 'shared/info-popover';

function getOptionElements(options, t) {
  const firstOptionLabel = options.length > 0
    ? t('common.select') : t('SelectControl.noOptions');
  const firstOption = <option hidden key="-1" value="">{firstOptionLabel}</option>;
  const selectOptions = options.map((option) => {
    const optionElement = (
      <option
        key={option.id}
        value={option.id}
      >
        {option.name}
      </option>
    );
    return optionElement;
  });

  return [firstOption, ...selectOptions];
}

function SelectField({
  controlProps = {}, fieldName, help, id, info, label, labelErrorPrefix, validationState, t
}) {
  const helpBlockId = `${id}-help-block`;

  return (
    <FormGroup controlId={id} validationState={validationState}>
      <Col componentClass={ControlLabel} sm={3}>
        {validationState && labelErrorPrefix}
        {label}
        {' '}
        {info && <InfoPopover id={`${id}-info`} placement="right" text={info} />}
      </Col>
      <Col sm={9}>
        <select
          {...controlProps}
          aria-describedby={helpBlockId}
          aria-invalid={validationState ? 'true' : 'false'}
          className="select-input"
          id={id}
          name={fieldName}
        >
          { getOptionElements(controlProps.options, t)}
        </select>
        <HelpBlock id={helpBlockId}>{help}</HelpBlock>
      </Col>
    </FormGroup>
  );
}

SelectField.propTypes = {
  controlProps: PropTypes.object,
  fieldName: PropTypes.string.isRequired,
  help: PropTypes.string,
  id: PropTypes.string.isRequired,
  info: PropTypes.string,
  label: PropTypes.string.isRequired,
  labelErrorPrefix: PropTypes.string.isRequired,
  validationState: PropTypes.string,
  t: PropTypes.func.isRequired,
};

export default injectT(SelectField);
