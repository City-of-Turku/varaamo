import PropTypes from 'prop-types';
import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import RBCheckbox from 'react-bootstrap/lib/Checkbox';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Button from 'react-bootstrap/lib/Button';

function TermsField({
  input, label, labelLink, meta, onClick, isRequired
}) {
  const showError = meta.error && meta.touched;
  return (
    <FormGroup
      className="terms-checkbox-field"
      controlId={input.name}
      validationState={showError ? 'error' : undefined}
    >
      <Col sm={9}>
        <RBCheckbox aria-required={isRequired} {...input}>
          {label}
          <Button
            className="terms-checkbox-field-link"
            onClick={onClick}
            variant="link"
          >
            {labelLink}
          </Button>
          {isRequired && '*'}
          {showError && <HelpBlock>{meta.error}</HelpBlock>}
        </RBCheckbox>
      </Col>
    </FormGroup>
  );
}

TermsField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  labelLink: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  isRequired: PropTypes.bool.isRequired
};

export default TermsField;
