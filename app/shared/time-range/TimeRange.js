import upperFirst from 'lodash/upperFirst';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class TimeRange extends Component {
  render() {
    const {
      begin,
      className,
      beginFormat,
      end,
      endFormat,
    } = this.props;
    const beginMoment = moment(begin);
    const endMoment = moment(end);
    const sameDay = beginMoment.day() === endMoment.day();
    const foo = endMoment.day() > beginMoment.day() ? 'LLL' : endFormat;
    const bar = sameDay ? beginFormat : 'LLL';
    const rangeString = `${beginMoment.format(bar)} \u2013 ${endMoment.format(foo)}`;
    const ISORangeString = `${begin}/${end}`;

    return (
      <time className={className} dateTime={ISORangeString}>
        {upperFirst(rangeString)}
      </time>
    );
  }
}

TimeRange.propTypes = {
  begin: PropTypes.string.isRequired,
  beginFormat: PropTypes.string,
  className: PropTypes.string,
  end: PropTypes.string.isRequired,
  endFormat: PropTypes.string,
};

TimeRange.defaultProps = {
  beginFormat: 'dddd, LLL',
  endFormat: 'LT',
};

export default TimeRange;
