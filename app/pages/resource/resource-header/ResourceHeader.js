import PropTypes from 'prop-types';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import { FormattedNumber } from 'react-intl';
import round from 'lodash/round';

import iconHome from 'assets/icons/home.svg';
import iconMapMarker from 'assets/icons/map-marker.svg';
import iconTicket from 'assets/icons/ticket.svg';
import iconUser from 'assets/icons/user-o.svg';
import { injectT } from 'i18n';
import iconClock from 'assets/icons/clock-o.svg';
import iconMap from 'assets/icons/map.svg';
import FavoriteButton from 'shared/favorite-button';
import { getPrice, getMaxPeriodText } from 'utils/resourceUtils';

function ResourceHeader({
  onBackClick,
  onMapClick,
  isLoggedIn,
  resource,
  showBackButton,
  showMap,
  unit,
  t,
  contrast,
  showOutlookCalendarLinkButton,
  outlookLinkExists,
  onOutlookCalendarLinkCreateClick,
  onOutlookCalendarLinkRemoveClick,
}) {
  const formatDistance = (distance) => {
    if (!distance) {
      return '';
    }

    const km = distance / 1000;
    const formattedDistance = km < 10 ? round(km, 1) : round(km);
    return (
      <span>
        <FormattedNumber value={formattedDistance} />
        {' km'}
      </span>
    );
  };

  const peopleCapacityText = t('ResourceCard.peopleCapacity', { people: resource.peopleCapacity });
  const maxPeriodText = getMaxPeriodText(t, resource);
  const priceText = getPrice(t, resource);
  const typeName = resource.type ? resource.type.name : '\u00A0';
  const distance = formatDistance(resource.distance);

  let linkButton;
  if (outlookLinkExists) {
    linkButton = (
      <Button
        className="calendar-link-button"
        onClick={onOutlookCalendarLinkRemoveClick}
      >
        {t('ResourceHeader.outlookCalendarRemove')}
      </Button>
    );
  } else {
    linkButton = (
      <Button
        className="calendar-link-button"
        onClick={onOutlookCalendarLinkCreateClick}
      >
        {t('ResourceHeader.outlookCalendarCreate')}
      </Button>
    );
  }

  return (
    <section aria-label={t('ResourceHeader.title')} className={`app-ResourceHeader ${contrast}`}>
      <Grid>
        <div className="app-ResourceHeader__content">
          {showBackButton && (
            <Button
              bsStyle="link"
              className="app-ResourceHeader__back-button"
              onClick={onBackClick}
            >
              {t('ResourceHeader.backButton')}
            </Button>
          )}
          <h1>{resource.name}</h1>
          <div className="app-ResourceHeader__info-wrapper">
            <div className="app-ResourceHeader__info">
              <img alt={t('ResourceHeader.purpose')} className="app-ResourceHeader__info-icon" src={iconHome} />
              <span className="app-ResourceHeader__info-label">{typeName}</span>
            </div>
            <div className="app-ResourceHeader__info">
              <img
                alt={t('ResourceHeader.capacity')}
                className="app-ResourceHeader__info-icon"
                src={iconUser}
              />
              <span className="app-ResourceHeader__info-label">{peopleCapacityText}</span>
            </div>
            {maxPeriodText && (
              <div className="app-ResourceHeader__info" id="resource-header-max-period">
                <img alt={t('ResourceHeader.maxTime')} className="app-ResourceHeader__info-icon" src={iconClock} />
                <span className="app-ResourceHeader__info-label">{`Max ${maxPeriodText}`}</span>
              </div>
            )}
            <div className="app-ResourceHeader__info">
              <img alt={t('ResourceHeader.price')} className="app-ResourceHeader__info-icon" src={iconTicket} />
              <span className="app-ResourceHeader__info-label">{priceText}</span>
            </div>
            <div className="app-ResourceHeader__info" id="app-ResourceHeader__info--unit-name">
              <img alt={distance ? t('ResourceHeader.distanceAndPremise') : t('ResourceHeader.premise')} className="app-ResourceHeader__info-icon" src={iconMapMarker} />
              <span className="app-ResourceHeader__info-label">
                {distance}
                {distance && ', '}
                {unit.name}
              </span>
            </div>
            <div className="app-ResourceHeader__buttons">
              {!showMap && (
                <Button className="app-ResourceHeader__map-button" onClick={onMapClick}>
                  <img alt="" src={iconMap} />
                  <span>{t('ResourceHeader.mapButton')}</span>
                </Button>
              )}
              {showMap && (
                <Button className="app-ResourceHeader__map-button" onClick={onMapClick}>
                  <img alt="" src={iconMap} />
                  <span>{t('ResourceHeader.resourceButton')}</span>
                </Button>
              )}
              {isLoggedIn && <FavoriteButton resource={resource} />}
              { showOutlookCalendarLinkButton && linkButton }

            </div>
          </div>
        </div>
      </Grid>
    </section>
  );
}

ResourceHeader.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  onBackClick: PropTypes.func.isRequired,
  onMapClick: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired,
  showBackButton: PropTypes.bool.isRequired,
  showMap: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
  contrast: PropTypes.string,
  showOutlookCalendarLinkButton: PropTypes.bool.isRequired,
  outlookLinkExists: PropTypes.bool,
  onOutlookCalendarLinkCreateClick: PropTypes.func,
  onOutlookCalendarLinkRemoveClick: PropTypes.func,
};

ResourceHeader = injectT(ResourceHeader); // eslint-disable-line

export default ResourceHeader;
