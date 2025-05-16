import { useEffect } from 'react';
import L from 'leaflet';
import PropTypes from 'prop-types';

const Polyline = ({ map, coordinates }) => {
  useEffect(() => {
    if (!map || !coordinates.length) return;

    const polyline = L.polyline(coordinates, {
      color: 'blue',
      weight: 4,
    }).addTo(map);

    return () => {
      map.removeLayer(polyline);
    };
  }, [map, coordinates]);

  return null;
};

Polyline.propTypes = {
  map: PropTypes.object.isRequired,
  coordinates: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.number)
  ).isRequired,
};

export default Polyline;