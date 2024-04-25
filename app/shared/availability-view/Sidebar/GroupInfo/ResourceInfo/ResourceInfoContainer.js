import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createSelector } from 'reselect';

import UnpublishedLabel from 'shared/label/Unpublished';
import Label from 'shared/label';
import { injectT } from 'i18n';
import { resourcesSelector } from 'state/selectors/dataSelectors';

ResourceInfo.propTypes = {
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  peopleCapacity: PropTypes.number,
  public: PropTypes.bool.isRequired,
  hasStaffRights: PropTypes.bool,
  t: PropTypes.func.isRequired,
  overnightReservations: PropTypes.bool.isRequired,
};
export function ResourceInfo(props) {
  const { overnightReservations } = props;
  return (
    <div
      className={classNames(
        'resource-info',
        {
          'resource-info-selected': props.isSelected,
          'is-external': !props.hasStaffRights,
          'is-overnight': props.overnightReservations,
        })
    }
      title={props.name}
    >
      <div className="name">
        <Link to={`/resources/${props.id}?date=${props.date}`}>{props.name}</Link>
      </div>
      <div className="details">
        {!overnightReservations && (
          <React.Fragment>
            <Glyphicon glyph="user" />
            {' '}
            {props.peopleCapacity}
            {!props.public && (
            <UnpublishedLabel />
            )}
            {!props.hasStaffRights && (
            <Label bsStyle="default" className="unpublished-label">
              {props.t('AdminResourcesPage.external.label')}
            </Label>
            )}
          </React.Fragment>
        )}
        {overnightReservations && (
          <Label bsStyle="default" className="unusable-label" title={props.t('AdminResourcesPage.label.notUsable')}>
            {props.t('AdminResourcesPage.label.notUsable')}
          </Label>
        )}
      </div>
    </div>
  );
}

export function selector() {
  function idSelector(state, props) {
    return props.id;
  }
  const resourceSelector = createSelector(
    resourcesSelector,
    idSelector,
    (resources, id) => resources[id]
  );
  return createSelector(
    resourceSelector,
    resource => {
      const { isAdmin, isManager, isViewer } = resource.userPermissions;
      return {
        name: resource.name,
        peopleCapacity: resource.peopleCapacity,
        public: resource.public,
        hasStaffRights: isAdmin || isManager || isViewer,
        overnightReservations: resource.overnightReservations,
      };
    }
  );
}

export const UnconnectedResourceInfo = injectT(ResourceInfo);

const ResourceInfoContainer = connect(selector)(UnconnectedResourceInfo);
ResourceInfoContainer.propTypes = {
  id: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
};
export default ResourceInfoContainer;
