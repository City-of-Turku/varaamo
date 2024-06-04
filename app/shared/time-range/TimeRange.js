import upperFirst from 'lodash/upperFirst';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import { formatDatetimeToString } from '../../utils/timeUtils';
import injectT from '../../i18n/injectT';

function TimeRange(props) {
  const {
    begin,
    className,
    beginFormat,
    end,
    endFormat,
    isMultiday,
    t,
  } = props;
  const beginMoment = moment(begin);
  const endMoment = moment(end);
  let rangeString = '';
  if (isMultiday) {
    rangeString = `${formatDatetimeToString(beginMoment, t)} \u2013 ${formatDatetimeToString(endMoment, t)}`;
  } else {
    rangeString = `${beginMoment.format(beginFormat)} \u2013 ${endMoment.format(endFormat)}`;
  }
  const ISORangeString = `${begin}/${end}`;

  return (
    <time className={className} dateTime={ISORangeString}>
      {upperFirst(rangeString)}
    </time>
  );
}

TimeRange.propTypes = {
  begin: PropTypes.string.isRequired,
  beginFormat: PropTypes.string,
  className: PropTypes.string,
  end: PropTypes.string.isRequired,
  endFormat: PropTypes.string,
  isMultiday: PropTypes.bool,
  t: PropTypes.func.isRequired,
};

TimeRange.defaultProps = {
  beginFormat: 'dddd, LLL',
  endFormat: 'LT',
  isMultiday: false,
};

export default injectT(TimeRange);
