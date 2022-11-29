import React from 'react';
import PropTypes from 'prop-types';
import upperFirst from 'lodash/upperFirst';

function ZipAndMunicipality({ unit }) {
  const addressZip = unit && unit.addressZip ? unit.addressZip : '';
  const municipality = unit && unit.municipality ? upperFirst(unit.municipality) : '';

  if (!unit || (!addressZip && !municipality)) {
    return null;
  }

  return (
    <span>{`${addressZip} ${municipality}`.trim()}</span>
  );
}

ZipAndMunicipality.defaultProps = {
  unit: undefined
};

ZipAndMunicipality.propTypes = {
  unit: PropTypes.object
};

export default ZipAndMunicipality;
