import PropTypes from 'prop-types';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { injectT } from 'i18n';
import ResourceCard from 'shared/resource-card';
import selector from './ResourceCompactListSelector';

export class UnconnectedResourceCompactList extends React.Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    resourceIds: PropTypes.array.isRequired,
    t: PropTypes.func.isRequired,
    isLargerFontSizeUsed: PropTypes.bool,
  };

  state = {
    resourcePosition: 0,
  };

  UNSAFE_componentWillReceiveProps() {
    this.setState({
      resourcePosition: 0,
    });
  }

  onPreviousResource = () => {
    // Javascript mod operator (%) does not work as expected an the module of a negative number
    // is calculated like -(i % i_max) which would lead on a negative resourcePosition.
    this.setState(prevState => ({
      resourcePosition:
        // eslint-disable-next-line no-mixed-operators
        (prevState.resourcePosition - 1 + this.props.resourceIds.length)
        % this.props.resourceIds.length,
    }));
  };

  onNextResource = () => {
    this.setState(prevState => ({
      resourcePosition: (prevState.resourcePosition + 1) % this.props.resourceIds.length,
    }));
  };

  render() {
    const { resourcePosition } = this.state;
    const {
      resourceIds, location, history, date, t, isLargerFontSizeUsed
    } = this.props;
    const resourceIdsLength = resourceIds.length;
    return (
      <div className={classNames(
        'app-ResourceCompactList',
        isLargerFontSizeUsed && 'app-ResourceCompactList__large-font-size'
      )}
      >
        {Boolean(resourceIds.length - 1) && (
          <Button
            aria-label={t('ResourceCompactList.button.label.previous')}
            bsStyle="primary"
            className="app-ResourceCompactList_arrow app-ResourceCompactList_arrow-left"
            disabled={resourcePosition === 0}
            onClick={this.onPreviousResource}
          />
        )}
        <ResourceCard
          date={date}
          history={history}
          location={location}
          resourceId={resourceIds[resourcePosition]}
          stacked={Boolean(resourceIdsLength - 1)}
        />
        {Boolean(resourceIdsLength - 1) && (
          <Button
            aria-label={t('ResourceCompactList.button.label.next')}
            bsStyle="primary"
            className="app-ResourceCompactList_arrow app-ResourceCompactList_arrow-right"
            disabled={resourcePosition === resourceIdsLength - 1}
            onClick={this.onNextResource}
          />
        )}
      </div>
    );
  }
}

UnconnectedResourceCompactList = injectT(UnconnectedResourceCompactList); // eslint-disable-line

export default connect(selector)(UnconnectedResourceCompactList);
