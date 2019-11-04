import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import iconHeart from 'hel-icons/dist/shapes/heart-o.svg';

import { injectT } from 'i18n';
import iconHeartFilled from 'assets/icons/heart-filled.svg';
import { cleanseNamedLinks } from 'utils/textUtils';
import { getResourcePageUrlComponents } from 'utils/resourceUtils';
import { getMainImage } from 'utils/imageUtils';
import ResourceAvailability from 'shared/resource-card/label';


function FavoriteItem({
  resource, t, key, date, handleClick, actions, isLarger
}) {
  const { pathname, query } = getResourcePageUrlComponents(resource, date);
  const linkTo = {
    pathname,
    search: query ? `?${query}` : undefined,
    state: { fromSearchResults: false },
  };
  const imgObj = getMainImage(resource.images);
  const isFavorite = resource.isFavorite ? iconHeartFilled : iconHeart;

  return (
    <Col key={key} lg={isLarger ? 4 : 3} md={4} sm={6} xs={12}>
      <Col className="favorite-container" xs={12}>
        <Row>
          <Col aria-hidden="true" className="favorite-image-container" xs={12}>
            <Link
              aria-hidden="true"
              onClick={handleClick}
              tabIndex="-1"
              to={linkTo}
            >
              <img alt={imgObj.caption} className="favorite-image" src={imgObj.url} />
            </Link>
          </Col>
        </Row>
        <Row>
          <Col className="favorite-content" xs={12}>
            <Row>
              <Col className="favorite-title" xs={12}>
                <Link
                  onClick={handleClick}
                  to={linkTo}
                >
                  <h2>
                    {resource.name}
                  </h2>
                </Link>
              </Col>
            </Row>
            <Row>
              <Col className="favorite-availability" xs={12}>
                <ResourceAvailability date={date} resource={resource} />
                <button
                  onClick={
                  resource.isFavorite
                    ? () => actions.unfavoriteResource(resource.id)
                    : () => actions.favoriteResource(resource.id)}
                  title={
                    resource.isFavorite
                      ? t('ResourceCard.infoTitle.removeFavorite')
                      : t('ResourceCard.infoTitle.addFavorite')
                    }
                  type="button"
                >
                  <img alt="test" className="app-ResourceCard__info-cell__icon" src={isFavorite} />
                </button>
              </Col>
            </Row>
            <Row>
              <Col className="favorite-description" xs={12}>
                {cleanseNamedLinks(resource.description)}
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Col>
  );
}

FavoriteItem.propTypes = {
  resource: PropTypes.object,
  t: PropTypes.func,
  key: PropTypes.number,
  date: PropTypes.string,
  handleClick: PropTypes.func,
  actions: PropTypes.object,
  isLarger: PropTypes.bool
};
export default injectT(FavoriteItem);
