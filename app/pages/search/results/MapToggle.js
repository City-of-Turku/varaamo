import PropTypes from 'prop-types';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import classNames from 'classnames';

import { injectT } from 'i18n';

MapToggle.propTypes = {
  mapVisible: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  resultCount: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
  contrast: PropTypes.string,
  hideToggleButtons: PropTypes.bool.isRequired,
};

function MapToggle({
  mapVisible, onClick, resultCount, t, contrast, hideToggleButtons
}) {
  return (
    <section className={`app-MapToggle ${contrast}`}>
      <Grid>
        <Row>
          <Col sm={6}>
            <div className="app-MapToggle__results-count" role="status">
              {resultCount ? t('MapToggle.resultsText', { count: resultCount }) : t('MapToggle.noResultsText')}
            </div>
          </Col>
          {!hideToggleButtons && (
            <Col sm={6}>
              <div className="pull-right">
                <Button
                  aria-selected={!mapVisible}
                  className={classNames('app-MapToggle__button-list', !mapVisible && 'active-tab')}
                  onClick={!mapVisible ? undefined : onClick}
                  role="tab"
                >
                  {t('MapToggle.showList')}
                </Button>
                <Button
                  aria-selected={mapVisible}
                  className={classNames('app-MapToggle__button-map', mapVisible && 'active-tab')}
                  onClick={mapVisible ? undefined : onClick}
                  role="tab"
                >
                  {t('MapToggle.showMap')}
                </Button>
              </div>
            </Col>
          )}
        </Row>
      </Grid>
    </section>
  );
}

export default injectT(MapToggle);
