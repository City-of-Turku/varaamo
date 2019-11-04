import PropTypes from 'prop-types';
import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import RBFormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

import InfoPopover from 'shared/info-popover';

function FormControl({
  controlProps = {}, fieldName, help, id, info, label, labelErrorPrefix, type, validationState
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
        <RBFormControl
          {...controlProps}
          aria-describedby={helpBlockId}
          aria-invalid={validationState ? 'true' : 'false'}
          componentClass={type === 'textarea' ? 'textarea' : undefined}
          name={fieldName}
          type={type !== 'textarea' ? type : undefined}
        />
        <HelpBlock id={helpBlockId}>{help}</HelpBlock>
      </Col>
    </FormGroup>
  );
}

FormControl.propTypes = {
  controlProps: PropTypes.object,
  fieldName: PropTypes.string.isRequired,
  help: PropTypes.string,
  id: PropTypes.string.isRequired,
  info: PropTypes.string,
  label: PropTypes.string.isRequired,
  labelErrorPrefix: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  validationState: PropTypes.string,
};

export default FormControl;
