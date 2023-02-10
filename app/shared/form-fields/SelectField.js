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
        value={option.value || option.id}
      >
        {option.name}
      </option>
    );
    return optionElement;
  });

  return [firstOption, ...selectOptions];
}

/**
 * Returns a FormGroup for each additional field that a universal field can have.
 * Additional fields include: description, url and iframe.
 * @param t
 * @param label
 * @param {object} universalFieldData
 * @param {string} [universalFieldData.description] - text rendered below the select element.
 * @param {object} [universalFieldData.data]
 * @param {string} [universalFieldData.data.url] - url of img that is rendered below description.
 * @param {string} [universalFieldData.data.iframe] - string containing iframe html.
 * @returns {JSX.Element}
 */
function getAdditionalUniversalFields(t, label, universalFieldData) {
  const wrapper = props => (
    <FormGroup>
      <Col sm={3}>
        <div />
      </Col>
      <Col sm={9}>
        {props}
      </Col>
    </FormGroup>
  );

  const skipTo = value => `javascript:document.getElementById('${value}').focus()`;
  const { description, data } = universalFieldData;
  return (
    <React.Fragment>
      {description && wrapper(<p>{description}</p>)}
      {data && data.url && wrapper(<img alt={t('ReservationForm.universalField.pictureAlt', { label })} className="universal-data-image" src={data.url} />)}
      {/* eslint-disable-next-line react/no-danger */}
      {data && data.iframe && wrapper(
        <React.Fragment>
          <a className="visually-hidden" href={skipTo('skip-end')} id="skip-start" target="_self">{t('ReservationForm.universalField.iframe.skipToAfter')}</a>
          <div dangerouslySetInnerHTML={{ __html: data.iframe }} />
          <a className="visually-hidden" href={skipTo('skip-start')} id="skip-end" target="_self">{t('ReservationForm.universalField.iframe.skipToBefore')}</a>
        </React.Fragment>
      )
      }
    </React.Fragment>
  );
}

function SelectField({
  controlProps = {}, fieldName, help, id, info, label,
  labelErrorPrefix, validationState, t, universalFieldData
}) {
  const helpBlockId = `${id}-help-block`;
  if (!controlProps.options.length) {
    return <div />;
  }
  return (
    <React.Fragment>
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
      {universalFieldData && getAdditionalUniversalFields(t, label, universalFieldData)}
    </React.Fragment>
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
  universalFieldData: PropTypes.object
};

export default injectT(SelectField);
