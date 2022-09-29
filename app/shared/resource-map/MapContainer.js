import constants from 'constants/AppConstants';

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Map, TileLayer, ZoomControl } from 'react-leaflet';
import { connect } from 'react-redux';

import { searchMapClick, selectUnit } from 'actions/searchActions';
import { getCurrentCustomization } from 'utils/customizationUtils';
import selector from './mapSelector';
import Marker from './Marker';
import UserMarker from './UserMarker';


const defaultPosition = {
  null: [60.451389, 22.266667],
  ESPOO: [60.205490, 24.755899],
  VANTAA: [60.29414, 25.14099],
};
const defaultZoom = 12;

const defaultTilesUrl = constants.MAP_TILE_URLS.DEFAULT_TILES;
const highContrastTilesUrl = constants.MAP_TILE_URLS.HIGH_CONTRAST_TILES;

export class UnconnectedResourceMapContainer extends React.Component {
  static propTypes = {
    boundaries: PropTypes.shape({
      maxLatitude: PropTypes.number,
      minLatitude: PropTypes.number,
      maxLongitude: PropTypes.number,
      minLongitude: PropTypes.number,
    }),
    currentLanguage: PropTypes.string.isRequired,
    markers: PropTypes.array,
    useHighContrast: PropTypes.bool.isRequired,
    position: PropTypes.object,
    searchMapClick: PropTypes.func.isRequired,
    selectedUnitId: PropTypes.string,
    selectUnit: PropTypes.func.isRequired,
    shouldMapFitBoundaries: PropTypes.bool.isRequired,
    showMap: PropTypes.bool.isRequired,
  };

  componentDidUpdate(prevProps) {
    if (this.map && (
      prevProps.boundaries !== this.props.boundaries
        || prevProps.shouldMapFitBoundaries !== this.props.shouldMapFitBoundaries
    )
    ) {
      this.fitMapToBoundaries();
    }
  }

  onMapRef = (map) => {
    this.map = map;
    this.fitMapToBoundaries();
  }

  getBounds() {
    const boundaries = this.props.boundaries;
    return [
      [boundaries.minLatitude, boundaries.minLongitude],
      [boundaries.maxLatitude, boundaries.maxLongitude],
    ];
  }

  getCenter = () => (
    this.props.position
      ? [this.props.position.lat, this.props.position.lon]
      : defaultPosition[getCurrentCustomization()]
  );

  fitMapToBoundaries = () => {
    if (this.map) {
      if (this.hasBoundaries() && this.props.shouldMapFitBoundaries) {
        this.map.leafletElement.fitBounds(this.getBounds());
      } else {
        this.map.leafletElement.panTo(this.getCenter(), defaultZoom);
      }
    }
  }

  hasBoundaries() {
    const boundaries = this.props.boundaries;
    return (
      boundaries.minLatitude
      || boundaries.minLongitude
      || boundaries.maxLatitude
      || boundaries.maxLongitude
    );
  }

  render() {
    const { useHighContrast, currentLanguage } = this.props;
    const mapLanguage = currentLanguage === 'sv' ? 'sv' : 'fi';
    const mapUrl = `${useHighContrast ? highContrastTilesUrl : defaultTilesUrl}@${mapLanguage}.png`;

    return (
      <div className={classNames('app-ResourceMap', { 'app-ResourceMap__showMap': this.props.showMap })}>
        <Map
          center={this.getCenter()}
          className="app-ResourceMap__map"
          onClick={this.props.searchMapClick}
          ref={this.onMapRef}
          zoom={defaultZoom}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url={mapUrl}
          />
          <ZoomControl position="bottomright" />
          {this.props.markers && this.props.markers.map(
            marker => (
              <Marker
                {...marker}
                highlighted={this.props.selectedUnitId === marker.unitId}
                key={marker.unitId}
                selectUnit={this.props.selectUnit}
              />
            )
          )}
          {this.props.position
            && (
            <UserMarker
              latitude={this.props.position.lat}
              longitude={this.props.position.lon}
            />
            )
          }
        </Map>
      </div>
    );
  }
}

const actions = {
  selectUnit,
  searchMapClick,
};

export default connect(selector, actions)(UnconnectedResourceMapContainer);
